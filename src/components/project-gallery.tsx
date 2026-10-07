"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  artifactLabels,
  gallery,
  type ArtifactType,
  type GalleryItem,
} from "@/data/gallery";
import { MediaPlaceholder } from "./media-placeholder";
import { DocumentOverview } from "./document-overview";
import { SpreadsheetOverview } from "./spreadsheet-overview";
import { VideoPreview } from "./video-preview";
import { Icon } from "./icons";

const filters: { id: "all" | ArtifactType; label: string }[] = [
  { id: "all", label: "All artifacts" },
  { id: "spreadsheet", label: "Spreadsheets" },
  { id: "video", label: "Video" },
  { id: "document", label: "Documents" },
  { id: "image", label: "Images" },
  { id: "web", label: "Web" },
  { id: "repository", label: "Source" },
];

export function ProjectGallery({
  projectSlug,
  primaryItem,
}: {
  projectSlug?: string;
  primaryItem?: GalleryItem;
}) {
  const [filter, setFilter] = useState<"all" | ArtifactType>("all");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const galleryViewportRef = useRef<HTMLDivElement>(null);
  const galleryGridRef = useRef<HTMLDivElement>(null);
  const items = projectSlug
    ? gallery.filter((item) => item.projectSlug === projectSlug)
    : gallery;
  const visibleItems = items.filter(
    (item) =>
      item.id !== primaryItem?.id && (filter === "all" || item.type === filter),
  );
  const scrollableGallery = Boolean(primaryItem && visibleItems.length > 3);
  const scrollableLandingGallery =
    !projectSlug && !primaryItem && visibleItems.length > 6;
  useEffect(() => {
    const viewport = galleryViewportRef.current;
    const grid = galleryGridRef.current;
    if (!scrollableLandingGallery || !viewport || !grid) return;

    viewport.scrollTop = 0;
    const cards = Array.from(grid.children).slice(0, 6);
    function updateViewportHeight() {
      if (!viewport || !grid) return;
      const gridTop = grid.getBoundingClientRect().top;
      const lastRowBottom = Math.max(
        ...cards.map((card) => card.getBoundingClientRect().bottom),
      );
      // Include the viewport padding so all six cards and focus rings fit.
      viewport.style.maxHeight = `${Math.ceil(lastRowBottom - gridTop) + 8}px`;
    }
    const observer = new ResizeObserver(updateViewportHeight);
    observer.observe(grid);
    cards.forEach((card) => observer.observe(card));
    updateViewportHeight();
    return () => {
      observer.disconnect();
      viewport.style.removeProperty("max-height");
    };
  }, [scrollableLandingGallery, filter]);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!selected || !dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);
  function keepFocusInPreview(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], video[controls], iframe, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  return (
    <div className={primaryItem ? "project-media-layout" : undefined}>
      {primaryItem &&
        (primaryItem.thumbnail ? (
          <button
            className="main-project-preview"
            aria-label={`Preview ${primaryItem.title}`}
            onClick={() => setSelected(primaryItem)}
          >
            <MediaPlaceholder
              src={primaryItem.thumbnail}
              alt={primaryItem.thumbnailAlt}
              label={primaryItem.title}
              fit="contain"
              loading="eager"
            />
            <span className="preview-action">
              Preview <Icon name="external" />
            </span>
          </button>
        ) : (
          <div className="main-project-preview">
            <MediaPlaceholder
              alt={primaryItem.thumbnailAlt}
              label={`${primaryItem.title} / Project media`}
              fit="contain"
            />
          </div>
        ))}
      <div
        className={`work-gallery${primaryItem ? " work-gallery-sidebar" : ""}`}
      >
        {primaryItem ? (
          <h2 className="sidebar-gallery-heading">Work Gallery</h2>
        ) : (
          <div className="gallery-heading">
            <div>
              <p className="eyebrow">The working record</p>
              <h3>
                Work gallery<span>.</span>
              </h3>
            </div>
            <p>
              {projectSlug
                ? "Screenshots and the work behind this project."
                : "Test plans, screenshots, automation, and the work behind a release."}
              <br />
              Select an artifact to view its preview.
            </p>
          </div>
        )}
        {!primaryItem && items.length >= 6 && (
          <div
            className="gallery-filters"
            role="group"
            aria-label="Filter work artifacts"
          >
            {filters.map(({ id, label }) => (
              <button
                key={id}
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <p className="sr-only" role="status">
          {visibleItems.length}{" "}
          {visibleItems.length === 1 ? "artifact" : "artifacts"} shown
        </p>
        {visibleItems.length ? (
          <div
            ref={galleryViewportRef}
            className={
              scrollableLandingGallery
                ? "landing-gallery-scrollable"
                : undefined
            }
            role={scrollableLandingGallery ? "region" : undefined}
            aria-label={
              scrollableLandingGallery ? "Work Gallery artifacts" : undefined
            }
            tabIndex={scrollableLandingGallery ? 0 : undefined}
          >
            <div
              ref={galleryGridRef}
              className={`gallery-grid${scrollableGallery ? " gallery-grid-scrollable" : ""}`}
              role={scrollableGallery ? "region" : undefined}
              aria-label={
                scrollableGallery ? "Work Gallery screenshots" : undefined
              }
              tabIndex={scrollableGallery ? 0 : undefined}
            >
              {visibleItems.map((item) => (
                <article className="gallery-item" key={item.id}>
                  <button
                    className="gallery-preview"
                    onClick={() => setSelected(item)}
                    aria-label={`Preview ${item.title}`}
                  >
                    {item.type === "spreadsheet" ? (
                      <SpreadsheetOverview
                        title={item.title}
                        excerpt={item.spreadsheetPreview}
                        isPlaceholder={item.isPlaceholder}
                        isLinked={hasPublishedDocument(item)}
                        compact
                      />
                    ) : hasPublishedDocument(item) && item.documentPreview ? (
                      <DocumentOverview
                        title={item.title}
                        excerpt={item.documentPreview}
                        compact
                      />
                    ) : (
                      <MediaPlaceholder
                        src={item.thumbnail}
                        alt={item.thumbnailAlt}
                        kind={item.type}
                        label={artifactLabels[item.type]}
                        linkedDocument={hasPublishedDocument(item)}
                        compact
                        fit={item.type === "image" ? "contain" : "cover"}
                      />
                    )}
                    <span className="preview-action">
                      {item.type === "video" ? "View demo" : "Preview"}{" "}
                      <Icon
                        name={item.type === "video" ? "play" : "external"}
                      />
                    </span>
                  </button>
                  {!primaryItem && (
                    <>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      {item.technologies.length > 0 && (
                        <p className="eyebrow">
                          {item.technologies.join(" / ")}
                        </p>
                      )}
                      <ArtifactLinks item={item} />
                    </>
                  )}
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p className="empty-gallery">
            No shareable artifacts have been published for this project yet.
          </p>
        )}
        <dialog
          ref={dialogRef}
          className="preview-dialog"
          aria-labelledby="preview-title"
          aria-describedby="preview-description"
          onKeyDown={keepFocusInPreview}
          onCancel={() => setSelected(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
          onClose={() => setSelected(null)}
        >
          {selected && (
            <div className="dialog-inner">
              <div className="dialog-header">
                <span className="eyebrow">
                  {artifactLabels[selected.type]} / Preview
                </span>
                <button
                  autoFocus
                  className="dialog-close"
                  aria-label="Close preview"
                  onClick={() => setSelected(null)}
                >
                  <Icon name="close" />
                </button>
              </div>
              <h2 id="preview-title">{selected.title}</h2>
              <p id="preview-description">{selected.description}</p>
              <div className="dialog-media">
                {selected.type === "spreadsheet" ? (
                  <SpreadsheetOverview
                    title={selected.title}
                    excerpt={selected.spreadsheetPreview}
                    isPlaceholder={selected.isPlaceholder}
                    isLinked={hasPublishedDocument(selected)}
                  />
                ) : hasPublishedDocument(selected) &&
                  selected.documentPreview ? (
                  <DocumentOverview
                    title={selected.title}
                    excerpt={selected.documentPreview}
                  />
                ) : hasPublishedDocument(selected) ? (
                  <MediaPlaceholder
                    src={selected.thumbnail}
                    alt={selected.thumbnailAlt}
                    label={artifactLabels[selected.type]}
                    kind={selected.type}
                    linkedDocument
                  />
                ) : selected.isPlaceholder ||
                  (!selected.source && !selected.videoId) ? (
                  <MediaPlaceholder
                    src={selected.thumbnail}
                    alt={selected.thumbnailAlt}
                    label="Artifact not published"
                    kind={selected.type}
                  />
                ) : selected.type === "video" ? (
                  <VideoPreview item={selected} />
                ) : selected.source && selected.type === "image" ? (
                  <div className="dialog-image">
                    <Image
                      src={selected.source}
                      alt={selected.thumbnailAlt || selected.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 800px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <MediaPlaceholder
                    src={selected.thumbnail}
                    alt={selected.thumbnailAlt}
                    label={artifactLabels[selected.type]}
                    kind={selected.type}
                  />
                )}
              </div>
              {selected.isPlaceholder && (
                <p className="preview-note">
                  This is a reserved gallery entry. No artifact has been
                  provided yet.
                </p>
              )}
              <ArtifactLinks item={selected} />
            </div>
          )}
        </dialog>
      </div>
    </div>
  );
}
function getDocumentUrl(item: GalleryItem) {
  return (
    item.documentUrl ??
    (item.type === "document" || item.type === "spreadsheet"
      ? item.source
      : null)
  );
}
function hasPublishedDocument(item: GalleryItem) {
  return (
    !item.isPlaceholder &&
    (item.type === "document" || item.type === "spreadsheet") &&
    Boolean(getDocumentUrl(item))
  );
}
function ArtifactLinks({ item }: { item: GalleryItem }) {
  const documentUrl = getDocumentUrl(item);
  const links = [
    { href: item.projectUrl, label: "Open project" },
    { href: item.repositoryUrl, label: "View repository" },
    {
      href: documentUrl,
      label: item.type === "spreadsheet" ? "Open spreadsheet" : "View document",
    },
  ].filter((link) => link.href);
  return (
    <div className="artifact-links">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href!}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          {link.label}
          <Icon name="external" />
        </a>
      ))}
    </div>
  );
}
