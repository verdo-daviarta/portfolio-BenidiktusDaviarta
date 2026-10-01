import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../src/data/projects";
import { profile } from "../src/data/profile";
import { gallery } from "../src/data/gallery";

for (const width of [375, 390, 768, 1024, 1280, 1440]) {
  test(`page and project layouts fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const route of [
      "/",
      ...projects.map(({ slug }) => `/projects/${slug}`),
    ]) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
      await expect(page.locator("h1")).toBeVisible();
      if (route === "/") {
        for (const project of projects) {
          await page
            .getByRole("button", { name: project.title, exact: true })
            .click();
          await expect(page.locator("article.featured-project")).toHaveCount(1);
          expect(
            await page.evaluate(
              () =>
                document.documentElement.scrollWidth <=
                document.documentElement.clientWidth,
            ),
          ).toBe(true);
        }
      }
      if (route !== "/") {
        await expect(page.locator(".project-media-layout")).toHaveCount(1);
        await expect(page.locator(".main-project-preview")).toHaveCount(1);
        await expect(page.locator(".work-gallery-sidebar")).toHaveCount(1);
        await expect(
          page.getByRole("heading", { name: "Work Gallery", exact: true }),
        ).toBeVisible();
        const project = projects.find(
          (item) => route === `/projects/${item.slug}`,
        )!;
        if (!project.thumbnail) {
          await expect(
            page.locator(".main-project-preview .media-empty"),
          ).toBeVisible();
          await expect(
            page.locator(".work-gallery-sidebar .empty-gallery"),
          ).toBeVisible();
          await expect(page.locator(".gallery-grid-scrollable")).toHaveCount(0);
        }
      }
    }
    expect(errors).toEqual([]);
  });
}

test("project rows expand one at a time, collapse, and retain overview navigation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("article.project-row")).toHaveCount(
    projects.length,
  );
  await expect(page.locator("article.featured-project")).toHaveCount(0);
  const first = page.getByRole("button", {
    name: projects[0].title,
    exact: true,
  });
  const second = page.getByRole("button", {
    name: projects[1].title,
    exact: true,
  });
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(first).toBeFocused();
  await expect(page.locator("article.featured-project img")).toBeVisible();
  await expect(page.locator("article.project-row")).toHaveCount(
    projects.length - 1,
  );
  await second.click();
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("article.featured-project")).toHaveCount(1);
  await expect(
    page.locator("article.featured-project .media-empty"),
  ).toBeVisible();
  await page.keyboard.press("Space");
  await expect(second).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("article.featured-project")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await first.click();
  expect(
    await page
      .locator(".featured-project-body")
      .evaluate((element) =>
        parseFloat(getComputedStyle(element).animationDuration),
      ),
  ).toBeLessThan(0.01);
  await page
    .getByRole("link", { name: "Project overview", exact: true })
    .click();
  await expect(page).toHaveURL(`/projects/${projects[0].slug}`);
});

test("gallery filters, keyboard preview, focus trap, and return focus", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".gallery-item")).toHaveCount(gallery.length);
  await page.getByRole("button", { name: "Spreadsheets", exact: true }).click();
  await expect(page.locator(".gallery-item")).toHaveCount(1);
  const trigger = page.getByRole("button", {
    name: "Preview Test planning",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close preview" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  expect(
    await dialog.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page
    .getByRole("button", { name: "All artifacts", exact: true })
    .click();
  await expect(page.locator(".gallery-item")).toHaveCount(gallery.length);
  for (const name of [
    "Preview Automation demo",
    "Preview QA documentation",
    "Preview Work screenshot",
    "Preview Web project",
    "Preview Automation source",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByText(
        "This is a reserved gallery entry. No artifact has been provided yet.",
      ),
    ).toBeVisible();
    await page.getByRole("button", { name: "Close preview" }).click();
    await expect(dialog).not.toBeVisible();
  }
});

test("Command Center screenshots load and open complete image previews", async ({
  page,
  request,
}) => {
  const screenshots = gallery.filter(
    (item) => item.projectSlug === "command-center" && item.type === "image",
  );
  await page.goto("/projects/command-center");
  await expect(page.locator(".work-gallery-sidebar .gallery-item")).toHaveCount(
    4,
  );
  await expect(
    page.getByRole("link", { name: "Related project", exact: true }),
  ).toHaveCount(0);
  const mainBounds = await page.locator(".main-project-preview").boundingBox();
  const sidebarBounds = await page
    .locator(".work-gallery-sidebar")
    .boundingBox();
  expect(sidebarBounds!.x).toBeGreaterThan(mainBounds!.x + mainBounds!.width);
  for (const item of screenshots) {
    expect((await request.get(item.source!)).status()).toBe(200);
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
    const preview = dialog.getByRole("img", { name: item.thumbnailAlt });
    await expect
      .poll(() =>
        preview.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    expect(
      await preview.evaluate((img) => getComputedStyle(img).objectFit),
    ).toBe("contain");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test("sidebar gallery scrolls independently while the main image and heading stay fixed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/command-center");
  await page
    .locator(".project-media-layout")
    .evaluate((element) =>
      window.scrollTo(
        0,
        window.scrollY + element.getBoundingClientRect().top - 110,
      ),
    );
  const scroller = page.getByRole("region", {
    name: "Work Gallery screenshots",
  });
  const before = await page.evaluate(() => ({
    pageY: window.scrollY,
    mainTop: document
      .querySelector(".main-project-preview")!
      .getBoundingClientRect().top,
    headingTop: document
      .querySelector(".sidebar-gallery-heading")!
      .getBoundingClientRect().top,
  }));
  await scroller.hover();
  await page.mouse.wheel(0, 600);
  await expect
    .poll(() => scroller.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  expect(
    await page.evaluate(() => ({
      pageY: window.scrollY,
      mainTop: document
        .querySelector(".main-project-preview")!
        .getBoundingClientRect().top,
      headingTop: document
        .querySelector(".sidebar-gallery-heading")!
        .getBoundingClientRect().top,
    })),
  ).toEqual(before);
  expect(
    await page
      .getByRole("heading", { name: "Work Gallery", exact: true })
      .evaluate((element) => getComputedStyle(element).fontWeight),
  ).toBe("700");
  await scroller.focus();
  await page.keyboard.press("Home");
  await expect
    .poll(() => scroller.evaluate((element) => element.scrollTop))
    .toBe(0);
  await page.keyboard.press("End");
  await expect
    .poll(() => scroller.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
});

test("navigation, supplied contact links, clipboard, and reduced motion", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  for (const label of ["Stack", "Projects", "Contact", "Home"]) {
    await nav.getByRole("link", { name: label }).click();
    await expect(nav.getByRole("link", { name: label })).toHaveAttribute(
      "aria-current",
      "location",
    );
  }
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await expect(page.locator(`a[href="mailto:${profile.email}"]`)).toHaveCount(
    1,
  );
  await expect(page.locator(`a[href="${profile.linkedin}"]`)).toHaveAttribute(
    "rel",
    "noopener noreferrer",
  );
  await expect(page.locator(`a[href="${profile.github}"]`)).toHaveAttribute(
    "target",
    "_blank",
  );
  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Email copied" }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    profile.email,
  );
});

for (const width of [390, 1440]) {
  test(`WCAG AA audit at ${width}px, including open preview`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/projects/command-center"]) {
      await page.goto(route);
      if (route === "/") {
        await page
          .getByRole("button", { name: projects[0].title, exact: true })
          .click();
        await page
          .locator(".featured-project-body")
          .evaluate((element) =>
            Promise.all(
              element.getAnimations().map((animation) => animation.finished),
            ),
          );
      }
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(result.violations).toEqual([]);
    }
    await page.goto("/");
    await page
      .getByRole("button", { name: "Preview Test planning", exact: true })
      .click();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}

test("missing routes return a usable 404, metadata endpoints respond", async ({
  page,
  request,
}) => {
  const response = await page.goto("/projects/not-a-project");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "This page isn’tin the test plan.",
  );
  await page.getByRole("link", { name: "Return to the portfolio" }).click();
  await expect(page).toHaveTitle(
    /Benidiktus Daviarta — Software Quality Assurance Lead/,
  );
  for (const path of ["/robots.txt", "/sitemap.xml", "/icon.svg"])
    expect((await request.get(path)).status()).toBe(200);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    /Benidiktus Daviarta/,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /QA Automation/,
  );
});
