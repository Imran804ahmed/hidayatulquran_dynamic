// Integration tests for the admin portal and the public form endpoints.
// Run against a running app (dev or production) and a TEST database:
//   PORTAL_TEST_URL=http://localhost:3000 npm run test:portal
// Uses the DB_* settings from .env.local. It creates and deletes its own rows (emails @portal-test.invalid).
// NEVER point this at the production database.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

for (const f of [".env.local", ".env"]) if (fs.existsSync(f)) { process.loadEnvFile(f); break; }
const BASE = process.env.PORTAL_TEST_URL ?? "http://localhost:3000";
if (/u970626337|production/i.test(process.env.DB_NAME ?? "")) throw new Error("Refusing to run tests against what looks like the production database.");

let db;
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");
const ago = (sec) => new Date(Date.now() - sec * 1000).toISOString().slice(0, 19).replace("T", " ");
const run = Date.now().toString(36);
const mail = (n) => `t${run}-${n}@portal-test.invalid`;
const users = {};

async function makeUser(key, role, perms = []) {
  const [r] = await db.query("INSERT INTO hq_users (name, email, password_hash, role, status, created_at, updated_at) VALUES (?, ?, 'scrypt$1$1$1$x$x', ?, 'active', ?, ?)", [`Test ${key}`, mail(key), role, now(), now()]);
  for (const p of perms) await db.query("INSERT INTO hq_user_permissions (user_id, permission) VALUES (?, ?)", [r.insertId, p]);
  users[key] = r.insertId;
  return r.insertId;
}
async function session(userId, { lastSeenAgo = 0, expiresIn = 3600 } = {}) {
  const token = crypto.randomBytes(32).toString("base64url");
  await db.query("INSERT INTO hq_sessions (id, user_id, created_at, last_seen_at, expires_at) VALUES (?, ?, ?, ?, ?)", [sha(token), userId, now(), ago(lastSeenAgo), ago(-expiresIn)]);
  return `hq_portal_session=${token}`;
}
const get = (p, cookie) => fetch(BASE + p, { redirect: "manual", headers: cookie ? { cookie } : {} });
const post = (p, fields, headers = {}) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) (Array.isArray(v) ? v : [v]).forEach((x) => fd.append(k, x));
  return fetch(BASE + p, { method: "POST", body: fd, headers: { origin: BASE, ...headers } });
};
const reg = (email, extra = {}) => ({
  fullName: "Portal Test Child", age: "8", country: "uk", guardianName: "Test Parent", whatsappnumber: "+44 7700 900555",
  email, course: "GoldPackage", classes: "5days", "selecteddays[]": ["mon", "tue"], selectedtime: "05:00 pm - 06:00 pm", message: "test", ...extra,
});

before(async () => {
  db = await mysql.createConnection({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT ?? 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD ?? "", database: process.env.DB_NAME, dateStrings: true, timezone: "Z" });
  await db.query("SET time_zone = '+00:00'");
  await makeUser("super", "super_admin");
  await makeUser("coord", "admin", ["dashboard.view", "students.view", "registrations.view"]);
});

after(async () => {
  const ids = Object.values(users);
  await db.query("DELETE FROM hq_sessions WHERE user_id IN (?)", [ids]);
  await db.query("DELETE FROM hq_audit_log WHERE user_id IN (?)", [ids]);
  await db.query("DELETE FROM hq_users WHERE id IN (?)", [ids]);
  const [regs] = await db.query("SELECT id FROM hq_registrations WHERE email LIKE ?", [`t${run}-%`]);
  const [enqs] = await db.query("SELECT id FROM hq_enquiries WHERE email LIKE ?", [`t${run}-%`]);
  if (regs.length) await db.query("DELETE FROM hq_status_history WHERE entity_type = 'registration' AND entity_id IN (?)", [regs.map((r) => r.id)]);
  if (enqs.length) await db.query("DELETE FROM hq_status_history WHERE entity_type = 'enquiry' AND entity_id IN (?)", [enqs.map((r) => r.id)]);
  await db.query("DELETE FROM hq_registrations WHERE email LIKE ?", [`t${run}-%`]);
  await db.query("DELETE FROM hq_enquiries WHERE email LIKE ?", [`t${run}-%`]);
  await db.query("DELETE FROM hq_rate_events WHERE created_at > ?", [ago(3600)]);
  await db.end();
});

/* ---------------- public forms ---------------- */

test("registration form: stored before success, same JSON contract", async () => {
  const r = await post("/api/forms/registration", reg(mail("r1")));
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { success: true, message: "Your registration has been submitted. Thank you!" });
  const [[row]] = await db.query("SELECT status, ref_no, preferred_days FROM hq_registrations WHERE email = ?", [mail("r1")]);
  assert.equal(row.status, "new");
  assert.match(row.ref_no, /^REG-\d{5}$/);
  assert.equal(row.preferred_days, "mon,tue");
});

