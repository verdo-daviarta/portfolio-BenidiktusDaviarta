import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../src/data/projects";
import { gallery } from "../src/data/gallery";

for (const width of [390, 768, 1440]) {
  test(`EMS project shows the supplied details with media pending at ${width}px`, async ({
    page,
  }) => {
    const project = projects.find(
      (item) => item.slug === "ems-energy-management-system",
    )!;
    expect(project).toMatchObject({
      title: "EMS – Energy Management System",
      client: "PUSDATIN · Ministry of Defense",
      year: "2026",
      category: "Enterprise platform",
      description:
        "An IoT-based energy management system for monitoring energy usage in buildings.",
      testingScope: [
        "Functional testing",
        "Manual testing",
        "Automated testing",
        "UAT testing",
      ],
      technologies: ["Cypress", "Codex", "Postman", "ERP", "IoT"],
      role: "Software Quality Assurance Lead",
      thumbnail: null,
      liveUrl: null,
      liveUrls: [],
      repositoryUrl: null,
    });
    expect(gallery.filter((item) => item.projectSlug === project.slug)).toEqual(
      [],
    );
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page
      .getByRole("button", { name: project.title, exact: true })
      .click();
    const expanded = page.locator("article.featured-project");
    await expect(expanded.locator(".body-copy")).toHaveText(
      project.description,
    );
    await expect(expanded.locator(".media-empty")).toBeVisible();
    await expect(expanded.locator("img")).toHaveCount(0);
    const overview = expanded.getByRole("link", {
      name: "Project overview",
      exact: true,
    });
    await expect(overview).toHaveAttribute("href", `/projects/${project.slug}`);
    await overview.click();
    await expect(page).toHaveURL(`/projects/${project.slug}`);
    await expect(page).toHaveTitle(/EMS – Energy Management System/);
    await expect(
      page.getByRole("heading", {
        name: `${project.title}.`,
        exact: true,
        level: 1,
      }),
    ).toBeVisible();
    const facts = page.locator(".detail-facts");
    await expect(facts.getByText("2026", { exact: true })).toBeVisible();
    await expect(
      facts.getByText(project.client, { exact: true }),
    ).toBeVisible();
    await expect(
      facts.getByText("Enterprise platform", { exact: true }),
    ).toBeVisible();
    for (const [heading, text] of [
      ["Context", project.description],
      ["Quality scope", project.testingScope.join(" · ")],
      ["Testing approach", project.approach!],
      ["Tools", "Cypress · Codex · Postman · ERP · IoT"],
      ["Outcome", project.outcome!],
    ]) {
      const section = page.locator(".detail-section").filter({
        has: page.getByRole("heading", { name: heading, exact: true }),
      });
      await expect(section.locator("p")).toHaveText(text);
    }
    await expect(
      page.locator(".main-project-preview .media-empty"),
    ).toBeVisible();
    await expect(
      page.locator(".work-gallery-sidebar .empty-gallery"),
    ).toHaveText(
      "No shareable artifacts have been published for this project yet.",
    );
    await expect(
      page.locator(".work-gallery-sidebar .gallery-item"),
    ).toHaveCount(0);
    await expect(page.locator(".project-live-links")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Repository", exact: true }),
    ).toHaveCount(0);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  });
}
