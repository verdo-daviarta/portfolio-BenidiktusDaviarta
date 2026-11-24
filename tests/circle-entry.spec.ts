import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    circleEntrances: { duration: number; frames: string[] }[];
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.circleEntrances = [];
    if (!document.startViewTransition) return;
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = (options) => {
      const transition = start(options);
      void transition.ready
        .then(() => {
          for (const animation of document.getAnimations()) {
            if (
              !(animation instanceof CSSAnimation) ||
              animation.animationName !== "portfolio-circle-enter"
            )
              continue;
            const effect = animation.effect as KeyframeEffect;
            window.circleEntrances.push({
              duration: Number(effect.getTiming().duration),
              frames: effect
                .getKeyframes()
                .map((frame) => String(frame.clipPath)),
            });
          }
        })
        .catch(() => {});
      return transition;
    };
  });
});

for (const width of [390, 1440]) {
  test(`entry opens the portfolio through a growing circle at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page
      .getByRole("textbox", { name: "Request body" })
      .fill(JSON.stringify({ visitor: "guest", id: "001" }, null, 2));
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("200 OK");
    const entry = page.getByRole("link", {
      name: "Enter portfolio",
      exact: true,
    });
    await entry.focus();
    await entry.press("Enter");
    await expect(page).toHaveURL("/portfolio");
    await expect
      .poll(() => page.evaluate(() => window.circleEntrances.length))
      .toBe(1);
    const [circle] = await page.evaluate(() => window.circleEntrances);
    expect(circle.duration).toBe(900);
    expect(circle.frames[0]).toBe(`circle(24px at ${width / 2}px 450px)`);
    expect(circle.frames[1]).toBe(
      `circle(${Math.max(width, 900) * 0.75}px at ${width / 2}px 450px)`,
    );
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document
              .getAnimations()
              .filter(
                (animation) =>
                  animation instanceof CSSAnimation &&
                  animation.animationName === "portfolio-circle-enter" &&
                  animation.playState === "running",
              ).length,
        ),
      )
      .toBe(0);
    await expect(page.locator("#hero-title")).toHaveCSS("clip-path", "none");
    await expect(page.locator(".hero-name-button")).toBeFocused();
    for (const route of ["/portfolio", "/projects/command-center", "/"]) {
      await page.goto(route);
      await expect
        .poll(() =>
          page
            .locator(".site-shell")
            .evaluate(
              (element) =>
                getComputedStyle(element, "::before").backgroundImage,
            ),
        )
        .toContain("/backgrounds/bg2.webp");
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
    }
    await expect(
      page.getByRole("button", { name: "Send", exact: true }),
    ).toBeVisible();
  });
}

test("reduced motion enters without a circle animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Request body" })
    .fill(JSON.stringify({ visitor: "guest", id: "001" }, null, 2));
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("200 OK");
  await page
    .getByRole("link", { name: "Enter portfolio", exact: true })
    .click();
  await expect(page).toHaveURL("/portfolio");
  await expect(page.locator(".site-shell")).not.toHaveAttribute(
    "data-entry-revealed",
  );
  expect(await page.evaluate(() => window.circleEntrances)).toEqual([]);
  await expect(page.locator("#hero-title")).toHaveCSS("clip-path", "none");
});

test("a browser without View Transitions still opens the portfolio", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, "startViewTransition", {
      value: undefined,
    });
  });
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Request body" })
    .fill(JSON.stringify({ visitor: "guest", id: "001" }, null, 2));
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("200 OK");
  await page
    .getByRole("link", { name: "Enter portfolio", exact: true })
    .click();
  await expect(page).toHaveURL("/portfolio");
  await expect(page.locator("#hero-title")).toBeVisible();
  await expect(page.locator("#hero-title")).toHaveCSS("clip-path", "none");
});
