# Section motion follow-up

Anti Slop during mode, continuing the owner's selected direction.
ENERGY 2 / RHYTHM 3 / MOTION 2. Reasons are recorded in DESIGN.md.

- Hard gate PASS (R-03/R-25/R-32/R-35/R-39): all 80 existing regression tests
  pass with animation enabled, including responsive pages, keyboard operation,
  gallery ordering and dimensions, focus restoration, video, and Axe WCAG checks.
- Purpose gate PASS (R-19/R-31): headings reveal along the reading rail in
  500ms; tables and gallery groups fade from 0.92 to full opacity in 400ms;
  Contact and project text settle by 8px in 450ms. No bouncing, parallax,
  individual-card cascade, looping, or change to the portrait animation.
- Liveliness PASS: three treatments correspond to headings, evidence groups,
  and closing/detail content. The owner's palette, aligned hero and equal cards
  remain intact; no new media or invented content.
- Craftsmanship PASS: build, TypeScript, lint, formatting, and diff checks pass.
  Native Motion mini animate and inView enhance the existing DOM without adding
  layout wrappers. Observers/animations are cleaned up on route changes.

## Additional checks

Five new motion tests pass after correcting their Contact class-name match
(the element has both `container` and `contact-grid` classes):

- 390px: section animation plays once after entering view, not on repeat scroll.
- 1440px: same once-only behavior, no overflow, final transform is none.
- Reduced motion: no JavaScript entrances from initial render.
- Live preference change: cancels animation and removes observation.
- Client navigation: project detail sections animate after Next.js navigation.
- JavaScript disabled: server-rendered content stays readable and visible.

Existing interaction evidence is listed in delivery-2026-11-16.md. No control
behavior changed in this follow-up. Final Contact screenshot inspected at
`.next/motion-contact.png`. Initial full run: 83 pass and two test-matcher
failures; corrected targeted run: all five motion tests pass. Application code
was unchanged between these runs.

## Dependencies and limits

Added the requested motion@14.14.0 and its lockfile entries. Restored the libc
platform metadata that npm removed from 38 otherwise unchanged packages.
Production dependency audit reports one critical affected dependency, the
pre-existing next@16.3.8; Motion is not listed. The audit reports no available
automatic fix. No framework upgrade or forced audit fix was attempted.

Chrome production build tested; Firefox/Safari, deployment, external service
availability and field performance were not checked. Existing NoFallbackError
logging for unknown project slugs remains; usable 404 tests pass.

## Follow-up: accent before heading copy

The owner requested left-to-right accent entry followed by adjacent text.
Preserved the owner's current 1500ms entrance duration. A single observer starts
the accent immediately and the heading/paragraph with a 1500ms delay; both use
the same reading-direction reveal and easing. Cancelling for reduced motion
restores both to their visible static state, including during the delay.

- Purpose/Liveliness PASS: the accent introduces the chapter before its copy,
  follows the existing reading rail, and adds no looping or decorative bounce.
- Hard gate/Craftsmanship PASS: 13 targeted tests pass, including two new timing
  checks at 390px/1440px, all motion tests, heading consistency, hero alignment,
  and mobile/desktop Axe checks. Build, typecheck, lint, formatting and diff pass.
- Timing checks inspect real browser animations: accent delay 0ms, text delay
  1500ms, both duration 1500ms; text is clipped during the first phase and both
  become fully visible when reduced motion is enabled mid-sequence.
