import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { gallery } from "../src/data/gallery";

const title = "Test Execution Report AI Assistant";
for (const width of [390, 768, 1440]) {
  test(`Web project preview is usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Web", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Web", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".gallery-item")).toHaveCount(
      gallery.filter((item) => item.type === "web").length,
    );
    const trigger = page.getByRole("button", {
      name: `Preview ${title}`,
      exact: true,
    });
    await expect(trigger.locator(".web-overview.compact")).toBeVisible();
    await expect(trigger.locator(".web-overview-kicker")).toHaveCount(0);
    await expect(
      trigger.getByText("Illustrative preview", { exact: true }),
    ).toHaveCount(0);
    expect(
      await trigger.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    await expect(
      trigger.getByText("From requirements to test-ready drafts.", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(trigger.locator("a, button, input, [tabindex]")).toHaveCount(
      0,
    );
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(
      dialog.getByText("Illustrative preview", { exact: true }),
    ).toBeVisible();
    await expect(dialog.locator(".web-coverages > span")).toHaveText([
      "Positive",
      "Negative",
      "Validation",
      "Boundary",
    ]);
    await expect(dialog.locator(".web-feature-list > li")).toHaveCount(4);
    await expect(
      dialog.getByRole("link", { name: "View repository", exact: true }),
    ).toHaveAttribute(
      "href",
      "https://github.com/verdo-daviarta/Test-Execution-Report-AI-Assistant",
    );
    await expect(
      dialog.getByRole("link", { name: "View repository", exact: true }),
    ).toHaveAttribute("rel", "noopener noreferrer");
    await expect(
      dialog.getByRole("link", { name: "Open project", exact: true }),
    ).toHaveCount(0);
    await expect(
      dialog.locator("iframe, .media-empty, .preview-note"),
    ).toHaveCount(0);
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
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    await page.screenshot({ path: `.next/web-preview-${width}.png` });
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });
}
