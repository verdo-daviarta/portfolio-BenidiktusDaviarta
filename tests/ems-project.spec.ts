import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../src/data/projects";
import { gallery } from "../src/data/gallery";

for (const width of [390, 768, 1440]) {
  test(`EMS project shows its details and all seven screenshots at ${width}px`, async ({
    page,
    request,
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
      thumbnail: "/projects/ems/EMS 2.jpg",
      liveUrl: null,
      liveUrls: [],
      repositoryUrl: null,
    });
    const screenshots = gallery.filter(
      (item) => item.projectSlug === project.slug && item.type === "image",
    );
    expect(screenshots).toHaveLength(7);
    expect(
      screenshots.every((item) => item.type === "image" && !item.isPlaceholder),
    ).toBe(true);
    expect(new Set(screenshots.map((item) => item.source)).size).toBe(7);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/portfolio");
    await page
      .getByRole("button", { name: project.title, exact: true })
      .click();
    const expanded = page.locator("article.featured-project");
    await expect(expanded.locator(".body-copy")).toHaveText(
      project.description,
    );
    await expect(expanded.locator(".media-empty")).toHaveCount(0);
    await expect(
      expanded.getByRole("img", { name: project.thumbnailAlt, exact: true }),
    ).toBeVisible();
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
    ).toHaveCount(0);
    const hero = page.locator(".main-project-preview");
    await expect(
      hero.getByRole("img", { name: project.thumbnailAlt, exact: true }),
    ).toBeVisible();
    expect(
      new URL(
        (await hero.locator("img").getAttribute("src"))!,
        page.url(),
      ).searchParams.get("url"),
    ).toBe(project.thumbnail);
    await expect(
      page.locator(".work-gallery-sidebar .empty-gallery"),
    ).toHaveCount(0);
    await expect(
      page.locator(".work-gallery-sidebar .gallery-item"),
    ).toHaveCount(
      gallery.filter((item) => item.projectSlug === project.slug).length - 1,
    );
    await expect(
      page
        .locator(".work-gallery-sidebar")
        .getByRole("button", { name: "Preview EMS · Dashboard", exact: true }),
    ).toHaveCount(0);
    const scroller = page.getByRole("region", {
      name: "Work Gallery screenshots",
      exact: true,
    });
    expect(
      await scroller.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    ).toBe(true);
    for (const item of screenshots) {
      const response = await request.get(item.source!);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("image/jpeg");
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
      const preview = dialog.getByRole("img", {
        name: item.thumbnailAlt,
        exact: true,
      });
      await expect
        .poll(() =>
          preview.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
        )
        .toBe(true);
      expect(
        new URL(
          (await preview.getAttribute("src"))!,
          page.url(),
        ).searchParams.get("url"),
      ).toBe(item.source);
      expect(
        await preview.evaluate((img) => getComputedStyle(img).objectFit),
      ).toBe("contain");
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    }
    await scroller.focus();
    await page.keyboard.press("End");
    await expect
      .poll(() => scroller.evaluate((element) => element.scrollTop))
      .toBeGreaterThan(0);
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
    await page.goto("/portfolio");
    await page.getByRole("button", { name: "Images", exact: true }).click();
    for (const item of screenshots) {
      await expect(
        page.getByRole("button", {
          name: `Preview ${item.title}`,
          exact: true,
        }),
      ).toHaveCount(1);
    }
  });
}
