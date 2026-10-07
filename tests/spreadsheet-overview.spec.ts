import { test, expect } from "@playwright/test";
import { getSpreadsheetOverviewModel } from "../src/components/spreadsheet-overview";

test("spreadsheet model has a safe fallback without configured content", () => {
  const model = getSpreadsheetOverviewModel({
    title: "Untitled spreadsheet",
    compact: true,
  });
  expect(model.preview.heading).toBe("Untitled spreadsheet");
  expect(model.columns).toEqual(["Column A", "Column B"]);
  expect(model.rows).toEqual([[], [], []]);
  expect(model.hasContent).toBe(false);
});

test("placeholder spreadsheets do not present draft rows as published content", () => {
  const model = getSpreadsheetOverviewModel({
    title: "Draft planning",
    isPlaceholder: true,
    excerpt: {
      heading: "Draft",
      sheetName: "Draft",
      columns: ["Module", "Scenario"],
      rows: [["Internal draft", "Unapproved scenario"]],
    },
  });
  expect(model.columns).toEqual(["Module", "Scenario"]);
  expect(model.hasContent).toBe(false);
  expect(model.rows).toEqual([[], [], []]);
});

test("empty spreadsheet column configuration falls back to a valid table structure", () => {
  const model = getSpreadsheetOverviewModel({
    title: "Empty planning",
    excerpt: {
      heading: "Empty planning",
      sheetName: "Template",
      columns: [],
      rows: [],
    },
  });
  expect(model.columns).toEqual([
    "Column A",
    "Column B",
    "Column C",
    "Column D",
  ]);
  expect(model.hasContent).toBe(false);
});

test("published spreadsheet content keeps its original values with compact limits", () => {
  const excerpt = {
    heading: "Cases",
    sheetName: "Cases",
    columns: ["Code", "Scenario", "Priority"],
    rows: [
      ["1", "First", "High"],
      ["2", "Second", "Low"],
      ["3", "Third", "Low"],
      ["4", "Fourth", "Low"],
    ],
  };
  const full = getSpreadsheetOverviewModel({ title: "Cases", excerpt });
  const compact = getSpreadsheetOverviewModel({
    title: "Cases",
    excerpt,
    compact: true,
  });
  expect(full.hasContent).toBe(true);
  expect(full.columns).toEqual(excerpt.columns);
  expect(full.rows).toEqual(excerpt.rows);
  expect(compact.columns).toEqual(excerpt.columns.slice(0, 2));
  expect(compact.rows).toEqual(excerpt.rows.slice(0, 3));
});
