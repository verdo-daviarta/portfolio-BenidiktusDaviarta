import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { getProjectMedia } from "@/data/gallery";
import { siteUrl } from "@/data/profile";
import { Header } from "@/components/header";
import { ProjectGallery } from "@/components/project-gallery";
import { Icon } from "@/components/icons";
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    ...(siteUrl
      ? {
          alternates: { canonical: `/projects/${slug}` },
          openGraph: {
            title: project.title,
            description: project.description,
            url: `${siteUrl}/projects/${slug}`,
          },
        }
      : {}),
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const primaryMedia = getProjectMedia(project);
  const liveLinks = project.liveUrls.length
    ? project.liveUrls
    : project.liveUrl
      ? [{ label: "Live project", url: project.liveUrl }]
      : [];
  const facts = [
    { label: "Year", value: project.year ?? "Not listed" },
    { label: "Type", value: project.category },
    { label: "Organization / context", value: project.client },
    {
      label: "My role",
      value: project.role ?? "Project-specific role not yet published",
    },
  ];
  const details = [
    { title: "Context", text: project.description },
    {
      title: "Quality scope",
      text: project.testingScope.length
        ? project.testingScope.join(" · ")
        : "Project-specific testing scope has not been published.",
    },
    {
      title: "Testing approach",
      text:
        project.approach ??
        "Detailed testing approaches will be added when approved for sharing.",
    },
    {
      title: "Tools",
      text: project.technologies.length
        ? project.technologies.join(" · ")
        : "Project-specific tools have not been listed.",
    },
    {
      title: "Outcome",
      text:
        project.outcome ??
        "No project outcomes or performance metrics have been provided for publication.",
    },
  ];
  return (
    <>
      <Header detail />
      <main id="main-content" className="container project-detail">
        <Link className="text-link back-link" href="/#projects">
          <span>←</span> All selected work
        </Link>
        <p className="eyebrow">Project overview</p>
        <h1>
          {project.title}
          <span>.</span>
        </h1>
        <p className="detail-description">{project.description}</p>
        <dl className="detail-facts">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="eyebrow">{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <ProjectGallery projectSlug={project.slug} primaryItem={primaryMedia} />
        <div className="detail-content">
          <aside>
            <p className="eyebrow">A note on this work</p>
            <p>
              <strong>
                If some details are missing/Error, it is because the project is
                still under NDA or the client has not approved the release of
                certain information.
              </strong>
            </p>
            {liveLinks.length > 0 && (
              <div className="project-live-links">
                {liveLinks.map(({ label, url }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-dark"
                  >
                    {label} <Icon name="external" />
                  </a>
                ))}
              </div>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Repository <Icon name="external" />
              </a>
            )}
          </aside>
          <div>
            {details.map((detail) => (
              <section key={detail.title} className="detail-section">
                <h2>{detail.title}</h2>
                <p>{detail.text}</p>
                {detail.title === "Context" && project.products.length > 0 && (
                  <ul className="product-list">
                    {project.products.map((product) => (
                      <li key={product}>{product}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
      <footer className="container detail-footer">
        <Link href="/">Benidiktus Daviarta</Link>
        <Link href="/#contact" className="text-link">
          Get in touch <Icon />
        </Link>
      </footer>
    </>
  );
}
