import { test, expect } from "./fixtures";

for (const width of [390, 768, 1440]) {
  test(`gallery cards keep consistent dimensions across filters at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/portfolio/work-gallery");
    let expectedHeight = 0;
    for (const filter of [
      "All artifacts",
      "Video",
      "Source",
      "Spreadsheets",
      "Documents",
      "Web",
      "Images",
    ]) {
      const button = page.getByRole("button", { name: filter, exact: true });
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.locator(".gallery-card-details > .eyebrow"),
      ).toHaveCount(0);
      await expect(page.locator(".gallery-item").getByRole("link")).toHaveCount(
        0,
      );
      const dimensions = await page
        .locator(".gallery-item")
        .evaluateAll((cards) =>
          cards.map((card) => {
            const box = card.getBoundingClientRect();
            const preview = card.querySelector(".gallery-preview")!;
            const media = preview.querySelector(".compact")!;
            return {
              width: box.width,
              height: box.height,
              previewHeight: preview.getBoundingClientRect().height,
              mediaHeight: media.getBoundingClientRect().height,
              previewWidth: preview.clientWidth,
              previewScrollWidth: preview.scrollWidth,
            };
          }),
        );
      expect(dimensions.length).toBeGreaterThan(0);
      expectedHeight ||= dimensions[0].height;
      for (const dimension of dimensions) {
        expect(Math.abs(dimension.height - expectedHeight)).toBeLessThanOrEqual(
          1,
        );
        expect(
          Math.abs(dimension.width - dimensions[0].width),
        ).toBeLessThanOrEqual(1);
        expect(dimension.previewHeight).toBeCloseTo(200, 2);
        expect(dimension.mediaHeight).toBeCloseTo(200, 2);
        expect(dimension.previewScrollWidth).toBeLessThanOrEqual(
          dimension.previewWidth,
        );
      }
    }
    await page
      .getByRole("button", { name: "All artifacts", exact: true })
      .click();
    if (width === 1440)
      await page
        .locator(".landing-gallery-scrollable")
        .screenshot({ path: `.next/gallery-uniform-${width}.png` });
    await page.goto("/projects/ems-energy-management-system");
    const sidebarHeights = await page
      .locator(".work-gallery-sidebar .gallery-preview")
      .evaluateAll((elements) =>
        elements.map((element) => element.getBoundingClientRect().height),
      );
    expect(sidebarHeights.length).toBeGreaterThan(1);
    for (const height of sidebarHeights) {
      expect(height).toBeCloseTo(200, 2);
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
