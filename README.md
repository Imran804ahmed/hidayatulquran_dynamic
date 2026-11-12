# Hidayatul Quran Academy

Public website and staff admin portal for [hidayatulquran.com](https://www.hidayatulquran.com),
built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and a **Node.js** server
backed by **MySQL**.

- Public pages are React Server Components, prerendered to static HTML at build time, with clean
  URLs (`/about`, `/faq`, …). Old `/<page>.html` URLs redirect permanently (301).
- The admin portal lives at **`/adminportal`** — see [docs/PORTAL.md](docs/PORTAL.md).
- The website forms post to `/api/forms/contact` and `/api/forms/registration` (Node route
  handlers that save into the portal database).

## Requirements

- Node.js **≥ 20.9**
- MySQL / MariaDB
- Internet access during `npm run build` (fonts are downloaded once by `next/font` and self-hosted)

## Getting started

```bash
npm ci                          # install exact versions from package-lock.json
cp .env.example .env.local      # set DB_* to a LOCAL database, MAIL_MODE=log
npm run db:migrate              # create/upgrade the portal tables (hq_*)
npm run portal -- create-admin "Your Name" you@example.com
npm run dev                     # http://localhost:3000 and /adminportal
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and Node.js server (`PORT`, default 3000) |
| `npm run lint` / `npm run typecheck` | ESLint (Next.js core-web-vitals + TypeScript rules) / TypeScript check |
| `npm test` | Integration tests against a running app and a **test** database |
| `npm run images:sizes` | Regenerate `src/generated/image-sizes.ts` after adding or replacing images |
| `npm run db:migrate` / `npm run db:backup` | Apply SQL migrations / gzip SQL backup into `./backups` |
| `npm run portal -- <cmd>` | Maintenance CLI: `migrate`, `status`, `create-admin`, `import-legacy`, `backup`, `restore` |
| `npm run package:hostinger` | Source zip for the Hostinger Node.js app upload (`deploy/`) |
| `npm run build:standalone` | Self-contained build in `.next/standalone` (`node server.js`) for a VPS |

## Project structure

```
.
├── src/
│   ├── app/                        # Routes only (App Router)
│   │   ├── (site)/                 # Public website: layout (header, footer, fonts, CSS) + one folder per page
│   │   ├── adminportal/            # Admin portal (own root layout, portal.css)
│   │   ├── api/forms/              # Public form endpoints (contact, registration)
│   │   ├── sitemap.ts, robots.ts   # Generated /sitemap.xml and /robots.txt
│   │   └── global-not-found.tsx    # Site-wide 404
│   ├── components/
│   │   ├── layout/                 # SiteHeader (menu, mobile drawer), SiteFooter, FloatingActions, SiteEffects
│   │   ├── home/                   # Home page: sections/ (one file per section), pricing table, course cards
│   │   ├── course/                 # CoursePage template (+ EnrollCta, CourseLinks) for the 6 course pages
│   │   ├── country/                # CountryPage template for the 5 country pages
│   │   ├── forms/                  # ContactForm, RegistrationForm, SubmitOverlays
│   │   ├── explore/, seo/          # Course explorer; JSON-LD component
│   │   ├── ui/                     # Carousel (Swiper), FaqAccordion, SiteImage (next/image)
│   │   └── portal/                 # Admin portal UI
│   ├── content/                    # Page content as data: courses, countries, explore list, home schema.org
│   ├── config/                     # site.ts (name, contacts, links), navigation.ts, routes.ts (sitemap), redirects.ts
│   ├── lib/                        # seo.ts (metadata helpers); portal/ (database, auth, mail, domain logic)
│   ├── server/actions/             # Server Actions used by the portal
│   ├── styles/                     # site.css (global theme), fonts.ts (next/font)
│   ├── hooks/, types/, generated/  # React hooks; vendor typings; generated image sizes
│   └── proxy.ts                    # Canonical host/HTTPS redirect + cross-site POST block
├── public/assets/img/              # Images (served optimized through next/image)
├── db/migrations/                  # SQL migrations (applied in order, tracked in hq_migrations)
├── scripts/                        # Portal CLI, image sizes, packaging and standalone build
├── tests/                          # Integration tests
├── docs/                           # Portal guide, standalone deployment guide
├── next.config.ts                  # Images, redirects, rewrites, security headers
└── eslint.config.mjs, tsconfig.json, .env.example
```

Import alias: `@/*` → `src/*` (for example `@/lib/seo`, `@/components/ui/SiteImage`).

## How the public site is built

- **Layout** (`src/app/(site)/layout.tsx`): fonts (`next/font`, self-hosted), vendor CSS from npm
  (Bootstrap 5.0.1, Bootstrap Icons, Remix Icon, AOS, Swiper) and `src/styles/site.css`, plus the
  shared header, footer and floating WhatsApp/back-to-top buttons on every page.
- **Navigation** uses `next/link`; pages change without full reloads. The mobile menu, dropdowns,
  sticky header and home-page scroll highlighting are React state in `SiteHeader`.
- **Pages** export `metadata` through `pageMetadata()` in `src/lib/seo.ts` (title, description,
  canonical, hreflang, Open Graph, Twitter) and render JSON-LD with `<JsonLd>`.
- **Templates**: the course and country pages are one component each, filled from
  `src/content/courses.tsx` and `src/content/countries.tsx`.
- **Page styles** live in a CSS Module next to the page (`page.module.css`), scoped with
  `:where(.page) :global(...)` so they never leak into other pages after client-side navigation.
- **Images** use `<SiteImage>` (next/image): resized WebP, lazy loading and reserved space.

### Adding a public page

1. Create `src/app/(site)/<slug>/page.tsx`; export `metadata = pageMetadata({ path: "/<slug>", … })`.
2. Add it to `PUBLIC_PAGES` in `src/config/routes.ts` (sitemap) and, if needed, to `src/config/navigation.ts`.
3. New images: put them in `public/assets/img/`, run `npm run images:sizes`, use `<SiteImage src="/assets/img/…" />`.

## Configuration

All settings are environment variables — see [.env.example](.env.example). Required in
production: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `SMTP_*`, `MAIL_FROM`,
`PUBLIC_SITE_URL`. Recommended: `CANONICAL_HOST`, `TRUST_PROXY=1`. Never commit `.env*` files.

## Deployment

Requires a Node.js host (Hostinger Node.js web app, or a VPS with pm2 + nginx).

- **Hostinger (hPanel → Node.js web app → Upload your app files):** run `npm run package:hostinger`
  and upload `deploy/hidayatulquran-hostinger-<date>.zip`. It contains source only (package.json
  at the root, no `node_modules`/`.next`); Hostinger detects Next.js, installs and builds it.
  Set the environment variables in the panel (do not set `NODE_ENV`). After deploying, run
  `npm run db:migrate` once from the SSH terminal.
- **VPS from source:** `npm ci && npm run build && npm start` — full steps in
  [docs/PORTAL.md §7](docs/PORTAL.md#7-deployment).
- **VPS prebuilt:** `npm run build:standalone`, upload `.next/standalone/` and run `node server.js` —
  see [docs/DEPLOYMENT-STANDALONE.md](docs/DEPLOYMENT-STANDALONE.md).

## Tests

```bash
npm run build && npm start                       # in one terminal
PORTAL_TEST_URL=http://localhost:3000 npm test   # in another
```

Uses the `DB_*` settings from `.env.local` and refuses production-looking database names.
Set `LEGACY_SITE_DIR` to a folder containing the pre-migration `.html` pages to also check that
every public page keeps its title and JSON-LD and that its canonical points at the clean URL.

## History

The site was originally a static Bootstrap template ("FlexStart" by BootstrapMade) with PHP form
handlers. In November 2026 it was converted to this Next.js/Node.js application: legacy HTML/PHP
removed, clean URLs with 301 redirects, React components and templates instead of copied markup.
A full copy of the pre-migration project is kept outside the repository in
`../hidayatulquran-backup-20261112/`.

> **Security:** the legacy PHP files contained hard-coded database and SMTP passwords. Rotate both
> passwords before (or when) deploying this version.
