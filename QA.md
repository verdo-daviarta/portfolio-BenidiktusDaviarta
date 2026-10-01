# First-version verification

Verified on October 1, 2026 against a local production build in Chrome.

- `npm run build`, `npm run typecheck`, and `npm run lint` pass.
- All 11 Playwright tests pass.
- Homepage and all six project routes return HTTP 200.
- Horizontal overflow is absent on the homepage and all project routes at 375, 390, 768, 1024, 1280, and 1440 pixels.
- No page errors or console errors on the checked homepage/project routes.
- Gallery filters, all six preview types, keyboard entry, focus cycling, Escape, close buttons, and focus restoration pass.
- Section navigation, reduced-motion scrolling, supplied contact link destinations, and clipboard interaction pass.
- Unknown project routes return the custom HTTP 404 page; its return link works.
- Robots, sitemap, favicon, description, and OpenGraph metadata respond correctly. The deployment origin remains unconfigured.
- axe WCAG A/AA checks report no violations on the homepage, a project page, and an open gallery preview at 390 and 1440 pixels.
- Desktop and mobile UI screenshots were reviewed. Warm neutral colors, typography, dividers, and flat project rows carry the design. No gradients, fake metrics, decorative dashboards, glass effects, bento layout, or looping animation.

## Lighthouse

| Local production audit | Performance | Accessibility | Best Practices | SEO |
| ---------------------- | ----------: | ------------: | -------------: | --: |
| Mobile                 |          98 |           100 |            100 | 100 |
| Desktop                |         100 |           100 |            100 | 100 |

Raw audit reports and visual review screenshots are in the ignored `qa/` directory. Scores describe these local runs, not a guarantee for a future deployment or new media.

## Pending owner content

Actual screenshots, documents, spreadsheets, videos, project repositories, and live project URLs have not been supplied. Their data fields and publishing slots are ready. No actual media playback, external document permissions, or project destination availability can be verified until those assets are added. Project-specific scope, tools, roles, and outcomes remain explicitly unpublished where not provided.

## Repeat the checks

Run `npm test` to start an isolated development server on port 3100 and execute the browser tests. Chrome must be installed, or change the Playwright browser channel for your environment.

For production verification, build and start the site first, then set `QA_BASE_URL` to its origin before running `npm test`.
