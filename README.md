# Benidiktus Daviarta · Portfolio

A restrained engineering portfolio for a Software Quality Assurance Lead and QA Automation Engineer. Built with Next.js App Router, TypeScript, Tailwind CSS, and ESLint. Professional content comes from the supplied PRD; no project metrics, screenshots, or URLs are invented.

## Run

Requires Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

On Windows PowerShell with script execution restrictions, use `npm.cmd` instead of `npm`. Open the local URL printed by Next.js; the default port is 3000.

## Check and build

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run start
```

Browser tests use installed Chrome. See [QA.md](QA.md) for verified behavior, Lighthouse results, and production-test instructions.

## Structure

- `src/app/`: homepage, static project routes, custom 404, SEO metadata routes, favicon, and design tokens.
- `src/components/`: reusable navigation, editorial sections, stack, project index, gallery, media players, contact, and footer.
- `src/data/`: profile, project records, technology categories, and typed gallery artifacts.
- `public/projects/`, `public/gallery/`, `public/videos/`: reserved locations for owner-supplied assets.
- `tests/`: responsive, accessibility, navigation, gallery, clipboard, and route verification.

The homepage contains Home, Tech Stack, Projects with the Work Gallery, and Contact. Each project has a dedicated route. Client JavaScript is limited to navigation state, gallery controls, media playback management, and clipboard interaction. Fonts are hosted locally.

## Add your content

See [CONTENT-GUIDE.md](CONTENT-GUIDE.md) for field-by-field instructions. Missing media stays clearly labeled. Optional project/document/repository links are hidden until a real destination is configured.

Set `NEXT_PUBLIC_SITE_URL` using `.env.example` when the real deployment domain is known, then rebuild to generate canonical URLs and sitemap entries.
