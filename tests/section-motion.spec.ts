import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    sectionEntrances: { className: string; path: string }[];
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sectionEntrances = [];
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      window.sectionEntrances.push({
        className: this.className,
        path: location.pathname,
      });
      return original.apply(this, args);
    };
  });
});

for (const width of [390, 1440]) {
  test(`section accent precedes its text at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const heading = page.locator("#stack .section-heading");
    await heading.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        heading.evaluate(
          (element) => element.getAnimations({ subtree: true }).length,
        ),
      )
      .toBe(2);
    const timings = await heading.evaluate((element) =>
      element.getAnimations({ subtree: true }).map((animation) => {
        const effect = animation.effect as KeyframeEffect;
        return {
          accent: (effect.target as Element).classList.contains(
            "section-accent",
          ),
          delay: effect.getTiming().delay,
          duration: effect.getTiming().duration,
        };
      }),
    );
    expect(timings).toEqual(
      expect.arrayContaining([
        { accent: true, delay: 0, duration: 1500 },
        { accent: false, delay: 1500, duration: 1500 },
      ]),
    );
    await expect(heading.locator(".section-accent + div")).toHaveCSS(
      "clip-path",
      "inset(0px 100% 0px 0px)",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(heading.locator(".section-accent")).toHaveCSS(
      "clip-path",
      "none",
    );
    await expect(heading.locator(".section-accent + div")).toHaveCSS(
      "clip-path",
      "none",
    );
  });

  test(`section entrances play once and keep content readable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
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
    await page.evaluate(() =>
      Promise.all(
        document.getAnimations().map((animation) => animation.finished),
      ),
    );
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
  await page.goto("/");
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
  await page.goto("/");
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
    await page.goto(process.env.QA_BASE_URL ?? "http://127.0.0.1:3100");
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
