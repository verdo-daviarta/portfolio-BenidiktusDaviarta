# GSAP homepage opening

Direction: the existing QA portfolio, ENERGY 2 / RHYTHM 3 / MOTION 2.
During mode continues the owner's choice. No new visual assets.

- Hard gate PASS: 26 targeted browser tests pass, including six responsive
  widths, keyboard portrait toggling, Axe desktop/mobile, reduced motion,
  client navigation and content without JavaScript. Build/typecheck/lint/
  formatting pass. Text remains visible in server HTML; no blocking loader.
- Purpose gate PASS: a 0.89s GSAP sequence introduces name, role/action, profile
  and supporting context in reading order. Movement is 8 to 12px with power2.out.
  This establishes hierarchy without looping or changing the layout.
- Liveliness PASS: existing name, portrait, theme, aligned columns and evidence
  remain the identity. The opening adds no claims, statistics, or stock imagery.
- Craftsmanship PASS: GSAP context reverts styles on completion, interaction,
  preference changes, and route cleanup. Motion no longer targets hero-bottom
  or professional-context opacity, so the libraries do not compete for them.

## Evidence

- New tests observe real title style changes and verify the final opacity,
  transform, clean inline styles, and no horizontal overflow at 390/1440px.
- Focus/Enter opens the portrait during initial entry; the photo button returns
  to the introduction. Existing keyboard/focus/reduced-motion tests still pass.
- Project disclosure opens and overview link navigates; returning home does not
  replay the GSAP opening. Direct /#projects and reduced motion skip it.
- Six viewport layout tests and existing Motion entrance tests pass.
- Native Python Playwright captured final hero states after networkidle at
  1440/390px. Mobile screenshot inspected at qa/gsap-opening/hero-390.png.
- Implementation: src/components/page-entrance.tsx; wired once in RootLayout.
- Animation reasons and ownership are also recorded in DESIGN.md.

## Limits

Chrome local production build. Full suite, Firefox/Safari, external links,
deployment and field Web Vitals were not rechecked for this change.

## Follow-up: opening visibility

Reproduced on fresh browser documents: `/` ran the opening, while `/#home`
incorrectly skipped it because the guard rejected every hash. The guard now
accepts the Home anchor; other section anchors and an offscreen hero still skip.
The opening now runs for 1.55s with 12 to 28px movement and sequential vertical
reveals. Reveals keep text colors opaque: a longer zero-opacity fade briefly
failed Axe contrast checks during animation, so that draft was replaced.

- Hard gate PASS: all 27 targeted tests pass, including the new direct-Home
  regression, desktop/mobile Axe, focus, keyboard, reduced motion, six layout
  widths, client return, and content without JavaScript. Build/static checks pass.
- Purpose/Liveliness PASS: the stronger reading-order reveal is visible without
  adding a loader or blocking navigation; the existing portrait remains separate.
- Craftsmanship PASS: native browser capture confirms an intermediate clipped
  frame and clean final styles. Video: qa/gsap-opening/opening-preview.webm.
  Frames: opening-start.png and opening-complete.png in the same directory.
- A screenshot attempt against an already-stopped test server was discarded;
  final evidence was captured with a fresh server managed in the same process.
- Full suite, Firefox/Safari and deployment were not rerun. Reduced motion
  intentionally suppresses the opening. Fast Refresh is not a fresh page visit;
  reload the homepage to preview the initial-access animation again.
