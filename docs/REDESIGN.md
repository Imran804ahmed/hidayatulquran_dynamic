# Website redesign (November 2026)

A brand-led redesign of the public website's main journey: **Home → Courses → Course detail →
Registration → Confirmation**. The visual direction comes from the academy's logo
(`public/assets/img/hidayatulquran-logo.png`, from `logo-08.png`).

## Audit findings → changes

| Where | Problem found | Change |
| --- | --- | --- |
| Registration form | No course question. "Register" on a course page lost the course. | The course is the first question. `?course=<slug>` preselects it, and the visitor can change it. The server checks it (see below). |
| Home hero, course pages | Two competing "start" paths: WhatsApp "Book Free Trial" and "Register". Course pages linked only to WhatsApp. | One primary path: **Explore courses** → **Register**, both in the first screen. WhatsApp is now a secondary "Prefer to talk first?" link. |
| Home course cards | "Benefits" links pointed to `#`. Courses couldn't be compared. | New `/courses` listing with comparable cards (level, who it suits, format) and a "where to start" guide. `/explore` redirects there (301). |
| Navigation | Two dropdowns plus anchor links, and a custom overlay drawer on mobile. | Flat menu with **Register** always available. On mobile, a "Menu" disclosure button: `aria-expanded`, Escape closes it and returns focus, and it closes on navigation. |
| Logo treatment | Old cartoon logo. The name was squashed into one word ("HidayatulQuran"). | The new seal logo at its original proportions on transparent corners, with "Hidayatul Quran Academy" as readable text beside it at every width (two lines on phones). |
| Form errors | One summary line ("Please check 2 fields"). | An error summary lists each problem as a link to its field and receives focus. Each field shows a specific message beside it, with `aria-invalid` and `aria-describedby`. |
| Submission | Full-screen loader and a popup over a reset form. No clear retry. | The button shows "Sending registration…" and is disabled. The existing `submission_id` makes retries idempotent. Errors keep every answer and offer **Try again**. Success goes to `/registration/confirmation`. |
| Confirmation | A popup that suggested the work was done. | A page showing the course, plan and time, and stating clearly that this is a *request*: the place is not confirmed until the team makes contact. It appears only after the backend accepts the submission. |

## Design system (`src/styles/design.css`)

**Theme (updated 21 Nov 2026):** the colours and fonts of the live website (www.hidayatulquran.com, `src/styles/site.css`), applied to the redesigned pages. The legacy template pages use the same variables unchanged.

| Role | Colour | Measured contrast |
| --- | --- | --- |
| Headings, dark sections, footer | navy `#082c4c` | 14.2:1 on white |
| Body text | `#263238` | 13.2:1 |
| Muted text | `#5f6f7a` | 5.2:1 on white, 4.9:1 on `#f7faf8` |
| Primary buttons | green `#136f43` | white on it 6.2:1 (hover `#0e5634` 8.8:1) |
| Links and focus ring | blue `#0d4f8b` | 8.4:1 |
| Gold accents | `#e1b152` / `#d7a53f` | 2.0–2.3:1 on white, so used only on navy (7.2:1) and as decoration (rules, borders, square dots) |
| Gold text on light backgrounds | `#8f5f10` | 5.5:1. The live `#a66f14` is 4.3:1, just under AA |
| Backgrounds | white, light `#f7faf8` | — |
| Input border | `#7b8891` | 3.6:1 |
| Error | `#b3261e` | 6.5:1 |

- **Fonts:** Nunito for headings, labels and buttons; Open Sans for body text. These are the fonts the live site already loads, so nothing extra is downloaded.
- **Geometric detail:** a square-Kufic motif (right-angle strokes and square dots) appears only where there's no text: the square-dot band at the top edge of dark sections and the footer, and the eyebrow square. The hero shows the logo on its own, with no panel behind it. Metallic gradients appear only in the logo.
- **Legacy pages:** they keep the live site's own colour variables, so the old and new pages match.
- **Arabic and Urdu:** the site source has no Arabic or Urdu text, only inside course images. If any is added, mark it with `lang="ar"` or `lang="ur"` and `dir="rtl"`.

## Registration flow

- The course identifier is the website course slug (`src/content/course-catalog.ts`), which matches `hq_courses.slug` in the admin portal.
- The form posts the existing fields plus `courseSlug`. `src/lib/portal/public-forms.ts` rejects a missing or unknown slug ("Please choose a course.").
- There is no course column, so the server stores the course as the first line of the existing `message` (`Course: Quran with Tajweed`). The admin portal, CSV export and notification emails show it with no schema or portal change. Spam controls (rate limit, duplicate-email rule) and `submission_id` idempotency are unchanged.
- No personal data goes into URLs. The confirmation page reads only the course, plan and time from `sessionStorage`.

## Responsive behaviour

