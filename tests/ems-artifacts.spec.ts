import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import { gallery } from "../src/data/gallery";

const sheetUrl =
  "https://docs.google.com/spreadsheets/d/1BDZLZis_2wGaVi9Oiv-3FqI33elyFFtfi3bME7K76qs/edit?gid=811114103#gid=811114103&range=A2";
const repositoryUrl = "https://github.com/verdo-daviarta/ems-automation-2026";

for (const width of [390, 768, 1440]) {
  test(`EMS scenarios use the standard sheet overview at ${width}px`, async ({
    page,
  }) => {
    const item = gallery.find(
      (artifact) => artifact.id === "ems-test-scenarios",
    )!;
    expect(item.projectSlug).toBe("ems-energy-management-system");
    expect(item.documentUrl).toBe(sheetUrl);
    expect(item.spreadsheetPreview!.rows.map((row) => row[0])).toEqual([
      "TS-001",
      "TS-009",
      "TS-017",
      "TS-025",
    ]);
    expect(item.spreadsheetPreview!.columns).toEqual([
      "Test ID",
      "Scenario",
      "Layer",
      "Priority",
    ]);
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/portfolio",
      "/projects/ems-energy-management-system",
    ]) {
      await page.goto(route);
      if (route === "/portfolio")
        await page
          .getByRole("button", { name: "Spreadsheets", exact: true })
          .click();
      const trigger = page.getByRole("button", {
        name: `Preview ${item.title}`,
        exact: true,
      });
      const card = trigger.locator(".spreadsheet-overview");
      await trigger.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
      await expect(
        card.getByText("Google Sheets", { exact: true }),
      ).toHaveCount(0);
      await expect(card.getByRole("columnheader")).toHaveCount(2);
      await expect(card.getByText("TS-001", { exact: true })).toBeVisible();
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(
        dialog.getByText("Google Sheets", { exact: true }),
      ).toHaveCount(0);
      await expect(dialog.getByRole("columnheader")).toHaveText(
        item.spreadsheetPreview!.columns,
      );
      await expect(dialog.getByText("TS-025", { exact: true })).toBeVisible();
      const link = dialog.getByRole("link", {
        name: "Open spreadsheet",
        exact: true,
      });
      await expect(link).toHaveAttribute("href", sheetUrl);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(dialog.locator("iframe")).toHaveCount(0);
      expect(
        await dialog.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
    }
  });

  test(`EMS source has an editor-style preview and safe repository link at ${width}px`, async ({
    page,
  }) => {
    const item = gallery.find(
      (artifact) => artifact.id === "automation-source",
    )!;
    expect(item.isPlaceholder).toBe(false);
    expect(item.projectSlug).toBe("ems-energy-management-system");
    expect(item.repositoryUrl).toBe(repositoryUrl);
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/portfolio",
      "/projects/ems-energy-management-system",
    ]) {
      const externalRequests: string[] = [];
      const onRequest = (request: import("@playwright/test").Request) => {
        if (/github\.com|googleapis\.com|docs\.google\.com/.test(request.url()))
          externalRequests.push(request.url());
      };
      page.on("request", onRequest);
      await page.goto(route);
      if (route === "/portfolio")
        await page.getByRole("button", { name: "Source", exact: true }).click();
      const trigger = page.getByRole("button", {
        name: `Preview ${item.title}`,
        exact: true,
      });
      await trigger.scrollIntoViewIfNeeded();
      const card = trigger.locator(".repository-overview.compact");
      await expect(card).toBeVisible();
      await trigger.hover();
      await expect(card).toHaveCSS("background-color", "rgb(28, 48, 40)");
      await expect(
        card.getByText("EMS QA Automation", { exact: true }),
      ).toBeVisible();
      await expect(card.getByText("Cypress", { exact: true })).toBeVisible();
      await expect(card.getByText("Playwright", { exact: true })).toBeVisible();
      await expect(trigger.locator(".media-empty")).toHaveCount(0);
      const { cardBounds, contentBounds } = await card.evaluate((element) => {
        // Sample one layout frame so scrolling cannot move the card between reads.
        const cardBounds = element.getBoundingClientRect().toJSON();
        const contentBounds = [
          ".repository-title",
          ".repository-frameworks",
          ".repository-language",
          ".repository-branch",
        ].map((selector) =>
          element.querySelector(selector)!.getBoundingClientRect().toJSON(),
        );
        return { cardBounds, contentBounds };
      });
      for (const bounds of contentBounds) {
        expect(bounds.y).toBeGreaterThanOrEqual(cardBounds.y);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(
          cardBounds.y + cardBounds.height + 1,
        );
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(
          cardBounds.x + cardBounds.width + 1,
        );
      }
      await expect(trigger.locator("a, button, [tabindex]")).toHaveCount(0);
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog.locator(".repository-overview")).toBeVisible();
      await expect(dialog.locator(".repository-file-path")).toHaveText(
        item.repositoryPreview!.snippet.path,
      );
      await expect(dialog.locator(".repository-code-line")).toHaveCount(7);
      await expect(dialog.locator("code")).toContainText(
        "dashboardPage.waitForEnergySummary();",
      );
      await expect(
        dialog.getByText("Reviewed source excerpt · Not an execution result", {
          exact: true,
        }),
      ).toBeVisible();
      await expect(dialog.locator(".preview-note, iframe")).toHaveCount(0);
      const link = dialog.getByRole("link", {
        name: "View repository",
        exact: true,
      });
      await expect(link).toHaveAttribute("href", repositoryUrl);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      const code = dialog.getByRole("region", {
        name: "Repository code excerpt",
        exact: true,
      });
      await code.focus();
      if (
        await code.evaluate(
          (element) => element.scrollWidth > element.clientWidth,
        )
      ) {
        await page.keyboard.press("ArrowRight");
        await expect
          .poll(() => code.evaluate((element) => element.scrollLeft))
          .toBeGreaterThan(0);
      }
      expect(
        await dialog.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
      expect(externalRequests).toEqual([]);
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
      page.off("request", onRequest);
    }
  });
}
