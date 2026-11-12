#!/usr/bin/env node
// Admin portal maintenance commands. Run from the project root:
//   npm run portal -- migrate                      apply pending db/migrations/*.sql
//   npm run portal -- status                       show applied / pending migrations and counts
//   npm run portal -- create-admin "Name" email    create a Super Admin (password prompted, hidden)
//   npm run portal -- import-legacy [--dry-run]    copy website rows from `registration` / `contactus`
//   npm run portal -- backup [dir]                 gzip SQL dump of hq_* tables + legacy form tables
//   npm run portal -- restore <file.sql.gz> --yes  restore a backup made by this script
// Configuration: environment variables, or .env.local / .env in this folder (see .env.example).

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import readline from "node:readline";
import { promisify } from "node:util";
import mysql from "mysql2/promise";

for (const f of [".env.local", ".env"]) {
  if (fs.existsSync(f)) {
    process.loadEnvFile(f);
    break;
  }
}

const root = process.cwd();
const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");
const die = (msg) => {
  console.error(`Error: ${msg}`);
  process.exit(1);
};

async function connect(multi = false) {
  for (const k of ["DB_NAME", "DB_USER"]) if (!process.env[k]) die(`${k} is not set.`);
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME,
    timezone: "Z",
    dateStrings: true,
    multipleStatements: multi,
    charset: "utf8mb4",
  });
  await conn.query("SET time_zone = '+00:00'");
  return conn;
}

