# Portfolio entry page

During mode continues the owner's session choice. Direction: existing portfolio
palette and typography; ENERGY 2 / RHYTHM 3 / MOTION 2. The owner requested one
centered "Let's Test!" control, using the Spotlight Button reference at
https://www.hover.dev/components/buttons#spotlight-button.

- Hard gate PASS: production build, typecheck, lint, formatting, and diff checks
  pass. All 100 Chrome tests pass, including the new entry route, navigation,
  keyboard, responsive layouts, reduced motion, and no-JavaScript entry. No
  additional dependency, imagery, claims, or external request is needed at runtime.
- Purpose gate PASS: `/` presents the requested entry action against the shared
  portfolio background. The reference's clipped 128px circle follows the pointer
  horizontally; text inversion keeps the label readable across its boundary.
  This is the single visual focus, with no loading screen or extra content.
- Liveliness PASS: the entry uses the owner's requested wording, existing palette,
  and the specific Spotlight interaction. Its restrained composition introduces
  the existing name/portrait opening after navigation to `/portfolio`. Desktop,
  mobile, focus, pointer-left, and completed portfolio screenshots were inspected.
- Craftsmanship PASS: a native navigation link works with keyboard, touch, or
  disabled JavaScript. Pointer movement updates one CSS variable without React
  state updates or accumulating animations. Reduced motion leaves the circle
  centered and removes the press movement. Project return links and the 404
  action lead straight to `/portfolio`; the sitemap includes its new URL.

## Accessibility evidence

Axe reports the white label color before `mix-blend-mode: difference` is
composited, producing a contrast finding for `.spotlight-label`. This is isolated
to that label's color-contrast finding; all other rules and nodes remain checked.
The regression test separately verifies the difference blend and computes the
actual foreground/background contrast from both opaque surfaces' computed
colors. The Anti Slop contrast checker independently confirms 16.58:1 over the
light circle and 17.39:1 over the dark button. Inspected screenshots confirm
dark text within the circle and light text outside it.

The initial targeted run passed 16/19 scenarios: two failed on that uncomposited
Axe result, and one assumed the pointer position ignored the button border.
The contrast test now checks the rendered blend; the geometry test checks the
circle's actual center within 2px of the pointer. Focused entry retest: 4/4 pass.
Final full production suite: **100 passed, zero failed, skipped, or flaky**.

## Files and evidence

- `src/app/page.tsx`: entry page.
- `src/app/portfolio/page.tsx`: existing portfolio moved to its own route.
- `src/components/spotlight-button.tsx`: adapted reference interaction.
- `src/app/globals.css`: scoped entry/button styling and reduced motion.
- Navigation, GSAP route guard, sitemap, and browser tests use `/portfolio`.
- `README.md` and `DESIGN.md` describe the new route and interaction.
- Final results: `qa/entry-page/final-tests.json`.
- Recording: `qa/entry-page/entry-preview.webm`.
- Screenshots: `entry-390.png`, `entry-1440.png`, `entry-focus.png`,
  `spotlight-left.png`, and `portfolio-after-entry.png` in the same directory.

The first capture checked the final style before GSAP started and was replaced.
The final recording observes animation startup, waits for its completed UI state,
and shows the complete portfolio after entry.

## Limits

Verified locally in Chrome production mode. Firefox, Safari, deployment, and
external service availability were not checked. This is a presentation entry
page; `/portfolio` and individual project URLs remain directly accessible.
