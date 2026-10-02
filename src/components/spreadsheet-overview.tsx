import type { SpreadsheetExcerpt } from "@/data/gallery";
import { Icon } from "./icons";

export function SpreadsheetOverview({
  title,
  excerpt,
  compact = false,
}: {
  title: string;
  excerpt: SpreadsheetExcerpt;
  compact?: boolean;
}) {
  const columns = compact ? excerpt.columns.slice(0, 2) : excerpt.columns;
  const rows = compact ? excerpt.rows.slice(0, 3) : excerpt.rows;
  return (
    <div
      className={`media-preview document-overview spreadsheet-overview${compact ? " compact" : ""}`}
    >
      <div className="document-toolbar">
        <span className="document-file-icon">
          <Icon name="grid" width={20} height={20} />
        </span>
        <span className="document-file-name">{title}</span>
        <span className="document-provider">Google Sheets</span>
      </div>
      <div className="document-sheet" lang="id">
        <p className="document-sheet-heading">{excerpt.heading}</p>
        <p className="spreadsheet-tab-name">{excerpt.sheetName}</p>
        <div
          className="spreadsheet-table-viewport"
          role={compact ? undefined : "region"}
          aria-label={compact ? undefined : "Test case table excerpt"}
          tabIndex={compact ? undefined : 0}
        >
          <table>
            <caption className="sr-only">
              {excerpt.sheetName} — test case excerpt
            </caption>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th scope="col" key={column}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]}>
                  {columns.map((column, index) => (
                    <td key={column}>
                      <span>{row[index]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="document-excerpt-note">
        Content excerpt
        {!compact &&
          " · Open the spreadsheet for all test cases and scenarios."}
      </p>
    </div>
  );
}