const scrypt = promisify(crypto.scrypt);
async function hashPassword(password) {
  // Must match src/lib/portal/auth.ts
  const N = 32768, r = 8, p = 1;
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => {
      if (s.startsWith(question)) rl.output.write(question);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function migrations(conn) {
  await conn.query("CREATE TABLE IF NOT EXISTS hq_migrations (version VARCHAR(120) NOT NULL PRIMARY KEY, applied_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
  const [rows] = await conn.query("SELECT version FROM hq_migrations");
  const applied = new Set(rows.map((r) => r.version));
  const dir = path.join(root, "db", "migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  return { applied, pending: files.filter((f) => !applied.has(f)), dir };
}

async function migrate() {
  const conn = await connect(true);
  const { pending, dir } = await migrations(conn);
  if (!pending.length) {
    console.log("Database already up to date.");
  }
  for (const file of pending) {
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    console.log(`Applying ${file} ...`);
    await conn.query(sql); // DDL auto-commits in MySQL; migrations use IF NOT EXISTS where possible
    await conn.query("INSERT INTO hq_migrations (version, applied_at) VALUES (?, ?)", [file, now()]);
  }
  await conn.end();
  if (pending.length) console.log(`Applied ${pending.length} migration(s).`);
}

async function status() {
  const conn = await connect();
  const { applied, pending } = await migrations(conn);
  console.log(`Applied: ${[...applied].join(", ") || "none"}`);
  console.log(`Pending: ${pending.join(", ") || "none"}`);
  if (applied.size) {
    for (const t of ["hq_users", "hq_students", "hq_teachers", "hq_registrations", "hq_enquiries"]) {
      const [[r]] = await conn.query(`SELECT COUNT(*) AS c FROM ${t}`);
      console.log(`  ${t}: ${r.c}`);
    }
  }
  await conn.end();
}

async function createAdmin(name, emailRaw) {
  const email = (emailRaw ?? "").trim().toLowerCase();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) die('Usage: npm run portal -- create-admin "Full Name" email@example.com');
  const password = process.env.PORTAL_NEW_ADMIN_PASSWORD || (await askHidden("Password (min 10 characters): "));
  if (password.length < 10) die("Use at least 10 characters.");
  if (!process.env.PORTAL_NEW_ADMIN_PASSWORD) {
    const again = await askHidden("Repeat password: ");
    if (again !== password) die("The passwords do not match.");
  }
  const conn = await connect();
  const [[exists]] = await conn.query("SELECT COUNT(*) AS c FROM hq_users WHERE email = ?", [email]);
  if (exists.c) die("A user with that email already exists.");
  const [res] = await conn.query(
    "INSERT INTO hq_users (name, email, password_hash, role, status, password_changed_at, created_at, updated_at) VALUES (?, ?, ?, 'super_admin', 'active', ?, ?, ?)",
    [name.slice(0, 120), email, await hashPassword(password), now(), now(), now()],
  );
  await conn.query("INSERT INTO hq_audit_log (user_id, action, entity_type, entity_id, summary, ip, created_at) VALUES (NULL, 'user.created', 'user', ?, ?, 'cli', ?)", [
    res.insertId, `Super Admin ${email} created from the command line`, now(),
  ]);
  await conn.end();
  console.log(`Super Admin created (id ${res.insertId}). Sign in at /adminportal/login`);
}

const TIME_COLUMNS = ["created_at", "createdAt", "created", "submitted_at", "date", "datetime", "timestamp", "reg_date", "created_on"];
const digits = (v) => String(v ?? "").replace(/\D+/g, "");
const clip = (v, n) => {
  const s = String(v ?? "").trim();
  return s ? s.slice(0, n) : null;
};

async function importLegacy(dryRun) {
  const conn = await connect();
  const map = { registrations: ["registration", "hq_registrations", "REG-"], enquiries: ["contactus", "hq_enquiries", "ENQ-"] };
  for (const [which, [legacy, target, prefix]] of Object.entries(map)) {
    const [cols] = await conn.query("SELECT column_name AS c FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? ORDER BY ordinal_position", [legacy]);
    if (!cols.length) {
      console.log(`Legacy table ${legacy}: not found, nothing to import.`);
      continue;
    }
    const names = cols.map((c) => c.c);
    const idCol = names.includes("id") ? "id" : null;
    const timeCol = TIME_COLUMNS.find((c) => names.includes(c)) ?? null;
    const [rows] = await conn.query(`SELECT * FROM \`${legacy}\`${idCol ? " ORDER BY `id`" : ""}`);
    let imported = 0, skipped = 0, dupes = 0;
    const problems = [];
    for (const row of rows) {
      const key = idCol ? `id:${row[idCol]}` : `sha1:${crypto.createHash("sha1").update(JSON.stringify(row)).digest("hex")}`;
      const [[seen]] = await conn.query(`SELECT COUNT(*) AS c FROM ${target} WHERE legacy_key = ?`, [key]);
      if (seen.c) {
        skipped++;
        continue;
      }
      let submitted = null;
      if (timeCol && row[timeCol] && !Number.isNaN(Date.parse(String(row[timeCol]).replace(" ", "T") + "Z"))) {
        // Legacy timestamps are taken as UTC (the database server time); verify against your host.
        submitted = new Date(String(row[timeCol]).replace(" ", "T") + "Z").toISOString().slice(0, 19).replace("T", " ");
      }
      let name = clip(row.fullName, 150);
      if (!name) {
        problems.push(`${key}: missing name, imported as "Unknown"`);
        name = "Unknown";
      }
      imported++;
      if (dryRun) continue;
      await conn.beginTransaction();
      try {
        let res;
        if (which === "registrations") {
          const email = clip(row.email, 190)?.toLowerCase() ?? null;
          const age = Number(row.age);
          const days = String(row.selecteddays ?? "").split(",").map((d) => d.trim().toLowerCase().slice(0, 3)).filter((d) => ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(d));
          [res] = await conn.query(
            `INSERT INTO hq_registrations (legacy_key, source_form, full_name, age, country, guardian_name, whatsapp, whatsapp_digits, email, package, classes_plan,
              preferred_days, preferred_time, message, status, confirmation_email, submitted_at, submitted_at_known, updated_at)
             VALUES (?, 'registration.html (imported)', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'skipped', ?, ?, ?)`,
            [key, name, age > 0 && age < 120 ? age : null, clip(row.country, 80), clip(row.guardianName, 150), clip(row.whatsappnumber, 40),
              digits(row.whatsappnumber) || null, email, clip(row.course, 40), clip(row.classes, 20), days.join(",") || null,
              clip(row.selectedtime, 60), clip(row.message, 5000), submitted ?? now(), submitted ? 1 : 0, now()],
          );
          if (email) {
            const [[d]] = await conn.query("SELECT COUNT(*) AS c FROM hq_registrations WHERE email = ? AND id <> ?", [email, res.insertId]);
            if (d.c) dupes++;
          }
        } else {
          [res] = await conn.query(
            `INSERT INTO hq_enquiries (legacy_key, source_form, full_name, email, subject, message, status, confirmation_email, submitted_at, submitted_at_known, updated_at)
             VALUES (?, 'Contact form (imported)', ?, ?, ?, ?, 'new', 'skipped', ?, ?, ?)`,
            [key, name, clip(row.email, 190)?.toLowerCase() ?? null, clip(row.subject, 255), clip(row.message, 5000), submitted ?? now(), submitted ? 1 : 0, now()],
          );
        }
        await conn.query(`UPDATE ${target} SET ref_no = ? WHERE id = ?`, [prefix + String(res.insertId).padStart(5, "0"), res.insertId]);
        await conn.commit();
      } catch (err) {
        await conn.rollback();
        throw err;
      }
    }
    if (!dryRun && imported) {
      await conn.query("INSERT INTO hq_audit_log (user_id, action, summary, ip, created_at) VALUES (NULL, 'import.legacy', ?, 'cli', ?)", [`Imported ${imported} rows from legacy table ${legacy}`, now()]);
    }
    console.log(`${dryRun ? "[dry run] " : ""}${legacy}: ${rows.length} rows; ${dryRun ? "would import" : "imported"} ${imported}; already imported ${skipped}; repeated emails ${dupes}; time column: ${timeCol ?? "none (import time used, marked unknown)"}`);
    problems.slice(0, 20).forEach((p) => console.log(`  - ${p}`));
  }
  await conn.end();
}

async function backup(dir) {
  const conn = await connect();
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `hq-backup-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.sql.gz`);
  const gz = zlib.createGzip();
  const out = fs.createWriteStream(file, { mode: 0o600 });
  gz.pipe(out);
  const [tables] = await conn.query(
    "SELECT table_name AS t FROM information_schema.tables WHERE table_schema = DATABASE() AND (table_name LIKE 'hq\\_%' OR table_name IN ('registration','contactus')) ORDER BY table_name",
  );
  gz.write(`-- Hidayatul Quran backup ${new Date().toISOString()}\nSET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS=0;\nSET time_zone='+00:00';\n\n`);
  for (const { t } of tables) {
    const [[create]] = await conn.query(`SHOW CREATE TABLE \`${t}\``);
    gz.write(`DROP TABLE IF EXISTS \`${t}\`;\n${create["Create Table"]};\n`);
    const [rows] = await conn.query(`SELECT * FROM \`${t}\``);
    for (const row of rows) {
      const cols = Object.keys(row).map((c) => `\`${c}\``).join(", ");
      const vals = Object.values(row).map((v) => (v === null ? "NULL" : conn.escape(String(v)))).join(", ");
      gz.write(`INSERT INTO \`${t}\` (${cols}) VALUES (${vals});\n`);
    }
    gz.write("\n");
  }
  gz.write("SET FOREIGN_KEY_CHECKS=1;\n");
  gz.end();
  await new Promise((r) => out.on("finish", r));
  await conn.end();
  console.log(`Backup written to ${file} (${tables.length} tables)`);
}

async function restore(file, yes) {
  if (!file || !fs.existsSync(file)) die("Usage: npm run portal -- restore <backup.sql.gz> --yes");
  if (!yes) die("Restoring REPLACES the hq_* tables and the legacy form tables with the backup contents. Re-run with --yes to confirm.");
  const sql = zlib.gunzipSync(fs.readFileSync(file)).toString("utf8");
  const conn = await connect(true);
  await conn.query(sql);
  await conn.end();
  console.log("Restore complete.");
}

const [cmd, ...args] = process.argv.slice(2);
try {
  switch (cmd) {
    case "migrate": await migrate(); break;
    case "status": await status(); break;
    case "create-admin": await createAdmin(args[0], args[1]); break;
    case "import-legacy": await importLegacy(args.includes("--dry-run")); break;
    case "backup": await backup(args[0] ?? path.join(root, "backups")); break;
    case "restore": await restore(args[0], args.includes("--yes")); break;
    default:
      console.log('Commands: migrate | status | create-admin "Name" email | import-legacy [--dry-run] | backup [dir] | restore <file> --yes');
  }
} catch (err) {
  die(err.message);
}
