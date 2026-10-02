import type { DocumentExcerpt } from "@/data/gallery";
import { Icon } from "./icons";

export function DocumentOverview({
  title,
  excerpt,
  compact = false,
}: {
  title: string;
  excerpt: DocumentExcerpt;
  compact?: boolean;
}) {
  const sections = compact ? excerpt.sections.slice(0, 1) : excerpt.sections;
  return (
    <div
      className={`media-preview document-overview${compact ? " compact" : ""}`}
    >
      <div className="document-toolbar">
        <span className="document-file-icon">
          <Icon name="file" width={20} height={20} />
        </span>
        <span className="document-file-name">{title}</span>
        <span className="document-provider">Google Docs</span>
      </div>
      <div className="document-sheet" lang="id">
        <p className="document-sheet-heading">{excerpt.heading}</p>
        {sections.map((section) => (
          <div className="document-section" key={section.heading}>
            <p className="document-section-heading">{section.heading}</p>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="document-excerpt-note">
        Content excerpt
        {!compact && " · Open the document for the full issue report."}
      </p>
    </div>
  );
}
