import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

function luminance(rgb: number[]) {
  return rgb.reduce((sum, channel, index) => {
    const value = channel / 255;
    const linear =
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    return sum + linear * [0.2126, 0.7152, 0.0722][index];
  }, 0);
}

for (const width of [390, 1440]) {
  test(`entry page centers its spotlight button and opens the portfolio at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    const entry = page.getByRole("link", { name: "Let's Test!", exact: true });
    await expect(entry).toBeVisible();
    await expect(entry).toHaveAttribute("href", "/portfolio");
    await expect(
      page.locator("#hero-title, .site-header, .footer"),
    ).toHaveCount(0);
    const bounds = (await entry.boundingBox())!;
    expect(bounds.x + bounds.width / 2).toBeCloseTo(width / 2, 0);
    expect(bounds.y + bounds.height / 2).toBeCloseTo(450, 0);
    const background = await page
      .locator("body")
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    // Axe reports the unblended label; check its composited colors below.
    const violations = audit.violations.flatMap((issue) => {
      if (issue.id !== "color-contrast") return [issue];
      const nodes = issue.nodes.filter(
        (node) => !node.target.includes(".spotlight-label"),
      );
      return nodes.length ? [{ ...issue, nodes }] : [];
    });
    expect(violations).toEqual([]);
    const colors = await entry.evaluate((element) => {
      const label = getComputedStyle(
        element.querySelector(".spotlight-label")!,
      );
      return {
        blendMode: label.mixBlendMode,
        text: label.color,
        surfaces: [
          getComputedStyle(element).backgroundColor,
          getComputedStyle(element.querySelector(".spotlight-circle")!)
            .backgroundColor,
        ],
      };
    });
    expect(colors.blendMode).toBe("difference");
    const text = colors.text.match(/\d+/g)!.map(Number);
    for (const surface of colors.surfaces) {
      const rgb = surface.match(/\d+/g)!.map(Number);
      expect(rgb).toHaveLength(3);
      const blended = rgb.map((channel, index) =>
        Math.abs(channel - text[index]),
      );
      const light = Math.max(luminance(blended), luminance(rgb));
      const dark = Math.min(luminance(blended), luminance(rgb));
      expect((light + 0.05) / (dark + 0.05)).toBeGreaterThanOrEqual(4.5);
    }
    await entry.click();
    await expect(page).toHaveURL("/portfolio");
    await expect(page.locator("#hero-title")).toBeVisible();
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      background,
    );
    await page
      .getByRole("button", {
        name: "EMS – Energy Management System",
        exact: true,
      })
      .click();
    await page
      .getByRole("link", { name: "Project overview", exact: true })
      .click();
    await page.getByRole("link", { name: /All selected work/ }).click();
    await expect(page).toHaveURL("/portfolio#projects");
    await expect(
      page.getByRole("link", { name: "Let's Test!", exact: true }),
    ).toHaveCount(0);
    await page.goto("/");
    await expect(entry).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("spotlight follows the pointer, resets, and honors reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const entry = page.getByRole("link", { name: "Let's Test!", exact: true });
  const circle = entry.locator(".spotlight-circle");
  const bounds = (await entry.boundingBox())!;
  const centeredLeft = `${(await entry.evaluate((element) => element.clientWidth)) / 2}px`;
  await page.mouse.move(bounds.x + 30, bounds.y + bounds.height / 2);
  await expect
    .poll(async () => {
      const light = (await circle.boundingBox())!;
      return Math.abs(light.x + light.width / 2 - (bounds.x + 30));
    })
    .toBeLessThan(2);
  await page.mouse.move(0, 0);
  await expect(circle).toHaveCSS("left", centeredLeft);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await entry.hover({ position: { x: 30, y: bounds.height / 2 } });
  await expect(circle).toHaveCSS("left", centeredLeft);
  await expect(circle).toHaveCSS("transition-duration", "0s");
  await entry.focus();
  await expect(entry).toHaveCSS("outline-style", "solid");
  await entry.press("Enter");
  await expect(page).toHaveURL("/portfolio");
  await expect(page.locator("#hero-title")).toHaveCSS("clip-path", "none");
});

test("entry link works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${process.env.QA_BASE_URL ?? "http://127.0.0.1:3100"}/`);
    await page.getByRole("link", { name: "Let's Test!", exact: true }).click();
    await expect(page).toHaveURL(/\/portfolio$/);
    await expect(page.locator("#hero-title")).toBeVisible();
  } finally {
    await context.close();
  }
});
