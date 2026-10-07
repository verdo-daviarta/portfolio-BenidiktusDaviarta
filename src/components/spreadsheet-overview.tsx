import type { SpreadsheetExcerpt } from "@/data/gallery";
import { Icon } from "./icons";

type SpreadsheetOverviewProps = {
  title: string;
  excerpt?: SpreadsheetExcerpt;
  compact?: boolean;
  isPlaceholder?: boolean;
  isLinked?: boolean;
};

export function getSpreadsheetOverviewModel({
  title,
  excerpt,
  compact = false,
  isPlaceholder = false,
}: SpreadsheetOverviewProps) {
  const preview = excerpt ?? {
    heading: title,
    sheetName: "Template structure · Content pending",
    columns: ["Column A", "Column B", "Column C", "Column D"],
    rows: [],
  };
  const allColumns = preview.columns.length
    ? preview.columns
    : ["Column A", "Column B", "Column C", "Column D"];
  const hasContent = !isPlaceholder && preview.rows.length > 0;
  const columns = compact ? allColumns.slice(0, 2) : allColumns;
  const rows = hasContent
    ? compact
      ? preview.rows.slice(0, 3)
      : preview.rows
    : Array.from({ length: 3 }, () => []);
  return { preview, hasContent, columns, rows };
}

export function SpreadsheetOverview(props: SpreadsheetOverviewProps) {
  const { title, compact = false, isLinked = false } = props;
  const { preview, hasContent, columns, rows } =
    getSpreadsheetOverviewModel(props);
  return (
    <div
      className={`media-preview document-overview spreadsheet-overview${compact ? " compact" : ""}`}
    >
      <div className="document-toolbar">
        <span className="document-file-icon">
          <Icon name="grid" width={20} height={20} />
        </span>
        <span className="document-file-name">{title}</span>
        <span className="document-provider">
          {isLinked ? "Google Sheets" : "Spreadsheet"}
        </span>
      </div>
      <div className="document-sheet" lang="id">
        <p className="document-sheet-heading">{preview.heading}</p>
        <p className="spreadsheet-tab-name">{preview.sheetName}</p>
        <div
          className="spreadsheet-table-viewport"
          role={compact ? undefined : "region"}
          aria-label={compact ? undefined : "Spreadsheet table preview"}
          tabIndex={compact ? undefined : 0}
        >
          <table>
            <caption className="sr-only">
              {preview.sheetName} —{" "}
              {hasContent
                ? "spreadsheet excerpt"
                : "template structure, no data supplied"}
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
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, index) => (
                    <td key={column}>
                      {hasContent ? (
                        <span>{row[index] ?? ""}</span>
                      ) : (
                        <>
                          <span
                            className="spreadsheet-empty-cell"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Not supplied</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="document-excerpt-note">
        {hasContent ? "Content excerpt" : "Template preview"}
        {!compact &&
          (isLinked
            ? " · Open the spreadsheet for the full content."
            : " · No spreadsheet has been linked yet.")}
      </p>
    </div>
  );
}
