"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { MediaPlaceholder } from "./media-placeholder";
import { Icon } from "./icons";

export function ProjectList({ projects }: { projects: Project[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <div className="project-index">
      {projects.map((project) => {
        const isOpen = activeSlug === project.slug;
        const titleId = `project-title-${project.slug}`;
        const panelId = `project-panel-${project.slug}`;

        return (
          <article
            key={project.slug}
            className={`project-disclosure ${isOpen ? "featured-project" : "project-row"}`}
          >
            <h3 className="project-disclosure-heading">
              <button
                type="button"
                className="project-row project-toggle"
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-labelledby={titleId}
                onClick={() => setActiveSlug(isOpen ? null : project.slug)}
              >
                <span className="project-row-title">
                  <span id={titleId} className="project-row-name">
                    {project.title}
                  </span>
                  <span className="project-row-client">{project.client}</span>
                </span>
                <span className="project-row-category">{project.category}</span>
                <span className="eyebrow project-row-year">
                  {project.year ?? "Year not listed"}
                </span>
                <span className="project-arrow project-toggle-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    {!isOpen && <path d="M12 5v14" />}
                  </svg>
                </span>
              </button>
            </h3>
            <div id={panelId} hidden={!isOpen}>
              {isOpen && (
                <div className="featured-project-body">
                  <MediaPlaceholder
                    src={project.thumbnail}
                    alt={project.thumbnailAlt}
                    label={project.category}
                    fit="contain"
                    loading="eager"
                  />
                  <div className="featured-copy">
                    <p className="eyebrow">
                      {project.year ?? "Year not listed"} <span>/</span>{" "}
                      {project.category}
                    </p>
                    <h3>
                      <Link href={`/projects/${project.slug}`}>
                        {project.title}
                        <Icon name="external" />
                      </Link>
                    </h3>
                    <p className="project-client">{project.client}</p>
                    <p className="body-copy">{project.description}</p>
                    <Link
                      className="text-link"
                      href={`/projects/${project.slug}`}
                    >
                      Project overview <Icon />
                    </Link>
                    <p className="confidential-note">
                      This overview uses the professional context provided for
                      the portfolio.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