test("registration form: retry with the same submission_id stores exactly one row", async () => {
  const key = `retry-${run}-0123456789`;
  const a = await (await post("/api/forms/registration", reg(mail("r2"), { submission_id: key }))).json();
  const b = await (await post("/api/forms/registration", reg(mail("r2"), { submission_id: key }))).json();
  assert.equal(a.success, true);
  assert.equal(b.success, true);
  const [[{ c }]] = await db.query("SELECT COUNT(*) AS c FROM hq_registrations WHERE email = ?", [mail("r2")]);
  assert.equal(c, 1);
});

test("registration form: duplicate email keeps the website's original rule and message", async () => {
  const r = await (await post("/api/forms/registration", reg(mail("r1")))).json();
  assert.deepEqual(r, { success: false, message: "This email is already registered. Please use a different email." });
});

test("registration form: validation errors are reported, nothing stored", async () => {
  const missing = await (await post("/api/forms/registration", { fullName: "x", email: mail("r3") })).json();
  assert.equal(missing.message, "Please fill in all required fields.");
  const days = await (await post("/api/forms/registration", reg(mail("r4"), { classes: "3days", "selecteddays[]": ["mon", "tue", "wed", "thu"] }))).json();
  assert.equal(days.success, false);
  const badEmail = await (await post("/api/forms/registration", reg("not-an-email"))).json();
  assert.equal(badEmail.message, "Invalid email address.");
  const [[{ c }]] = await db.query("SELECT COUNT(*) AS c FROM hq_registrations WHERE email IN (?, ?)", [mail("r3"), mail("r4")]);
  assert.equal(c, 0);
});

test("contact form: stored, and per-email rate limit applies after 5 messages", async () => {
  const fields = { fullName: "Portal Tester", email: mail("c1"), subject: "Hello", message: "=HYPERLINK(\"http://evil\")" };
  for (let i = 0; i < 5; i++) assert.equal((await (await post("/api/forms/contact", fields)).json()).success, true);
  const sixth = await post("/api/forms/contact", fields);
  assert.equal(sixth.status, 429);
  assert.equal((await sixth.json()).success, false);
});

test("forms: cross-site POST is blocked, GET is not allowed", async () => {
  const r = await post("/api/forms/contact", { fullName: "x" }, { origin: "https://evil.example" });
  assert.equal(r.status, 403);
  assert.equal((await get("/api/forms/registration")).status, 405);
  assert.equal((await get("/forms/registration.php")).status, 405); // legacy URL still routed (never PHP source)
});

/* ---------------- authentication & sessions ---------------- */

test("unauthenticated: /adminportal shows sign-in, protected pages redirect to login", async () => {
  const home = await get("/adminportal");
  assert.equal(home.status, 200);
  assert.match(await home.text(), /Sign in to the Hidayatul Quran admin portal/);
  const dash = await get("/adminportal/dashboard");
  assert.ok([303, 307].includes(dash.status));
  assert.match(dash.headers.get("location"), /\/adminportal\/login\?next=%2Fadminportal%2Fdashboard/);
  assert.equal((await get("/adminportal/students/export")).status, 401);
});

test("valid session reaches the dashboard; /adminportal redirects to it", async () => {
  const c = await session(users.super);
  assert.equal((await get("/adminportal/dashboard", c)).status, 200);
  const home = await get("/adminportal", c);
  assert.match(home.headers.get("location") ?? "", /\/adminportal\/dashboard$/);
});

test("idle and absolute expiry end the session", async () => {
  const idle = await session(users.super, { lastSeenAgo: 31 * 60 });
  const r1 = await get("/adminportal/dashboard", idle);
  assert.match(r1.headers.get("location") ?? "", /login.*expired=1/);
  const expired = await session(users.super, { expiresIn: -10 });
  assert.match((await get("/adminportal/dashboard", expired)).headers.get("location") ?? "", /login/);
});

test("deleted session (logout) and disabled accounts lose access immediately", async () => {
  const c = await session(users.super);
  assert.equal((await get("/adminportal/dashboard", c)).status, 200);
  await db.query("DELETE FROM hq_sessions WHERE id = ?", [sha(c.split("=")[1])]);
  assert.match((await get("/adminportal/dashboard", c)).headers.get("location") ?? "", /login/);
  const c2 = await session(users.coord);
  await db.query("UPDATE hq_users SET status = 'disabled' WHERE id = ?", [users.coord]);
  assert.match((await get("/adminportal/dashboard", c2)).headers.get("location") ?? "", /login/);
  await db.query("UPDATE hq_users SET status = 'active' WHERE id = ?", [users.coord]);
});

test("post-login redirect only accepts portal paths", async () => {
  for (const evil of ["https://evil.example", "//evil.example", "/adminportal/../etc", "/\\evil"]) {
    const html = await (await get(`/adminportal/login?next=${encodeURIComponent(evil)}`)).text();
    assert.ok(!html.includes(`value="${evil}"`), `next=${evil} must be dropped`);
  }
});

/* ---------------- authorisation ---------------- */

