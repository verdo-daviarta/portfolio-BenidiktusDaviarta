import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { techStack } from "../src/data/tech-stack";

for (const width of [390, 768, 1440]) {
  test(`tools show hover information without click actions at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const section = page.locator("#stack");
    const tools = techStack.flatMap((category) => category.tools);
    await expect(section.locator(".tool")).toHaveCount(tools.length);
    await expect(
      section.locator("a, button, [role=button], [role=link]"),
    ).toHaveCount(0);
    const initialUrl = page.url();
    const initialPages = page.context().pages().length;
    for (const tool of tools) {
      const item = section.getByRole("listitem").filter({
        has: page.locator(".tool-name").getByText(tool.name, { exact: true }),
      });
      const tooltip = item.getByRole("tooltip", { includeHidden: true });
      await item.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      await expect(tooltip).toBeHidden();
      await expect(item).toHaveAccessibleDescription(tool.description);
      await expect(item).toHaveCSS("cursor", "default");
      await expect(item).toHaveAttribute(
        "aria-describedby",
        (await tooltip.getAttribute("id"))!,
      );
      await item.hover();
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toHaveText(tool.description);
      const bounds = await tooltip.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      await item.click();
      await page.mouse.move(0, 0);
      // Mouse focus must not leave the description latched open.
      await expect(tooltip).toBeHidden();
      expect(page.url()).toBe(initialUrl);
      expect(page.context().pages()).toHaveLength(initialPages);
      await expect(page.getByRole("dialog")).not.toBeVisible();
    }
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });
}

test("tool descriptions remain available through keyboard focus without activation", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("#stack");
  const playwright = section.getByRole("listitem").filter({
    has: page.getByText("Playwright", { exact: true }),
  });
  const cypress = section.getByRole("listitem").filter({
    has: page.getByText("Cypress", { exact: true }),
  });
  await playwright.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await playwright.focus();
  await expect(playwright.getByRole("tooltip")).toBeVisible();
  const initialUrl = page.url();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  expect(page.url()).toBe(initialUrl);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.keyboard.press("Tab");
  await expect(cypress).toBeFocused();
  await expect(
    playwright.getByRole("tooltip", { includeHidden: true }),
  ).toBeHidden();
  await expect(cypress.getByRole("tooltip")).toBeVisible();
  const audit = await new AxeBuilder({ page })
    .include("#stack")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
});
