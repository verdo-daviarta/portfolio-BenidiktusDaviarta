# First-version verification

Verified on October 2, 2026 against a local production build in Chrome.

- `npm run build`, `npm run typecheck`, and `npm run lint` pass.
- All 16 Playwright tests pass.
- The landing-page Work Gallery shows six cards before scrolling (three columns by two rows on desktop); filtering to six or fewer cards removes the scroll limit. Mouse and keyboard scrolling, responsive columns, and preview focus restoration pass.
- Homepage and all six project routes return HTTP 200.
- Horizontal overflow is absent on the homepage and all project routes at 375, 390, 768, 1024, 1280, and 1440 pixels.
- No page errors or console errors on the checked homepage/project routes.
- Gallery filters, all six preview types, keyboard entry, focus cycling, Escape, close buttons, and focus restoration pass.
- PUSDIKLAT Bela Negara uses `Learning Management/image 1.png` as its hero. All 18 supplied images load and open full-image previews; the other 17 appear in its scrollable sidebar gallery. Published asset copies match the source files by SHA-256.
- Section navigation, reduced-motion scrolling, supplied contact link destinations, and clipboard interaction pass.
- Unknown project routes return the custom HTTP 404 page; its return link works.
- Robots, sitemap, favicon, description, and OpenGraph metadata respond correctly. The deployment origin remains unconfigured.
- axe WCAG A/AA checks report no violations on the homepage, Command Center and PUSDIKLAT Bela Negara project pages, and an open gallery preview at 390 and 1440 pixels.
- Desktop and mobile UI screenshots were reviewed. Warm neutral colors, typography, dividers, and flat project rows carry the design. No gradients, fake metrics, decorative dashboards, glass effects, bento layout, or looping animation.

## Lighthouse

| Local production audit | Performance | Accessibility | Best Practices | SEO |
| ---------------------- | ----------: | ------------: | -------------: | --: |
| Mobile                 |          98 |           100 |            100 | 100 |
| Desktop                |         100 |           100 |            100 | 100 |

Raw audit reports and visual review screenshots are in the ignored `qa/` directory. Scores describe these local runs, not a guarantee for a future deployment or new media.

## Pending owner content

Screenshots are supplied for Command Center and PUSDIKLAT Bela Negara. Documents, spreadsheets, videos, and project repositories remain unpublished where no assets or destinations have been supplied. Actual video playback, external document permissions, and external project availability have not been verified. Project-specific facts remain explicitly unpublished where not provided.

## Repeat the checks

Run `npm test` to start an isolated development server on port 3100 and execute the browser tests. Chrome must be installed, or change the Playwright browser channel for your environment.

For production verification, build and start the site first, then set `QA_BASE_URL` to its origin before running `npm test`.