test("permissions are enforced on the server for pages and exports", async () => {
  const c = await session(users.coord);
  assert.equal((await get("/adminportal/students", c)).status, 200);
  const usersPage = await get("/adminportal/users", c);
  assert.match(usersPage.headers.get("location") ?? "", /no-access\?permission=users\.manage/);
  assert.match((await get("/adminportal/settings", c)).headers.get("location") ?? "", /no-access/);
  assert.match((await get("/adminportal/teachers", c)).headers.get("location") ?? "", /no-access/);
  assert.equal((await get("/adminportal/students/export", c)).status, 403);
  assert.equal((await get("/adminportal/registrations/export", c)).status, 403);
});

test("CSV export neutralises spreadsheet formulas and needs the export permission", async () => {
  const c = await session(users.super);
  const res = await get(`/adminportal/enquiries/export?status=all&q=${encodeURIComponent(mail("c1"))}`, c);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /text\/csv/);
  const body = await res.text();
  assert.ok(body.includes(`"'=HYPERLINK(""http://evil"")"`), "formula cell must be prefixed with a quote");
  assert.ok(!/(^|,)=HYPERLINK/m.test(body));
});

test("portal responses are excluded from search indexing", async () => {
  const r = await get("/adminportal/login");
  assert.match(r.headers.get("x-robots-tag") ?? "", /noindex/);
  assert.match(await r.text(), /<meta name="robots" content="noindex, nofollow/);
});

/* ---------------- public website ---------------- */

const LEGACY_PAGES = {
  "index.html": "/", "about.html": "/about", "empowering-through-quranic-learning.html": "/empowering-through-quranic-learning",
  "enrollment-process.html": "/enrollment-process", "Explore.html": "/explore", "faq.html": "/faq",
  "noorani-qaida-online.html": "/noorani-qaida-online", "quran-reading-course-online.html": "/quran-reading-course-online",
  "quran-tajweed-course-online.html": "/quran-tajweed-course-online", "quran-memorization-hifz-online.html": "/quran-memorization-hifz-online",
  "tafseer-quran-course-online.html": "/tafseer-quran-course-online", "quranic-arabic-course-online.html": "/quranic-arabic-course-online",
  "online-quran-classes-uk.html": "/online-quran-classes-uk", "online-quran-classes-usa.html": "/online-quran-classes-usa",
  "online-quran-classes-canada.html": "/online-quran-classes-canada", "online-quran-classes-uae.html": "/online-quran-classes-uae",
  "online-quran-classes-saudi-arabia.html": "/online-quran-classes-saudi-arabia", "registration.html": "/registration",
  "socialPlatforms.html": "/social-platforms",
};

test("old .html URLs redirect permanently (301) to the clean URLs", async () => {
  for (const [file, clean] of Object.entries(LEGACY_PAGES)) {
    const r = await get(`/${file}`);
    assert.equal(r.status, 301, `/${file} should be 301`);
    assert.equal(new URL(r.headers.get("location"), BASE).pathname, clean, `/${file} -> ${clean}`);
    assert.equal((await get(clean)).status, 200, `${clean} should be 200`);
  }
  for (const demo of ["/blog.html", "/inner-page.html", "/portfolio-details.html"]) assert.equal((await get(demo)).status, 301);
  assert.equal((await get("/robots.txt")).status, 200);
  const sitemap = await (await get("/sitemap.xml")).text();
  assert.ok(!sitemap.includes(".html"), "sitemap must list clean URLs only");
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 18);
});

test("public pages keep their titles and structured data (canonical now on the clean URL)", async () => {
  // Optional baseline: set LEGACY_SITE_DIR to a folder with the pre-migration static .html pages
  // (e.g. the backup of the old site) to verify that SEO tags did not change.
  const outDir = path.resolve(process.env.LEGACY_SITE_DIR ?? "legacy-site");
  const pages = fs.existsSync(outDir) ? fs.readdirSync(outDir).filter((f) => LEGACY_PAGES[f]) : [];
  if (!pages.length) return; // no legacy baseline to compare with
  const pick = (html, re) => (html.match(re)?.[1] ?? "").trim().replace(/&amp;/g, "&");
  // Legacy canonical (".../about.html") -> clean URL (".../about"), without a trailing slash.
  const cleanUrl = (u) => u.replace(/\.html$/, "").replace(/\/index$/, "")
    .replace(/\/Explore$/, "/explore").replace(/\/socialPlatforms$/, "/social-platforms").replace(/\/$/, "");
  // Count real <script> tags: the RSC payload also contains the "application/ld+json" string.
  const ldTags = (h) => (h.match(/<script type="application\/ld\+json">/g) ?? []).length;
  for (const file of pages) {
    const legacy = fs.readFileSync(path.join(outDir, file), "utf8");
    const url = LEGACY_PAGES[file];
    const res = await get(url);
    assert.equal(res.status, 200, `${url} should be 200`);
    const html = await res.text();
    assert.equal(pick(html, /<title>([^<]*)<\/title>/), pick(legacy, /<title>([^<]*)<\/title>/), `${url} title`);
    assert.equal(pick(html, /<link rel="canonical" href="([^"]*)"/).replace(/\/$/, ""),
      cleanUrl(pick(legacy, /<link rel="canonical" href="([^"]*)"/)), `${url} canonical`);
    assert.equal(ldTags(html), ldTags(legacy), `${url} JSON-LD blocks`);
  }
});
