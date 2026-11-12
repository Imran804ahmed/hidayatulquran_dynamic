# Hidayatul Quran — Admin portal

The administration portal lives inside the existing Next.js application at **`/adminportal`**.
It manages registration requests, contact enquiries, students, teachers, courses, enrolments,
weekly classes, reports, portal users and the audit history, using the website's existing MySQL
database.

- [1. Audit findings](#1-audit-findings)
- [2. What changed in the website](#2-what-changed-in-the-website)
- [3. Modules and routes](#3-modules-and-routes)
- [4. Roles and permissions](#4-roles-and-permissions)
- [5. Data model](#5-data-model)
- [6. Local setup](#6-local-setup)
- [7. Deployment](#7-deployment)
- [8. First Super Admin](#8-first-super-admin)
- [9. Importing existing website submissions](#9-importing-existing-website-submissions)
- [10. Backups, restore and rollback](#10-backups-restore-and-rollback)
- [11. Post-deployment checklist](#11-post-deployment-checklist)
- [12. Tests](#12-tests)
- [13. Security notes](#13-security-notes)
- [14. Limitations and future work](#14-limitations-and-future-work)

---

## 1. Audit findings

Verified from the repository and the live site (fetched 12 Nov 2026):

| Area | Finding |
| --- | --- |
| Framework | Next.js 16.4.6 (App Router, Turbopack), React 19.3, TypeScript, npm with `package-lock.json`. Until now built with `output: "export"` (static HTML). |
| Hosting | Apache on Hostinger (`.htaccess`: HTTPS + `www` redirect, `/index.html → /`). PHP is used only for the two form endpoints. The live site serves the same pages and form fields as the repo. `/adminportal` returned 404. |
| Database | MySQL `u970626337_hidayatulquran`, tables `registration` and `contactus` (written by `forms/*.php`). No students, teachers or courses tables existed. |
| Forms | **Registration** (`registration.html` → `forms/registration.php`): fullName, age, country (uk/usa/canada/uae/ksa/ger/other), guardianName (optional), whatsappnumber, email, course (*package*: Bronze/Silver/Gold), classes (3/4/5 days), selecteddays[], selectedtime, message (optional), terms checkbox. Duplicate emails were rejected. **Contact** (home page → `forms/contact.php`): fullName, email, subject, message. Both send a confirmation email to the submitter via SMTP and answer JSON `{success, message}`. |
| Courses | Six courses in `src/data/courses.ts` (Noorani Qaida, Quran Reading, Quran with Tajweed, Quran Memorization, Tafseer e Quran, Quranic Arabic). The registration form does **not** ask for a course, only a package. |
| Pricing | Country-based package prices on the home page; no payments online. |
| Branding | `--hq-*` tokens in the site stylesheet (now `src/styles/site.css`): navy `#082c4c`, blue `#0d4f8b`, green `#136f43`, gold `#d7a53f` / `#a66f14`, ink `#263238`, muted `#5f6f7a`, surface `#f7faf8`, border `#e3eadf`; Nunito headings, Open Sans body; Bootstrap Icons; 6 px buttons, 8 px cards; logo `assets/img/hidayatulquran1.png` (square). |
| Languages | English only. No Urdu/Arabic/RTL markup was found, so the portal is English/LTR. |
| Existing features | No existing student, teacher, scheduling, attendance, fee or CMS features; no teacher application form. |

**Could not be verified:** the production database schema (the import tool inspects columns at
runtime), whether the Hostinger plan includes Node.js hosting, and the server timezone of legacy
timestamps (assumed UTC; see §9).

**Security issue found:** the database password and SMTP password are hard-coded in
`forms/contact.php`, `forms/registration.php`, `forms/mailer.php` and the `(live)`/`(localhost)` copies,
and are in git history. **Rotate both passwords** when you deploy. The portal reads all secrets from
environment variables only.

### Feature inventory → portal module

| Website feature | Portal module |
| --- | --- |
| Registration form | Registrations inbox → convert to Student (+ Enrolment) |
| Contact form | Enquiries inbox |
| Confirmation emails | Kept; delivery result recorded per submission; Settings toggle |
| Duplicate-email rule | Kept; Settings toggle |
| Six courses | Courses (seeded) |
| Packages / plans / preferred days & time | Carried into Students and Enrolments |
| 30-minute one-to-one classes | Enrolments → weekly class slots → Timetable |
| Tutors (marketing copy only) | Teachers |

## 2. What changed in the website

The portal needs a server (sessions, database, Server Actions), so the app now runs with
`next start` instead of a static export. Everything public was kept:

- Public pages live in the `src/app/(site)/` route group and are **still prerendered to static HTML**
  at build time.
- Public pages now use clean URLs (`/about`, `/faq`, …); every old `/<page>.html` URL answers with a
  301 redirect to its clean URL (`/index.html` → `/`, `/Explore.html` → `/explore`,
  `/socialPlatforms.html` → `/social-platforms`). Titles, descriptions, Open Graph
  and JSON-LD are unchanged (checked automatically against the old static build, §12).
- The website forms post to `/api/forms/contact` and `/api/forms/registration`. The old
  `/forms/contact.php` and `/forms/registration.php` URLs still work (rewritten to the same handlers), served by Node route handlers (`src/app/api/forms/*`, logic in `src/lib/portal/public-forms.ts`).
  The copies of the PHP files under `public/forms/` were removed: a Node server would
  otherwise serve their source code (including the passwords) as downloadable files.
- The two React forms now send a `submission_id` so a network retry cannot create duplicates.
- `src/proxy.ts` replaces the `.htaccess` HTTPS/`www` redirect (`CANONICAL_HOST`) and blocks
  cross-site POSTs.
- A global 404 page in the website style replaces Apache's default 404.
- The static-export leftovers (`out/`, `scripts/postbuild.mjs`, `serve.json`) and the legacy HTML/PHP files were removed from the repository (Nov 2026 restructure; a full copy is kept outside the repo, see README).

Form behaviour differences, all deliberate:
- Submissions are saved to the portal tables (`hq_registrations`, `hq_enquiries`) instead of
  `registration` / `contactus`. The legacy tables are never written or altered; the duplicate-email
  check still reads `registration`, so the old rule keeps working before and after import.
- Success is returned only after the database commit; emails are sent afterwards and their result
  is stored. An email failure no longer hides a saved submission.
- Contact names are stored as typed (the PHP version upper-cased them).
- Light rate limiting (5 submissions per email per 10 minutes; plus 15 per IP behind a proxy).

## 3. Modules and routes

| Route | Purpose |
| --- | --- |
| `/adminportal` | Sign-in for visitors; redirects signed-in staff to the dashboard |
| `/adminportal/login`, `/forgot-password`, `/reset-password` | Sign-in, password reset by email |
| `/adminportal/dashboard` | Metrics (each with its definition, linking to the matching list), trends with date range, recent registrations/enquiries, follow-ups, next 24 h of classes, recent activity, quick actions |
| `/adminportal/registrations[/id][/convert]` | Inbox with tabs, search, filters, sorting, pagination, CSV; review (status, assignee, follow-up, rejection reason, reopen), notes, history, duplicate flags, conversion |
| `/adminportal/enquiries[/id]` | Inbox with unread state, assignment, follow-ups, notes, history, CSV |
| `/adminportal/students[/new][/id][/id/edit]` | Directory, profile, enrolments, status changes with impact preview, notes, history, CSV |
| `/adminportal/teachers[/new][/id][/id/edit][/id/status]` | Directory, profile, assignments, weekly classes; deactivate/archive with per-enrolment reassignment |
| `/adminportal/courses[/new][/id][/id/edit]` | The six website courses; active/inactive |
| `/adminportal/enrolments[/new][/id]` | Student ↔ course ↔ teacher, enrolment status, weekly class slots with teacher-clash checks |
| `/adminportal/timetable` | Week view in the academy timezone, filters by teacher/course |
| `/adminportal/reports` | Status, registrations by status/package/country, enquiries, follow-ups, course enrolments, teacher load |
| `/adminportal/audit` | Full audit history with filters |
| `/adminportal/users[/new][/id]` | Portal accounts, roles, permissions (Super Admin only) |
| `/adminportal/settings` | Academy details, timezone, notifications, website form rules |
| `/adminportal/profile` | Own name and password |

Key rules:
- **Statuses are separate:** student/teacher *record* status (Active / Inactive / Archived),
  *enrolment* status per course (Pending / Active / Paused / Completed / Withdrawn). Attendance is
  not tracked, and the UI says so.
- **Registration flow:** New → Under review → Contacted → Approved → Enrolled. Rejected needs an
  internal reason; reopening needs a reason. *Approval does nothing else*: conversion is a
  separate, explicit action (Approved only), done in one transaction with the registration row
  locked, so it can produce only one student. It creates a new student or links an existing one
  (likely duplicates by email / WhatsApp / name are listed), copies the submitted details, keeps
  the original submission, and optionally creates the course enrolment (→ Enrolled). No email or
  login is created.
- **Deactivating a student** keeps all records; their classes disappear from the timetable and no
  new enrolments can be added until reactivated (shown before confirming).
- **Deactivating/archiving a teacher** with current enrolments requires choosing a new active
  teacher (clash-checked) or "leave unassigned" for each, applied in one transaction. Inactive
  teachers cannot be assigned anywhere.
- **Class times** are stored as weekday + time + IANA timezone, so a 17:00 London class stays at
  17:00 London across daylight-saving changes; clash checks compare real instants over the next
  8 weeks and ~6 months ahead.
- Every list keeps its filters in the URL; "back" links return to the same filtered list and
  scroll position.
- Forms keep entered values on validation errors, block double submission, warn about unsaved
  changes, and confirm destructive actions. Concurrent edits are detected (optimistic locking).
- **Content management:** public course pages, FAQs and testimonials are part of the site's code
  and prerendered for SEO; they are intentionally *not* editable from the portal (that would need
  runtime rendering or a rebuild pipeline). Settings and course edits say clearly that they do not
  change the public website.

## 4. Roles and permissions

- **Super Admin**: everything, including `users.manage` (never assignable to others).
- **Admin / Coordinator**: only the permissions ticked on their account.

| Module | Permissions |
| --- | --- |
| Dashboard | `dashboard.view` |
| Students | `students.view`, `.create`, `.edit` (incl. activate/deactivate), `.archive`, `.export` |
| Teachers | `teachers.view`, `.create`, `.edit` (incl. reassign), `.archive`, `.export` |
| Registrations | `registrations.view`, `.edit`, `.convert` (sensitive), `.export` |
| Enquiries | `enquiries.view`, `.edit`, `.export` |
| Courses & classes | `courses.view`, `courses.edit`, `enrolments.manage` (incl. meeting links), `enrolments.export` |
| Reports & history | `reports.view`, `audit.view` |
| Settings | `settings.manage` |

Checks run on the server for every page, Server Action and export (`src/lib/portal/auth.ts`:
`requirePage`, `requireAction`). The last active Super Admin cannot be demoted or disabled.

## 5. Data model

Migration `db/migrations/001_portal_schema.sql` (InnoDB, utf8mb4, UTC timestamps, foreign keys
and indexes on searched columns). All tables are prefixed `hq_`:

`hq_users`, `hq_user_permissions`, `hq_sessions` (hashed tokens), `hq_rate_events`,
`hq_password_resets` (hashed, single use, 60 min), `hq_settings`, `hq_courses` (6 seeded),
`hq_teachers`, `hq_students`, `hq_enrolments`, `hq_class_slots`, `hq_registrations`,
`hq_enquiries`, `hq_notes` (private), `hq_status_history`, `hq_audit_log`, `hq_migrations`.

Reference numbers: students `HQS-00001`, teachers `HQT-…`, registrations `REG-…`, enquiries `ENQ-…`.

## 6. Local setup

Requires Node.js ≥ 20.9 and MySQL/MariaDB.

```bash
npm ci
cp .env.example .env.local          # set DB_* to a LOCAL database, MAIL_MODE=log
npm run portal -- migrate
npm run portal -- create-admin "Your Name" you@example.com
npm run dev                          # http://localhost:3000/adminportal
```

## 7. Deployment

> **Dependency:** the site now needs a **Node.js runtime** (≥ 20.9). Hostinger provides this on
> plans with "Node.js" web apps (Business / Cloud) or on a VPS. Plain shared PHP hosting cannot
> run the portal. Choose the host before switching DNS/traffic.

### Environment variables
See `.env.example`. Required: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `SMTP_*`,
`MAIL_FROM`, `PUBLIC_SITE_URL`. Recommended: `CANONICAL_HOST`, `TRUST_PROXY=1` behind a proxy.
Use the **rotated** database and SMTP passwords.

### Build and start
```bash
npm ci
npm run build
npm run portal -- backup ./backups   # back up first (see §10)
npm run portal -- migrate            # creates hq_* tables; legacy tables untouched
npm start                            # PORT env var, default 3000
```

**Hostinger Node.js app:** application root = repository root, Node 20 or 22, build command
`npm ci && npm run build`, start command `npm start`, set the environment variables in the panel,
attach the domain with SSL. Run `migrate` / `create-admin` from the SSH terminal in the application root.

**VPS:** run `npm start` under a process manager (for example `pm2 start npm --name hq -- start`
and `pm2 save`), put nginx in front with HTTPS (Let's Encrypt) proxying to `127.0.0.1:3000` with
`proxy_set_header Host $host; X-Forwarded-For; X-Forwarded-Proto`, set `TRUST_PROXY=1`.

### HTTPS and sessions
Session cookie `hq_portal_session`: HttpOnly, Secure (production), SameSite=Lax, path
`/adminportal`, random 256-bit token stored hashed. Idle timeout 30 minutes, absolute 12 hours,
password change/reset and account disable end sessions. Sign-in: 5 failed attempts per account
per 15 minutes (plus 20 per IP behind a proxy).

### Email
SMTP via nodemailer. "Sent" in the portal means *accepted by the mail server*, not delivered to
the inbox. Without SMTP settings submissions are still saved; the portal shows a warning and the
email status "Failed". Password-reset emails need SMTP; otherwise a Super Admin sets passwords in
Users & roles.

## 8. First Super Admin

There is no public sign-up. Create the first account from a terminal on the server:

```bash
npm run portal -- create-admin "Full Name" owner@example.com   # password prompted, hidden
```

Further users are created by a Super Admin in **Users & roles** with a temporary password that
the user changes in **My profile**.

## 9. Importing existing website submissions

```bash
npm run portal -- import-legacy --dry-run   # report only
npm run portal -- import-legacy             # copy rows into the portal
```

- Reads `registration` and `contactus`; never modifies them.
- Field mapping: fullName→full_name, age, country, guardianName, whatsappnumber (+ digits),
  email, course→package, classes→classes plan, selecteddays→preferred days, selectedtime,
  message; contact subject/message.
- Safe to re-run: each row gets a `legacy_key` (`id:<n>`, or a content hash when the table has
  no id), unique-indexed, so imported rows are skipped.
- Uses `created_at`/`date`/`timestamp`-style columns when present (treated as UTC; **check one
  imported row against the old table**). Rows without a time are marked "time unknown" and left
  out of trend charts.
- Rows without a name are imported as "Unknown" and listed; repeated emails are counted and shown
  as possible duplicates in the inbox.

## 10. Backups, restore and rollback

**Before any production migration or import:**
1. hPanel → Databases → phpMyAdmin → Export (full database), or hPanel automatic backups; and
2. `npm run portal -- backup ./backups` (gzip SQL of all `hq_*` tables plus `registration` and
   `contactus`; file mode 600; keep copies off the server).

**Restore:** `npm run portal -- restore backups/<file>.sql.gz --yes` (replaces the `hq_*` and the two
legacy tables with the backup), or import the phpMyAdmin dump.

**Rollback of the website:** the previous static site (HTML pages + PHP form handlers) is kept in the
pre-migration backup folder `hidayatulquran-backup-20261112` and the legacy tables are untouched. To roll back, redeploy the previous static
files with the PHP form handlers; they keep writing to `registration` / `contactus`. Portal tables
can stay (they are ignored) or be dropped after a backup. Submissions received by the portal
while it was live can be exported as CSV from Registrations / Enquiries.

Suggested routine: weekly `backup` via cron (`0 3 * * 0 cd /path/hidayatulquran && npm run portal -- backup /path/backups`)
plus Hostinger's own backups; test a restore into a scratch database once a quarter.

## 11. Post-deployment checklist

1. `https://www.hidayatulquran.com/adminportal` shows the sign-in page; `…/dashboard` redirects to it.
2. Sign in with the Super Admin; refresh a deep page (e.g. a student) — still signed in.
3. Submit the website **contact** form and a **registration** with a test email → both appear in the
   inbox, confirmation email "Accepted by mail server"; delete or archive the test rows.
4. Open `/about`, `/faq`, `/registration`, `/`; view source shows the expected title and the clean canonical URL. `curl -I https://www.hidayatulquran.com/about.html` answers `301` with `Location: /about`.
5. `curl -I https://www.hidayatulquran.com/adminportal/login` shows `X-Robots-Tag: noindex`.
6. `/forms/contact.php` with GET returns 405 (and never PHP source).
7. Sign out; the browser Back button does not show portal data.
8. Remove the old PHP files from the web root if the Apache site is retired.

## 12. Tests

Automated suite: `PORTAL_TEST_URL=http://localhost:3000 npm run test:portal` (uses the `.env.local`
database; refuses names that look like production; cleans up its rows).

Results on 12 Nov 2026 — **15/15 passed**, against both `next dev` and the production build
(`next build && next start`):
public registration and contact contract, idempotent retries, duplicate-email rule, validation,
rate limiting, cross-site POST block, GET 405; sign-in redirect with `next`, idle and absolute
expiry, logout and disabled-account revocation, safe post-login redirects; server-side
permission checks on pages and CSV exports; CSV formula-injection protection; `noindex`; all 22
public pages keep URL, title, canonical and JSON-LD count versus the previous static build.

Browser-driven checks (headless Edge, desktop 1366 px and phone 390 px, no horizontal overflow):
sign-in validation and errors; login lockout after 5 failures; dashboard; student create with
validation (input kept), duplicate warning and "save anyway"; deactivate with confirmation; private
notes; teacher create; registration review (rejection needs reason), approve, convert with
enrolment → exactly one student; second conversion refused; forced double submit of conversion →
one student; weekly class scheduling with teacher clash detection, including across timezones
(22:00 Karachi = 17:00 London); teacher deactivation blocked until each enrolment is reassigned,
then applied; inactive teacher not offered; enquiry open → read, handle, mark unread; coordinator
account: hidden navigation, no-access pages, 403 exports, no archive button; settings validation and
audit entries; unsaved-changes guard; public registration duplicate error keeps entered data;
public home page renders as before. Legacy import: dry run, import, re-run (0 new), missing name,
repeated email. Backup command. `tsc --noEmit` and `next build` clean.

Not tested: real SMTP delivery (tested with `MAIL_MODE=log`), password-reset email delivery
end to end (token flow verified, email body not delivered), the actual Hostinger deployment,
the production database schema, screen-reader walkthrough, Safari/Firefox.

## 13. Security notes

- SQL: parameterised queries only; identifiers never come from input.
- XSS: React escaping everywhere; no `dangerouslySetInnerHTML` in the portal; emails escape values.
- CSRF: Server Actions (POST, Origin vs Host) + `src/proxy.ts` rejects cross-site POSTs + SameSite cookie.
- Object-level checks: every record page/action re-reads the record and checks the permission.
- Secrets only in environment variables. Audit log never stores passwords, tokens, note or message text.
- Portal pages send `X-Robots-Tag: noindex`, `X-Frame-Options: DENY`, `Referrer-Policy: same-origin`.
- No file uploads, so no upload storage is needed.
- Records are archived, not deleted; there is no permanent-delete action in the UI.

## 14. Limitations and future work

Not built, because no confirmed requirements exist: attendance, progress reports, fees/payments,
payroll, teacher applications (no website form exists), student/teacher logins, outgoing email
replies from the portal (replies use the staff member's own email/WhatsApp; notes record the outcome),
editing public page content, Urdu/Arabic/RTL interface.

Good next steps: send replies from the portal with tracked delivery states; a class-session log
(attendance) if wanted; a course selector on the public registration form; two-factor sign-in for
Super Admins.
