import Image from "next/image";
import Link from "next/link";
import { portfolioSections, workGalleryPreview } from "@/data/portfolio-sections";
import { Icon } from "./icons";
import { RepositoryOverview } from "./repository-overview";
import { SectionHeading } from "./section-heading";

function WorkGalleryPreview() {
  const { screenshots, repository } = workGalleryPreview;

  return (
    <div className="directory-preview" aria-hidden="true">
      {screenshots.map((src) => (
        <div className="directory-preview-image" key={src}>
          <Image src={src} alt="" fill sizes="(max-width: 800px) 70vw, 410px" />
        </div>
      ))}
      {repository && (
        <div className="directory-preview-repository">
          <RepositoryOverview preview={repository} compact />
        </div>
      )}
    </div>
  );
}

export function PortfolioDirectory() {
  return (
    <section
      className="portfolio-directory"
      id="explore"
      aria-labelledby="directory-heading"
    >
      <SectionHeading
        id="directory-heading"
        title="More about my work."
        description="Browse my QA work, learn about my education and certifications, or connect with me online."
      />
      <div className="directory-grid">
        {portfolioSections.map((section) => (
          <Link
            className={
              section.slug === "work-gallery"
                ? "directory-card directory-card-featured"
                : "directory-card"
            }
            key={section.slug}
            href={`/portfolio/${section.slug}`}
          >
            <div className="directory-card-copy">
              <h3>{section.title}</h3>
              <p>{section.preview}</p>
            </div>
            <Icon className="directory-arrow" />
            {section.slug === "work-gallery" && <WorkGalleryPreview />}
          </Link>
        ))}
      </div>
    </section>
  );
}
