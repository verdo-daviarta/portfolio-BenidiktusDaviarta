import { test, expect } from "@playwright/test";

for (const width of [390, 768, 1440]) {
  test(`Work gallery heading matches Quality in context at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const referenceTitle = page.getByRole("heading", {
      name: "Quality in context.",
      level: 2,
      exact: true,
    });
    const galleryTitle = page.getByRole("heading", {
      name: "Work gallery.",
      level: 2,
      exact: true,
    });
    await expect(galleryTitle).toHaveCount(1);
    const reference = page
      .locator(".section-heading")
      .filter({ has: referenceTitle });
    const heading = page.locator(".work-gallery > .section-heading");
    await expect(heading).toHaveCount(1);
    await expect(
      heading.getByText("The working record", { exact: true }),
    ).toBeVisible();
    await expect(heading.locator(".section-description")).toHaveText(
      "Test plans, screenshots, automation, and the work behind a release. Select an artifact to view its preview.",
    );
    for (const [actual, expected, properties] of [
      [
        heading,
        reference,
        ["display", "grid-template-columns", "gap", "margin-bottom"],
      ],
      [
        galleryTitle,
        referenceTitle,
        ["font-size", "font-weight", "letter-spacing", "line-height", "color"],
      ],
      [
        heading.locator(".section-description"),
        reference.locator(".section-description"),
        ["font-size", "line-height", "max-width", "margin-top", "color"],
      ],
    ] as const) {
      for (const property of properties) {
        const referenceValue = await expected.evaluate(
          (element, name) => getComputedStyle(element).getPropertyValue(name),
          property,
        );
        await expect(actual).toHaveCSS(property, referenceValue);
      }
    }
    expect((await galleryTitle.boundingBox())!.x).toBeCloseTo(
      (await referenceTitle.boundingBox())!.x,
      1,
    );
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);

    // The compact project-overview sidebar must retain its existing heading.
    await page.goto("/projects/command-center");
    await expect(
      page.getByRole("heading", {
        name: "Work Gallery",
        exact: true,
        level: 2,
      }),
    ).toHaveClass("sidebar-gallery-heading");
    await expect(page.locator(".work-gallery > .section-heading")).toHaveCount(
      0,
    );
  });
}
