import { projects, sortProjectsByYear } from "@/data/projects";
import { SectionHeading } from "./section-heading";
import { PortfolioDirectory } from "./portfolio-directory";
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
        title="Quality in context."
        description="The projects I have tested, the work I took on, and the checks behind each release. Open a project for its testing scope and available evidence."
      />
      <ProjectList projects={sortProjectsByYear(projects)} />
      <PortfolioDirectory />
    </section>
  );
}
