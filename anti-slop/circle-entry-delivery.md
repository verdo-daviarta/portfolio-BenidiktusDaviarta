# Supplied background and circular portfolio entrance

During mode continues the owner's choice. Direction: supplied bg2 texture,
dark ink, existing burgundy accent, Geist and Urbanist. ENERGY 2 / RHYTHM 3 /
MOTION 2. No generated imagery or added runtime dependency.

- Hard gate PASS: production build, typecheck, lint, formatting, and diff checks
  pass. Fourteen focused browser tests pass for circular navigation, entry,
  keyboard, reduced motion, unsupported-browser fallback, and desktop/mobile
  Axe audits including project previews. The source image is owner-supplied;
  its original file remains untouched.
- Purpose gate PASS: the fixed texture continues through entry, portfolio,
  Contact, and project pages. A 35% paper wash and dark text protect readability.
  The entry link alone requests the `portfolio-enter` transition type. Its circle
  expands from 24px at the centered button to 75vmax in 900ms with a restrained
  ease-in-out. The ending radius covers the viewport corners at every aspect ratio.
- Liveliness PASS: the requested texture and Spotlight control provide the
  identity; existing portrait, gallery evidence, and reading layout remain.
  The circle connects the entry action with the revealed portfolio. Desktop and
  mobile screenshots and the intermediate mobile circle were visually inspected.
- Craftsmanship PASS: React ViewTransition coordinates the page snapshots with
  native Link navigation. Completion focuses the name button and skips a second
  GSAP opening. Direct portfolio visits retain GSAP. Reduced motion removes the
  circle; unsupported browsers and disabled JavaScript retain normal navigation.
  The 18,902,370-byte PNG becomes a 472,922-byte WebP at 2560x1440.

## Verification and limits

The complete production regression run passed 103/104 scenarios. The remaining
EMS mobile geometry assertion read the card and its children in different frames
while the page moved. It now captures all rectangles in one synchronous browser
evaluation, preserving the original containment assertions. Its targeted retest
passes at all three widths: 390, 768, and 1440px. No application change followed
the full run; the entire suite was not repeated after that test-only repair.

The new regression records the native circle keyframes and duration at 390/1440px,
checks focus after completion, shared backgrounds, and no horizontal overflow.
Normal browser entry, keyboard entry, no-JavaScript entry, reduced motion, and
missing View Transitions API navigation are covered. The existing entry test
checks composited Spotlight contrast separately from Axe's unblended-label result.

The optimized image's minimum RGB channel is 149. After the 35% wash it is at
least 183. The contrast checker verifies ink #252922 at 7.38:1 and supporting
text #40463e at 4.84:1 against #b7b7b7; burgundy #7b2949 is 4.64:1. Gallery
Preview labels use a solid burgundy surface and Contact uses dark readable text.

- Native API reference: https://react.dev/reference/react/ViewTransition.
- Implementation: `src/components/page-view-transition.tsx` and `src/app/globals.css`.
- Results: `qa/circle-entry/target-tests.json`, `final-tests.json`, `ems-retest.json`.
- Real desktop/mobile recording: `qa/circle-entry/circle-preview.webm`.
- Screenshots in the same directory: `entry-1440.png`, `entry-390.png`,
  `portfolio-1440.png`, `portfolio-390.png`, `circle-middle-390.png`,
  `contact-390.png`, and `project-390.png`.

The first diagnostic Python filename shadowed the standard inspect module and
was renamed before successful capture. Early diagnostic captures were replaced;
the final recording contains real unpaused navigation, while the intermediate
circle screenshot intentionally freezes only that animation for inspection.

Verified in local Chrome production mode. Actual Firefox/Safari rendering,
deployment, and field performance were not checked. Browsers without native
View Transitions enter immediately.

## Contact background follow-up

The owner requested a distinct Contact surface. It now uses solid burgundy
`#45061b`, with light ink, supporting text, pink links, and divider tokens scoped
to the section. The supplied texture continues on other page surfaces.

- Hard gate PASS: production build and formatting pass; three relevant browser
  tests pass for desktop/mobile Axe, navigation, clipboard, and reduced motion.
- Purpose gate PASS: the solid closing surface separates the contact action
  from the work archive while retaining the portfolio's burgundy accent.
- Liveliness PASS: existing Contact composition and wording remain; desktop
  and mobile captures show the requested contrast between page sections.
- Craftsmanship PASS: CSS tokens are scoped to Contact. Measured contrast is
  10.51:1 for supporting text and 7.66:1 for pink links against the background.
  Native Python Playwright verifies the background at 390/1440px; the desktop
  screenshot was visually inspected. Results: `qa/circle-entry/contact-tests.json`.

Captures: `contact-burgundy-390.png` and `contact-burgundy-1440.png` in the same
QA directory. The full suite and actual Firefox/Safari were not rerun for this
scoped CSS change.

## White overlay follow-up

- Hard gate PASS: the requested white overlay is exactly 30%; supporting text
  has 4.73:1 contrast against the texture's conservative minimum after compositing.
- Purpose gate PASS: one white gradient softens the existing background image.
- Liveliness PASS: the owner's texture remains the background; no new assets
  or composition changes were introduced.
- Craftsmanship PASS: formatting and diff checks pass. The current Contact
  background (#252922, subsequently set by the owner) is preserved. Browser
  tests were not rerun for this single CSS color adjustment.
