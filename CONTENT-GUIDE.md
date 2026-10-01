# Updating the portfolio

The initial content comes from the supplied PRD. Missing media and project-specific facts are explicitly unpublished. Gallery entries are reserved publishing slots, not examples of claimed work.

## Profile and contact

Edit `src/data/profile.ts` for the name, roles, professional description, location, email, LinkedIn, and GitHub. The supplied social addresses are profile links, not project repositories.

## Projects

Edit `src/data/projects.ts`. Each record creates `/projects/[slug]` automatically. Rebuild after adding a project because these routes are statically generated.

| Field                                                         | Content                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------ |
| `title`, `slug`, `client`, `year`, `category`                 | Project identity and context; use `null` for an unknown year |
| `description`, `products`                                     | Approved overview and product names                          |
| `role`, `testingScope`, `approach`, `technologies`, `outcome` | Project-specific facts; keep empty until confirmed           |
| `thumbnail`, `thumbnailAlt`                                   | Local image path and accessible description                  |
| `liveUrl`, `repositoryUrl`                                    | Actual destinations; empty fields generate no links          |

Put screenshots in `public/projects/` and reference them as `/projects/your-image.webp`. The site uses Next.js Image for responsive sizing, lazy loading, and stable layout. External image hosts must be explicitly allowed in `next.config.ts` before using remote images.

## Work gallery

Edit `src/data/gallery.ts`. Add actual work, supply its metadata and assets, and set `isPlaceholder: false`. Remove unused publishing slots if preferred. Filters appear for six or more entries. Associating an artifact with `projectSlug` also places it in that project's gallery.

| Type          | Preview and destination                                                       |
| ------------- | ----------------------------------------------------------------------------- |
| `image`       | `thumbnail` for the gallery, `source` for the full preview                    |
| `spreadsheet` | Screenshot in `thumbnail`; `documentUrl` opens the real spreadsheet           |
| `document`    | Cover/screenshot in `thumbnail`; `documentUrl` or `source` opens the document |
| `video`       | Set provider and source/ID as described below                                 |
| `web`         | Screenshot in `thumbnail`; `projectUrl` opens the app                         |
| `repository`  | Preview in `thumbnail`; `repositoryUrl` opens the actual repository           |

Also fill `title`, `description`, `thumbnailAlt`, `year`, and `technologies` where known. Artifact links appear only when configured. A spreadsheet itself is never embedded in the page.

## Videos

- Local MP4/WebM: put the file in `public/videos/`, set `videoProvider: "file"`, and set `source` to its public path.
- External direct video: use `videoProvider: "file"` and the actual MP4/WebM URL in `source`.
- YouTube/Vimeo: set `videoProvider` and `videoId` (the provider's ID, not a full URL).
- Set `thumbnail` to an approved poster image. For a local caption track, use `captionsSource` with a WebVTT path.

Video appears in a controlled modal, starts muted, and never autoplays. Local videos pause when hidden or out of view. Hosted players unload when hidden and can be loaded again. Closing a preview removes the player. These defaults also respect reduced-motion preferences. Real playback and hosted-provider availability must be checked after actual videos are supplied.

## Deployment URL

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the real public origin. Rebuild after changing it. This enables canonical URLs, project OpenGraph URLs, and a sitemap containing the homepage and all project routes. Before an origin is supplied, the sitemap is intentionally empty and no domain is invented.

Deploy to a Next.js-compatible host using `npm run build` and `npm run start`. Dependencies are locked in `package-lock.json`; fonts are served locally. No API keys or external services are required to run the portfolio.
