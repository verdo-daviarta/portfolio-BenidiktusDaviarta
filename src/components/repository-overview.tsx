import type { RepositoryExcerpt } from "@/data/gallery";
import { Icon } from "./icons";

export function RepositoryOverview({
  preview,
  compact = false,
}: {
  preview: RepositoryExcerpt;
  compact?: boolean;
}) {
  const files = compact ? preview.files.slice(0, 3) : preview.files;
  return (
    <div
      className={`media-preview repository-overview${compact ? " compact" : ""}`}
    >
      <div className="repository-chrome">
        <span className="repository-window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>Source code</span>
        <span className="repository-provider">GitHub</span>
      </div>
      <div className="repository-identity">
        <p className="repository-owner">
          {preview.owner} / {preview.name}
        </p>
        <p className="repository-title">{preview.heading}</p>
      </div>
      <ul className="repository-frameworks" aria-label="Automation frameworks">
        {preview.frameworks.map((framework) => (
          <li key={framework}>{framework}</li>
        ))}
      </ul>
      <div className="repository-editor">
        <div className="repository-tree">
          {!compact && (
            <p className="repository-panel-label">Project structure</p>
          )}
          <ul aria-label="Reviewed repository structure">
            {files.map((file) => (
              <li key={file}>
                <Icon name="file" width={13} height={13} />
                <span>{file}</span>
              </li>
            ))}
          </ul>
        </div>
        {!compact && (
          <div className="repository-code-panel">
            <p className="repository-file-path">{preview.snippet.path}</p>
            <div
              className="repository-code-viewport"
              role="region"
              aria-label="Repository code excerpt"
              tabIndex={0}
            >
              <pre>
                <code>
                  {preview.snippet.lines.map((line, index) => (
                    <span className="repository-code-line" key={index}>
                      <span
                        className="repository-line-number"
                        aria-hidden="true"
                      >
                        {preview.snippet.startLine + index}
                      </span>
                      <span>
                        {line
                          .split(/('[^']*'|\b(?:cy|dashboardPage)\b)/g)
                          .map((token, tokenIndex) => (
                            <span
                              key={tokenIndex}
                              className={
                                token.startsWith("'")
                                  ? "repository-token-string"
                                  : /^(cy|dashboardPage)$/.test(token)
                                    ? "repository-token-object"
                                    : undefined
                              }
                            >
                              {token}
                            </span>
                          ))}
                      </span>
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
      <div className="repository-footnote">
        <span className="repository-language">{preview.language}</span>
        <span className="repository-branch">
          {compact ? preview.branch : `Branch / ${preview.branch}`}
        </span>
      </div>
      {!compact && (
        <p className="repository-disclaimer">
          Reviewed source excerpt · Not an execution result
        </p>
      )}
    </div>
  );
}
