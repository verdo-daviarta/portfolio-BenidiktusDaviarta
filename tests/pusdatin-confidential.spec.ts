import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { gallery } from "../src/data/gallery";
import { projects } from "../src/data/projects";

test("PUSDATIN displays only illustrated confidentiality notices, not project evidence", async ({
  page,
  request,
}) => {
  const project = projects.find((item) => item.slug === "pusdatin")!;
  const notices = gallery.filter((item) => item.projectSlug === project.slug);
  expect(notices).toHaveLength(2);
  expect(project.thumbnail).toBe("/projects/pusdatin/confidential-cover.svg");
  expect(project.liveUrl).toBeNull();
  expect(project.liveUrls).toEqual([]);
  expect(project.repositoryUrl).toBeNull();
  for (const item of notices) {
    expect(item.description).toMatch(/Illustrated/);
    expect(item.documentUrl).toBeNull();
    expect(item.repositoryUrl).toBeNull();
    expect(item.projectUrl).toBeNull();
    const response = await request.get(item.source!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
    const svg = await response.text();
    expect(svg).not.toMatch(
      /PUSDATIN\s*\/\s*PRIVATE WORK|NOT A PROJECT SCREENSHOT|ILLUSTRATED PRIVACY NOTICE|NOT PROJECT DATA/,
    );
    if (item.id === "pusdatin-confidential-cover") {
      expect(svg).not.toContain("rotate(-4 1055 102)");
      expect(svg).toContain(">ILLUSTRATION ONLY</text>");
    }
    expect(svg).not.toMatch(
      /<script|<foreignObject|href=|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i,
    );
  }
  await page.goto("/projects/pusdatin");
  await expect(page.locator(".work-gallery-sidebar .gallery-item")).toHaveCount(
    1,
  );
  await expect(page.locator(".project-live-links")).toHaveCount(0);
  await expect(
    page.locator(".work-gallery-sidebar .artifact-links a"),
  ).toHaveCount(0);
  await expect(
    page.getByText(
      "No shareable artifacts have been published for this project yet.",
    ),
  ).toHaveCount(0);
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    for (const item of notices) {
      const trigger = page.getByRole("button", {
        name: `Preview ${item.title}`,
        exact: true,
      });
      await trigger.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          trigger
            .locator("img")
            .evaluate(
              (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
            ),
        )
        .toBe(true);
      await trigger.click();
      const dialog = page.getByRole("dialog");
      const image = dialog.getByRole("img", {
        name: item.thumbnailAlt,
        exact: true,
      });
      await expect
        .poll(() =>
          image.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
        )
        .toBe(true);
      await expect(image).toHaveAttribute("src", item.source!);
      await expect(dialog.getByRole("link")).toHaveCount(0);
      await expect(
        dialog.getByText(item.description, { exact: true }),
      ).toBeVisible();
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
    }
  }
  await page.goto("/");
  await page.getByRole("button", { name: "PUSDATIN", exact: true }).click();
  await expect(page.locator("article.featured-project img")).toHaveAttribute(
    "src",
    project.thumbnail!,
  );
  await page.getByRole("button", { name: "Images", exact: true }).click();
  for (const item of notices) {
    await expect(
      page.getByRole("button", { name: `Preview ${item.title}`, exact: true }),
    ).toHaveCount(1);
  }
});
