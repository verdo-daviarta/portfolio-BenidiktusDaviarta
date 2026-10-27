import { test, expect } from "@playwright/test";
import {
  gallery,
  getProjectMedia,
  type ArtifactType,
} from "../src/data/gallery";
import { projects } from "../src/data/projects";

const filters: { label: string; type: ArtifactType | null }[] = [
  { label: "All artifacts", type: null },
  { label: "Video", type: "video" },
  { label: "Source", type: "repository" },
  { label: "Spreadsheets", type: "spreadsheet" },
  { label: "Documents", type: "document" },
  { label: "Web", type: "web" },
  { label: "Images", type: "image" },
];

const orderedArtifacts = filters.flatMap(({ type }) =>
  type ? gallery.filter((item) => item.type === type) : [],
);

for (const width of [390, 768, 1440]) {
  test(`selected gallery filter keeps its green background at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const group = page.getByRole("group", { name: "Filter work artifacts" });
    await expect(page.locator(".gallery-item h4")).toHaveText(
      orderedArtifacts.map((item) => item.title),
    );
    await expect(group.getByRole("button")).toHaveText(
      filters.map((filter) => filter.label),
    );
    const all = group.getByRole("button", {
      name: "All artifacts",
      exact: true,
    });
    await expect(all).toHaveAttribute("aria-pressed", "true");
    await expect(all).toHaveCSS("background-color", "rgb(52, 105, 75)");
    await expect(all).toHaveCSS("color", "rgb(247, 247, 242)");
    for (const filter of filters) {
      const button = group.getByRole("button", {
        name: filter.label,
        exact: true,
      });
      await button.click();
      await expect(group.getByRole("button", { pressed: true })).toHaveCount(1);
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await button.hover();
      await expect(button).toHaveCSS("background-color", "rgb(52, 105, 75)");
      await expect(button).toHaveCSS("color", "rgb(247, 247, 242)");
      await page.mouse.move(0, 0);
      await expect(button).toHaveCSS("background-color", "rgb(52, 105, 75)");
      await expect(button).toHaveCSS("color", "rgb(247, 247, 242)");
      for (const inactive of await group
        .getByRole("button", { pressed: false })
        .all()) {
        await expect(inactive).toHaveCSS(
          "background-color",
          "rgba(0, 0, 0, 0)",
        );
      }
      await expect(page.locator(".gallery-item")).toHaveCount(
        filter.type
          ? gallery.filter((item) => item.type === filter.type).length
          : gallery.length,
      );
      const expectedItems = filter.type
        ? gallery.filter((item) => item.type === filter.type)
        : orderedArtifacts;
      await expect(page.locator(".gallery-item h4")).toHaveText(
        expectedItems.map((item) => item.title),
      );
    }
    const images = group.getByRole("button", { name: "Images", exact: true });
    await images.focus();
    await page.keyboard.press("Enter");
    await expect(images).toHaveAttribute("aria-pressed", "true");
    await expect(images).toHaveCSS("background-color", "rgb(52, 105, 75)");
    await expect(images).toBeFocused();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });
}

test("landing artifact sorting preserves the existing project sidebar order", async ({
  page,
}) => {
  const project = projects.find(
    (item) => item.slug === "pusdiklat-bela-negara",
  )!;
  const hero = getProjectMedia(project);
  const expectedItems = gallery.filter(
    (item) => item.projectSlug === project.slug && item.id !== hero.id,
  );
  await page.goto(`/projects/${project.slug}`);
  const previews = page.locator(".work-gallery-sidebar .gallery-preview");
  await expect(previews).toHaveCount(expectedItems.length);
  expect(
    await previews.evaluateAll((buttons) =>
      buttons.map((button) => button.getAttribute("aria-label")),
    ),
  ).toEqual(expectedItems.map((item) => `Preview ${item.title}`));
});
