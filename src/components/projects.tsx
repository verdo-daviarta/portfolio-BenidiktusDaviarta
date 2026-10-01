import { projects } from "@/data/projects";
import { SectionHeading } from "./section-heading";
import { ProjectGallery } from "./project-gallery";
import { ProjectList } from "./project-list";

export function Projects() {
  return (
    <section
      id="projects"
      className="section projects-section container"
      aria-labelledby="projects-heading"
    >
      <SectionHeading
        id="projects-heading"
        label="Selected work"
        title="Quality in context."
        description="Enterprise platforms, connected systems, and immersive applications. A selection from my professional experience."
      />
      <ProjectList projects={projects} />
      <ProjectGallery />
    </section>
  );
}
