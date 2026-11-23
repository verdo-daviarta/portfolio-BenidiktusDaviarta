# Portfolio direction

Personal QA portfolio for recruiters and engineering teams. Based on the owner's
supplied bg2 texture, burgundy accent, Geist and Urbanist typography, portrait interaction,
aligned hero paragraphs, and consistent gallery cards.

Dial: ENERGY 2 / RHYTHM 3 / MOTION 2.

Entry route: `/` shows only a centered "Let's Test!" navigation button before
the main portfolio at `/portfolio`. Both routes share the existing background.
The owner selected hover.dev's Spotlight Button: its clipped light circle follows
the pointer inside the button, with inverted text for a readable light/dark
crossing. This single interactive accent invites entry without adding a loader,
new claims, imagery, or a persistent access gate. Keyboard/touch can navigate
directly; reduced motion keeps the circle centered. Project return links lead
directly to `/portfolio`. The entry link carries the `portfolio-enter` transition
type: React ViewTransition expands a 24px circle at the centered button to 75vmax
over 900ms. This radius covers the farthest corner for any viewport aspect ratio.
The restrained ease-in-out makes the opening visible without a long pause.
The shared page shell captures the old entry and new portfolio together; their
background stays the same. Its completion moves focus to the name button and
skips a second GSAP opening. Direct portfolio visits retain the GSAP opening.
Reduced motion disables the circle. Unsupported browsers navigate normally.

- Identity: a working QA engineer showing how testing fits real projects.
- Voice: first person, concrete work and questions; no invented results or claims.
- Color: dark ink on the owner's light textured background; burgundy identifies
  actions and selection. A 30% white overlay softens the supplied texture.
- Typography: Geist makes long project names readable; the owner's Urbanist
  labels distinguish supporting information without a simulated terminal style.
- Layout: hero introduces the person, a table groups tools, disclosures let
  readers compare projects, and gallery cards keep artifacts easy to scan.
- Motif: shared reading rails, fine rules, paper texture and burgundy active states.
- Spacing: separate chapters generously, keep descriptions close to their actions.
- Media: use the owner's portrait and supplied screenshots, never invented work.
  Repository and Web illustrations remain previews, not product screenshots.
- Cards: equal gallery sizes support comparison across artifact types, as requested.
- Contact: a solid burgundy surface separates the closing action from the work
  archive, as requested. Light text and pink links use tokens scoped to Contact.
- Motion: preserve the portrait slide and GSAP homepage opening. Centered
  section headings reveal vertically with 12px movement over 650ms. Tools,
  projects, gallery and project details settle by 20px over 700ms; Contact
  settles by 24px over 800ms. Reading surfaces stay opaque to preserve contrast.
  The existing Project Overview title keeps its 1500ms horizontal reveal.
  Filters and footer retain a restrained 400ms opacity entrance. Each runs once per
  route visit. No bounce, parallax, card cascade, or scroll hijacking. Reduced
  motion skips these entrances, including when the preference changes live.
- Icons: media types identify artifacts; external arrows identify outgoing links.
- Preserve: hero text alignment, professional-context at 14px, mobile carousel,
  gallery ordering, project metadata, confidentiality notices, and existing links.

The supplied bg2.png is optimized from 18.9 MB to a 473 KB WebP at 2560x1440;
the source file remains untouched. No generated imagery. Motion is the owner's requested animation dependency;
its mini animate API and inView observer avoid the full React animation layer.
GSAP owns the first homepage entrance: name first, then role/action and profile,
finishing within 1.55 seconds. It animates existing children, while Motion retains
section-container entrances. The name/portrait panel transforms remain owned by
the existing portrait interaction. Both /portfolio and /portfolio#home play the opening. Direct
links to other sections, an offscreen hero, and reduced motion skip it. Focus or pointer interaction
finishes the opening immediately; route changes revert styles, and client-side
return navigation does not replay it. No loader, scroll lock, or new assets.
Content is server rendered visibly; JavaScript enhances it without hiding it
while waiting for hydration, an observer callback, or a network download.
