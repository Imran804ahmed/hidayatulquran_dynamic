# Hidayatul Quran — prebuilt deployment package

Self-contained build of the website and the admin portal (`/adminportal`).
No `npm install` and no build step are needed on the server. Requires **Node.js 20.9 or newer**.

## Contents

| Path | Purpose |
| --- | --- |
| `server.js` | Starts the website + portal (`node server.js`) |
| `.next/`, `node_modules/` | Compiled application and its runtime libraries |
| `public/` | Images, CSS, fonts, `robots.txt`, `sitemap.xml` |
| `db/migrations/` | Database schema for the portal (`hq_*` tables) |
| `scripts/portal.mjs` | Maintenance: migrate, create-admin, import-legacy, backup, restore |
| `.env.example` | All configuration settings (no secrets) |

## 1. Configure

Set these environment variables in the hosting panel, or copy `.env.example` to `.env`
in this folder and fill it in. Use the **new** (rotated) database and SMTP passwords.

Required: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`,
`SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, `PUBLIC_SITE_URL`, `NODE_ENV=production`.
Recommended: `CANONICAL_HOST=www.hidayatulquran.com`, `TRUST_PROXY=1` (behind Hostinger/nginx),
`PORT` (default 3000), `HOSTNAME=0.0.0.0` if the host needs it.

## 2. Database (first deployment only)

```bash
node scripts/portal.mjs backup ./backups           # back up first
node scripts/portal.mjs migrate                    # creates the hq_* tables
node scripts/portal.mjs create-admin "Your Name" you@hidayatulquran.com
node scripts/portal.mjs import-legacy --dry-run    # preview old website submissions
node scripts/portal.mjs import-legacy              # copy them into the portal
```

## 3. Start

```bash
node server.js
```

- **Hostinger Node.js app:** upload and extract this folder, set the startup file to `server.js`,
  set the environment variables, attach the domain with SSL.
- **VPS:** `pm2 start server.js --name hidayatulquran && pm2 save`, with nginx + HTTPS in front
  proxying to `127.0.0.1:3000`.

## 4. Check

- `https://www.hidayatulquran.com/` and `/about` load; `/about.html` redirects (301) to `/about`.
- `/adminportal` shows the sign-in page; sign in with the admin created above.
- Send a test message with the website contact form; it appears under **Enquiries**.

Full guide (permissions, backups, restore, rollback): `docs/PORTAL.md` in the source repository.
