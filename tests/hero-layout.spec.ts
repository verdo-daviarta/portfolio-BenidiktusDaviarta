import { test, expect } from "@playwright/test";

test("hero supporting text aligns with the description and context stays 14px", async ({
  page,
}) => {
  await page.goto("/portfolio");
  for (const width of [375, 640, 641, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const description = await page
      .locator(".hero-profile .body-copy")
      .boundingBox();
    expect(description).not.toBeNull();
    for (const selector of [".hero-bottom > p", ".professional-context > p"]) {
      const paragraph = page.locator(selector);
      const bounds = await paragraph.boundingBox();
      expect(bounds).not.toBeNull();
      expect(Math.abs(bounds!.x - description!.x)).toBeLessThanOrEqual(1);
    }
    await expect(page.locator(".professional-context > p")).toHaveCSS(
      "font-size",
      "14px",
    );
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
});
