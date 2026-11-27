import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import { gallery } from "../src/data/gallery";
import { portfolioSections } from "../src/data/portfolio-sections";

for (const width of [390, 768, 1440]) {
  test(`portfolio directory and detail pages work at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/portfolio");
    await expect(page.locator(".directory-card")).toHaveCount(4);
    await expect(page.locator(".work-gallery")).toHaveCount(0);
    for (const section of portfolioSections) {
      const card = page.locator(
        `.directory-card[href="/portfolio/${section.slug}"]`,
      );
      await card.click();
      await expect(page).toHaveURL(`/portfolio/${section.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        section.title,
      );
      if (section.slug === "work-gallery") {
        await expect(page.locator(".gallery-item")).toHaveCount(gallery.length);
        await page.getByRole("button", { name: "Source", exact: true }).click();
        await expect(page.locator(".gallery-item")).toHaveCount(
          gallery.filter((item) => item.type === "repository").length,
        );
        await page.locator(".gallery-preview").first().click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.keyboard.press("Escape");
      }
      if (section.slug === "certifications") {
        await expect(
          page.getByText("Certificates have not been added yet.", {
            exact: true,
          }),
        ).toBeVisible();
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      ).toBe(false);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
      await page
        .getByRole("link", { name: "Back to portfolio", exact: true })
        .click();
      await expect(page).toHaveURL("/portfolio#explore");
    }
    await page.goto("/projects/command-center");
    await expect(
      page.getByRole("heading", {
        name: "Work Gallery",
        exact: true,
        level: 2,
      }),
    ).toHaveClass("sidebar-gallery-heading");
  });
}

test("gallery deep links resume after entry and unknown sections return 404", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto("/portfolio/work-gallery");
  await expect(page).toHaveURL(/next=/);
  await page.getByRole("button", { name: "Skip test", exact: true }).click();
  await expect(page).toHaveURL("/portfolio/work-gallery");
  await expect(page.locator(".gallery-item")).toHaveCount(gallery.length);
  const response = await page.goto("/portfolio/unknown-section");
  expect(response?.status()).toBe(404);
});
