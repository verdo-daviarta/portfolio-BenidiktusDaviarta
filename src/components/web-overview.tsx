import type { GalleryItem } from "@/data/gallery";

export function WebOverview({
  preview,
  compact = false,
}: {
  preview: NonNullable<GalleryItem["webPreview"]>;
  compact?: boolean;
}) {
  if (preview.variant)
    return <SiteOverview preview={preview} compact={compact} />;
  return (
    <div className={`web-overview${compact ? " compact" : ""}`}>
      <div className="web-overview-intro">
        {!compact && (
          <p className="web-overview-kicker">QA toolkit / Web application</p>
        )}
        <p className="web-overview-title">{preview.heading}</p>
        {!compact && <p className="web-overview-summary">{preview.summary}</p>}
      </div>
      <div className="web-workspace">
        <div className="web-browser-bar">
          <span className="web-browser-dots" aria-hidden="true">
            ● ● ●
          </span>
          <span>Test Execution Report</span>
          <span className="web-ai-mark">AI</span>
        </div>
        <div className="web-workspace-body">
          {!compact && (
            <div className="web-workspace-nav" aria-hidden="true">
              <span className="web-app-mark">
                QA<span> / </span>
              </span>
              <span className="web-nav-selected">New Generation</span>
              <span>Projects</span>
              <span>History</span>
            </div>
          )}
          <div className="web-generation">
            <div className="web-generation-heading">
              <span>New Generation</span>
              {!compact && (
                <span className="web-draft-tag">Draft workspace</span>
              )}
            </div>
            {!compact && (
              <div className="web-requirement">
                <span className="web-field-label">Requirements</span>
                <p>Turn requirements into structured test scenarios.</p>
                <div className="web-text-lines" aria-hidden="true">
                  <i />
                  <i />
                </div>
              </div>
            )}
            <div className="web-coverages" aria-label="Supported test coverage">
              {preview.coverages.map((coverage) => (
                <span key={coverage}>{coverage}</span>
              ))}
            </div>
            {!compact && (
              <div className="web-flow" aria-label="Test design workflow">
                <span>01 / Define</span>
                <span aria-hidden="true">→</span>
                <span>02 / Review</span>
                <span aria-hidden="true">→</span>
                <span>03 / Export</span>
              </div>
            )}
            {!compact && (
              <div className="web-result-preview">
                <span className="web-field-label">
                  Result Editor / Illustrative example
                </span>
                <div>
                  <span>Coverage</span>
                  <span>Scenario</span>
                </div>
                <div>
                  <span>Positive</span>
                  <span>Sign in with valid credentials</span>
                </div>
                <div>
                  <span>Validation</span>
                  <span>Show a required-field message</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {!compact && (
        <ul className="web-feature-list" aria-label="Application features">
          {preview.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}
      {!compact && (
        <div className="web-overview-footer">
          <span>OpenAI / Gemini</span>
          <span>Illustrative preview</span>
        </div>
      )}
    </div>
  );
}

function SiteOverview({
  preview,
  compact,
}: {
  preview: NonNullable<GalleryItem["webPreview"]>;
  compact: boolean;
}) {
  const invitation = preview.variant === "invitation";
  return (
    <div
      className={`web-overview site-overview site-${preview.variant}${compact ? " compact" : ""}`}
    >
      <div className="site-intro">
        {!compact && <p className="web-overview-kicker">{preview.kicker}</p>}
        <p className="site-heading">{preview.heading}</p>
        {!compact && <p className="web-overview-summary">{preview.summary}</p>}
      </div>
      <div className="site-window">
        <div className="site-window-bar">
          <span>{preview.brand}</span>
          <span aria-hidden="true">● ● ●</span>
        </div>
        <div className="site-canvas">
          <div className="site-art" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="site-canvas-copy">
            <span className="site-small-label">
              {invitation
                ? "Together, a new chapter"
                : "Professional convection"}
            </span>
            <p>
              {invitation ? "With love, always." : "Your ideas. Our craft."}
            </p>
            <span className="site-small-label">
              {invitation
                ? "The story / The day / Our moments"
                : "Explore / Discover / Consult"}
            </span>
          </div>
        </div>
      </div>
      {!compact && (
        <ul className="web-feature-list" aria-label="Application features">
          {preview.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}
      {(!compact || preview.repositoryNotice) && (
        <div className="site-preview-note">
          {!compact && <span>Illustrative preview</span>}
          {preview.repositoryNotice && (
            <span>
              {compact ? "Private repository" : preview.repositoryNotice}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
