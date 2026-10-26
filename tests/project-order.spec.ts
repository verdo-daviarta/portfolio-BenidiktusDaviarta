import { test, expect } from "@playwright/test";
import {
  projects,
  sortProjectsByYear,
  type Project,
} from "../src/data/projects";

const expectedOrder = [
  "ems-energy-management-system",
  "pusdiklat-bela-negara",
  "pusdiklat-tekfunghan",
  "pusdiklat-bahasa",
  "command-center",
  "pusdatin",
];

test("projects sort by the latest year without mutating the source", () => {
  const originalOrder = projects.map((project) => project.slug);
  const sorted = sortProjectsByYear(projects);
  expect(sorted.map((project) => project.slug)).toEqual(expectedOrder);
  expect(projects.map((project) => project.slug)).toEqual(originalOrder);
  expect(sorted).not.toBe(projects);
});

test("year sorting handles ranges, ties, unknown years, and an empty list", () => {
  const example = (slug: string, year: string | null): Project => ({
    ...projects[0],
    slug,
    year,
  });
  const samples = [
    example("unknown", null),
    example("older", "2023"),
    example("slash", "2023 / 2025"),
    example("en-dash", "2023–2025"),
    example("hyphen", "2023-2025"),
    example("newest", "2026"),
    example("empty", ""),
  ];
  expect(sortProjectsByYear(samples).map((project) => project.slug)).toEqual([
    "newest",
    "slash",
    "en-dash",
    "hyphen",
    "older",
    "unknown",
    "empty",
  ]);
  expect(sortProjectsByYear([])).toEqual([]);
});

for (const width of [390, 768, 1440]) {
  test(`Quality in context lists newest projects first and omits Virtual reality at ${width}px`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const list = page.locator("#projects .project-index");
    const titles = expectedOrder.map(
      (slug) => projects.find((project) => project.slug === slug)!.title,
    );
    await expect(list.locator(".project-row-name")).toHaveText(titles);
    await expect(list.getByRole("button")).toHaveCount(6);
    await expect(
      list.getByRole("button", {
        name: "Virtual reality applications",
        exact: true,
      }),
    ).toHaveCount(0);
    await list.getByRole("button", { name: titles[0], exact: true }).click();
    const overview = list.getByRole("link", {
      name: "Project overview",
      exact: true,
    });
    await expect(overview).toHaveAttribute(
      "href",
      "/projects/ems-energy-management-system",
    );
    await overview.click();
    await expect(page).toHaveURL("/projects/ems-energy-management-system");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    const response = await page.goto("/projects/virtual-reality");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("link", {
        name: "Return to the portfolio →",
        exact: true,
      }),
    ).toBeVisible();
    expect((await request.get("/projects/virtual-reality")).status()).toBe(404);
  });
}
