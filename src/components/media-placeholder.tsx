import Image from "next/image";
import { Icon } from "./icons";

export function MediaPlaceholder({
  src,
  alt,
  label,
  kind = "image",
  compact = false,
  fit = "cover",
  loading = "lazy",
  linkedDocument = false,
}: {
  src?: string | null;
  alt: string;
  label: string;
  kind?: "image" | "video" | "document" | "spreadsheet" | "web" | "repository";
  compact?: boolean;
  fit?: "cover" | "contain";
  loading?: "eager" | "lazy";
  linkedDocument?: boolean;
}) {
  if (src)
    return (
      <div className={`media-preview ${compact ? "compact" : ""}`}>
        <Image
          src={src}
          alt={alt}
          fill
          loading={loading}
          sizes={
            compact
              ? "(max-width: 640px) 100vw, 33vw"
              : "(max-width: 768px) 100vw, 60vw"
          }
          style={{ objectFit: fit }}
        />
      </div>
    );
  const icon =
    kind === "video"
      ? "play"
      : kind === "spreadsheet"
        ? "grid"
        : kind === "web" || kind === "repository"
          ? "code"
          : kind === "document"
            ? "file"
            : "image";
  return (
    <div className={`media-preview media-empty ${compact ? "compact" : ""}`}>
      <div className="media-caption">
        <span className="eyebrow">{label}</span>
        <span className="eyebrow">
          {linkedDocument ? "Document linked" : "Media pending"}
        </span>
      </div>
      <div className="media-empty-center">
        <Icon name={icon} width={32} height={32} />
        <span>
          {linkedDocument
            ? "View document"
            : kind === "video"
              ? "Demo to be added"
              : "Preview to be added"}
        </span>
      </div>
      <span className="media-footnote eyebrow">
        {linkedDocument
          ? "Read the full document in a new tab"
          : "Reserved for approved, shareable work"}
      </span>
    </div>
  );
}
