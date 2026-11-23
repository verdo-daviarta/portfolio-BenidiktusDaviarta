import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    sectionEntrances: {
      className: string;
      path: string;
      headingId?: string;
      delay: number;
      duration: number;
      properties: string[];
    }[];
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sectionEntrances = [];
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const animation = original.apply(this, args);
      const timing = animation.effect!.getTiming();
      window.sectionEntrances.push({
        className: this.className,
        path: location.pathname,
        headingId: this.matches(".section-heading")
          ? this.querySelector("h2")?.id
          : undefined,
        delay: timing.delay ?? 0,
        duration: Number(timing.duration),
        properties: Object.keys(
          (animation.effect as KeyframeEffect).getKeyframes()[0],
        ),
      });
      return animation;
    };
  });
});

for (const width of [390, 1440]) {
  test(`all homepage sections have visible entrance effects at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/portfolio");
    for (const [selector, property] of [
      ["#stack .section-heading", "clipPath"],
      [".stack-table", "transform"],
      ["#projects > .section-heading", "clipPath"],
      [".project-index", "transform"],
      [".work-gallery > .section-heading", "clipPath"],
      [".landing-gallery-mobile", "transform"],
      [".contact-grid", "transform"],
      [".footer", "opacity"],
    ]) {
      const section = page.locator(selector);
      await section.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          section.evaluate(
            (element, property) =>
              window.sectionEntrances.some(
                (entry) =>
                  entry.className === element.className &&
                  entry.properties.includes(property) &&
                  (!element.matches(".section-heading") ||
                    entry.headingId === element.querySelector("h2")?.id),
              ),
            property,
          ),
        )
        .toBe(true);
    }
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });

  test(`section heading enters as one centered block at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/portfolio");
    const heading = page.locator("#stack .section-heading");
    await heading.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            window.sectionEntrances.filter(
              (entry) => entry.headingId === "stack-heading",
            ).length,
        ),
      )
      .toBeGreaterThan(0);
    const timings = await page.evaluate(() =>
      window.sectionEntrances.filter(
        (entry) => entry.headingId === "stack-heading",
      ),
    );
    for (const timing of timings) {
      expect(timing).toMatchObject({ className: "section-heading", delay: 0 });
      expect(timing.duration).toBeGreaterThan(0);
    }
    expect(new Set(timings.map((timing) => timing.duration)).size).toBe(1);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(heading).toHaveCSS("opacity", "1");
    await expect(heading).toHaveCSS("clip-path", "none");
    await expect(heading).toHaveCSS("transform", "none");
  });

  test(`section entrances play once and keep content readable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/portfolio");
    await expect
      .poll(() =>
        page.evaluate(() =>
          window.sectionEntrances.some((e) => e.className === "hero-grid"),
        ),
      )
      .toBe(true);
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            window.sectionEntrances.filter((e) =>
              e.className.split(" ").includes("contact-grid"),
            ).length,
        ),
      )
      .toBe(1);
    await page.locator("#home").scrollIntoViewIfNeeded();
    await page.locator("#contact").scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () =>
          window.sectionEntrances.filter((e) =>
            e.className.split(" ").includes("contact-grid"),
          ).length,
      ),
    ).toBe(1);
    await expect(page.locator(".contact-grid")).toHaveCSS("transform", "none");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => page.evaluate(() => document.getAnimations().length))
      .toBe(0);
    const count = await page.evaluate(() => window.sectionEntrances.length);
    await page.locator("#stack").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => window.sectionEntrances.length)).toBe(
      count,
    );
  });
}

test("reduced motion skips entrances from the first render", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/portfolio");
  await page
    .getByRole("link", { name: "Review my projects", exact: true })
    .click();
  await page.locator("#contact").scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.sectionEntrances)).toEqual([]);
  await expect(
    page.getByRole("heading", { name: "Work gallery.", exact: true }),
  ).toHaveCSS("clip-path", "none");
});

test("client navigation enables entrances on project details", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/portfolio");
  await page
    .getByRole("button", {
      name: "EMS – Energy Management System",
      exact: true,
    })
    .click();
  await page
    .getByRole("link", { name: "Project overview", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects\/ems-energy-management-system$/);
  await page.locator(".detail-section").last().scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.sectionEntrances.some(
          (e) =>
            e.className === "detail-section" && e.path.includes("/projects/"),
        ),
      ),
    )
    .toBe(true);
});

test("section content remains visible without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(
      `${process.env.QA_BASE_URL ?? "http://127.0.0.1:3100"}/portfolio`,
    );
    await expect(page.locator(".hero-grid")).toHaveCSS("opacity", "1");
    await expect(page.locator("#contact h2")).toBeVisible();
    await expect(page.locator(".section-heading").first()).toHaveCSS(
      "clip-path",
      "none",
    );
  } finally {
    await context.close();
  }
});