| Width | Behaviour |
| --- | --- |
| 1440 | Full menu. The course page has a sticky summary card and the registration page a sticky "What happens next" panel. Cards in 3 columns. |
| 768 | "Menu" button. Cards in 2 columns, form fields in 2 columns. Side panels move below the content. |
| 390 | One column. The header shows the logo, "Hidayatul Quran / Academy", Register and an icon-only Menu button. Buttons span the full width. |
| 320 | As at 390, but Register moves into the menu (it is also the second button in every page's first screen). |

## Accessibility (target WCAG 2.2 AA)

- Keyboard order follows the visual order: course → student → contact → plan and schedule → notes and terms → submit.
- After failed validation, focus moves to the error summary (`role="alert"`); its links move focus to the field. Errors are shown in text with an icon, never by colour alone.
- After a server or network error, focus moves to the summary, which contains **Try again**. While sending, a `role="status"` region announces it.
- On the confirmation page, focus moves to the `h1`.

## Needs academy review

1. **Class length.** The fee cards say 30 minutes, but the FAQ says 30–45 minutes depending on the course. The new copy doesn't state a length.
2. **Video platform.** The FAQ says "Zoom or Microsoft Teams" in one place and "Zoom or other platforms" in another; the old teaching section said "Zoom / Google Meet". Not stated in the new copy.
3. **One-to-one vs group.** The old `/explore` text mentioned group recitation and discussions, but the course pages say every class is one-to-one. The new copy follows the course pages.
4. **Response time** after registering isn't published, so no timeline is shown.
5. **Prerequisites and course duration** aren't published per course. Only "who it is for" is shown. The Tajweed page lists both "can already read" and "from scratch" learners.
6. **Countries in the form:** UK, USA, Canada, UAE, Saudi Arabia, Germany and Other, while the site has 14 country pages. Adding more needs `src/lib/portal/lookups.ts`, which the portal also uses.
7. **Fees** are published only for Canada, USA, UK, UAE, Saudi Arabia and Germany.
8. **Course field in the database:** the course is stored in the message. A dedicated column would allow portal filters and reports.

## Follow-ups (outside the five-page journey)

- **About** now uses the new design system (same content, rebuilt with the shared components).
- **FAQ** and **How it works** (`/enrollment-process`) also use the new design system: same questions, steps and structured data (FAQPage, HowTo). Their questions use `components/ui/FaqList` (native `<details>`: works with keyboard and without JavaScript).
- The country and social pages keep their template layouts.
- The test `old .html URLs redirect permanently (301)` already failed before this work. It expects the template demo pages (`/blog.html`…) to return 301, but commit 6fef758 changed them to 410 Gone.

## Motion (November 2026)

**Library:** [Motion](https://motion.dev) `14.9.1` (`motion`), pinned exactly like the other dependencies. It supports React 18 and 19 (its React and Remix peers are optional). Only the reveal uses it, through `animate` from `motion/mini` (it runs on the browser's Web Animations API) plus `inView` and `stagger`. That adds under 4 kB gzip. Everything else is CSS. AOS stays for the template sections that already use it.

| Where | Animation | How |
| --- | --- | --- |
| Hero and page heads (home, courses, course detail, about, registration) | Text rises in with a 60 ms stagger. The CTA row only moves, so it is visible and clickable from the first frame. The logo or course art settles by scale (no fade, so it never delays the first paint). | CSS `.hq-enter`, `.hq-enter-art` |
| Section headings, course cards, class-format items, steps, fee plans, about cards, closing CTAs | Fade and rise once, on first entry into the viewport. Lists stagger by 70 ms. | `components/motion/Reveal.tsx` (`Reveal`, `RevealGroup`) |
| Buttons | 1 px lift and shadow on hover, slight press on click; arrows nudge forward | CSS `.hq-btn` |
| Course cards | Lift, image zoom (1.03) and arrow nudge on hover and keyboard focus | `CourseCard.module.css` |
| Mobile menu | Fades and drops in, and out again. Escape and focus return are unchanged. | `SiteHeader.module.css` (`data-open`) |
| Registration form | Error summary, field errors and the course preview fade in. Focus still moves to the summary. | CSS `.hq-appear` |
| Fees | The amount fades in when the country changes | `PricingTable` (re-keyed span) |
| Confirmation | The tick pops in once | `confirmation/page.module.css` |

**Timing:** `--hq-ease` = `cubic-bezier(0.22, 1, 0.36, 1)` (calm ease-out, no overshoot); 150 ms for colour changes, 250 ms for feedback, 550–600 ms for entrances. Nothing loops and there is no scroll-linked animation.

**Safety rules (all verified in a browser):**
- The server HTML is fully visible. The reveal hides only content that is still below the fold after hydration, so nothing above the fold waits for JavaScript and pages work without it.
- Content that is skipped (for example by jumping to `/#fees`) reveals when it later comes on screen.
- `prefers-reduced-motion: reduce` turns off every entrance, reveal, hover movement and the legacy AOS animations. Content is shown immediately.
- A `<noscript>` style shows the AOS-animated legacy sections when JavaScript is off (AOS hides them until it runs).
- Only `opacity` and `transform` are animated. The measured layout shift on the animated pages is 0 (0.008 on the confirmation page, from its loading state).
