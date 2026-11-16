# Portfolio direction

Personal QA portfolio for recruiters and engineering teams. Based on the owner's
existing green palette, Geist and Urbanist typography, portrait interaction,
aligned hero paragraphs, and consistent gallery cards.

Dial: ENERGY 2 / RHYTHM 3 / MOTION 2.

- Identity: a working QA engineer showing how testing fits real projects.
- Voice: first person, concrete work and questions; no invented results or claims.
- Color: paper and ink support reading; green identifies actions and selection.
- Typography: Geist makes long project names readable; the owner's Urbanist
  labels distinguish supporting information without a simulated terminal style.
- Layout: hero introduces the person, a table groups tools, disclosures let
  readers compare projects, and gallery cards keep artifacts easy to scan.
- Motif: shared reading rails, fine rules, green section blocks and active states.
- Spacing: separate chapters generously, keep descriptions close to their actions.
- Media: use the owner's portrait and supplied screenshots, never invented work.
  Repository and Web illustrations remain previews, not product screenshots.
- Cards: equal gallery sizes support comparison across artifact types, as requested.
- Contact: a dark closing section separates the next action from the work archive.
- Motion: preserve the portrait slide and the owner's current 1500ms timing.
  Section accents reveal from left to right first, then their heading and
  paragraph reveal over the next 1500ms. Observe the pair together so the text
  cannot start before its accent. Other entrances retain their existing timing.
  Tables and galleries ease into full opacity; Contact and project descriptions
  settle by 8px. Each runs once per
  route visit. No bounce, parallax, card cascade, or scroll hijacking. Reduced
  motion skips these entrances, including when the preference changes live.
- Icons: media types identify artifacts; external arrows identify outgoing links.
- Preserve: hero text alignment, professional-context at 14px, mobile carousel,
  gallery ordering, project metadata, confidentiality notices, and existing links.

No new visual assets. Motion is the owner's requested animation dependency;
its mini animate API and inView observer avoid the full React animation layer.
Content is server rendered visibly; JavaScript enhances it without hiding it
while waiting for hydration, an observer callback, or a network download.
