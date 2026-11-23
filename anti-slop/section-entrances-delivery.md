# Section entrances

During mode continues the owner's session choice. Existing portfolio direction:
ENERGY 2 / RHYTHM 3 / MOTION 2. Scope: strengthen section entrances without
changing the supplied content, layout, portrait interaction, or visual assets.

- Hard gate PASS: all 95 browser tests pass on a fresh local production build.
  Includes mobile/desktop Axe checks, responsive layouts, keyboard previews,
  reduced motion, client navigation, and content without JavaScript. No new
  assets, claims, navigation, or dependencies were introduced.
- Purpose gate PASS: centered headings reveal vertically over 650ms with 12px
  movement; evidence sections settle by 20px over 700ms; Contact settles by
  24px over 800ms. These entrances mark the reading chapters while preserving
  opaque text. No bouncing, loops, individual card cascades, or scroll blocking.
- Liveliness PASS: the existing name/portrait opening remains the focal point.
  Centered headings, tool table, project disclosures, gallery, and Contact retain
  their different compositions. The shared settle motion connects these chapters.
  Desktop scroll recording and Contact screenshot were captured and inspected.
- Craftsmanship PASS: section animations run once per route visit, cancel on
  preference changes and cleanup, and use the existing Motion controller.
  GSAP retains the homepage opening. Build, typecheck, lint, formatting, and
  diff checks pass. The preview dialog now uses an opaque canvas background so
  moving bright content behind it cannot change text contrast (16.86:1 for ink
  on canvas, verified with the Anti Slop contrast checker).

## Verification

New regressions observe native animation creation and the animated properties
for headings, tools, projects, gallery, Contact, and footer at 390/1440px.
Existing tests verify once-only entrances, live reduced-motion changes, route
navigation, and readable content without JavaScript.

The first full run passed 90/95 tests. Five stale assertions assumed exactly one
native animation per heading or an exact floating-point height of 200px. Heading
properties now assert matching timing; card sizes retain 200px assertions with
less than 0.005px rounding tolerance. A subsequent focused run caught translucent
dialog contrast over bright content. The dialog surface was fixed, its regression
assertion added, and the complete suite rerun: **95 passed, zero failed**.

- Final full-suite result: `qa/section-entrances/final-tests.json`.
- Scroll recording: `qa/section-entrances/preview.webm`.
- Inspected Contact screenshot: `qa/section-entrances/contact.png`.
- Animation settings: `src/components/section-motion.tsx`.

## Limits

Verified in local Chrome production mode. Firefox, Safari, deployment, external
service availability, and field performance were not checked for this change.
