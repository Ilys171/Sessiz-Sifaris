# Səssiz Sifariş — website

Landing page for **Səssiz Sifariş** ("Silent Order"), a universal mobile ordering concept for restaurants by AAYAHCE.

Astro + TypeScript + Tailwind CSS 4. Static output, no server needed.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + static build into dist/
npm run preview
```

## Deploy
- **GitHub Pages (live):** https://www.sessizsifaris.com — `.github/workflows/deploy.yml` builds and deploys on every push to `main`. The custom domain is in `public/CNAME`. Use `import.meta.env.BASE_URL` for internal links so a `base` path can be added later.
- **Netlify:** `netlify.toml` is included (build `npm run build`, publish `dist`).
- **Vercel:** import the repo; the Astro preset is detected automatically.
- If hosting under a sub-path (e.g. `ilys171.github.io/Sessiz-Sifaris/`), set `base` and update `site` in `astro.config.mjs`.

## Where things live
| What | File |
| --- | --- |
| All visible text | `src/content/en.ts` |
| Demo prices (illustrative) | `src/content/demo-menu.ts` |
| Form endpoint, contact email, AAYAHCE link | `src/config.ts` |
| Design tokens (Cobalt & Lime) | `src/styles/global.css` (`:root` + `@theme`) |
| Sections | `src/components/*.astro` |
| Demo state machine | `src/scripts/demo.ts` |
| Contact form logic | `src/scripts/form.ts` |

## Placeholders to replace before launch
- `siteConfig.formEndpoint` — empty: the form validates but does not send, and tells visitors to email instead. Any endpoint accepting a `FormData` POST works (e.g. Formspree).
- `siteConfig.contactEmail`, `siteConfig.aayahceUrl`.
- Team (`about.team`), the photo placeholder in "For restaurants", and the privacy policy page (`src/pages/privacy.astro`).

## Adding Azerbaijani / Russian
1. Copy `src/content/en.ts` to `az.ts` / `ru.ts`, type it as `Dictionary`, translate values (keep keys).
2. Register it in `src/content/index.ts`.
3. Add pages (e.g. `src/pages/az/index.astro`) that call `getDictionary('az')` and pass it down (components currently call `getDictionary()` for the default locale).

## Content rules
- Do not add statistics, results, partners or testimonials — the pilot has not run yet.
- Lime is an accent for "where help appears" only; never lime text on light backgrounds.
- Accessibility: WCAG 2.2 AA. The build was checked with axe-core (0 violations) and a scripted keyboard walkthrough of the demo.
