import { test, expect } from "./fixtures";

for (const width of [390, 768, 1440]) {
  test(`Work gallery heading matches Quality in context at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/portfolio");
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
    await expect(page.locator(".section-accent")).toHaveCount(0);
    for (const section of await page.locator(".section-heading").all()) {
      await expect(section.getByRole("heading")).toHaveCSS(
        "text-align",
        "center",
      );
      const description = section.locator(".section-description");
      await expect(description).toHaveCSS("text-align", "center");
      const { sectionCenter, descriptionCenter } = await description.evaluate(
        (element) => {
          const parent = element.parentElement!.getBoundingClientRect();
          const paragraph = element.getBoundingClientRect();
          return {
            sectionCenter: parent.x + parent.width / 2,
            descriptionCenter: paragraph.x + paragraph.width / 2,
          };
        },
      );
      expect(descriptionCenter).toBeCloseTo(sectionCenter, 1);
    }
    await expect(heading.locator(".section-description")).toHaveText(
      "Test plans, screenshots, automation, and the work behind a release. Select an artifact to view its preview.",
    );
    for (const [actual, expected, properties] of [
      [heading, reference, ["text-align", "margin-bottom"]],
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
