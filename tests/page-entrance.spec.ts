import { test, expect } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { openingSeen: boolean }).openingSeen = false;
    new MutationObserver(() => {
      const title = document.getElementById("hero-title");
      if (title?.style.clipPath && title.style.clipPath !== "none") {
        (window as unknown as { openingSeen: boolean }).openingSeen = true;
      }
    }).observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });
  });
});

for (const width of [390, 1440]) {
  test(`first homepage entrance completes without shifting layout at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/portfolio");
    await expect
      .poll(() =>
        page.evaluate(
          () => (window as unknown as { openingSeen: boolean }).openingSeen,
        ),
      )
      .toBe(true);
    await expect(page.locator("#hero-title")).toHaveCSS("opacity", "1");
    await expect(page.locator("#hero-title")).toHaveCSS("transform", "none");
    await expect(page.locator("#hero-title")).toHaveCSS("clip-path", "none");
    await expect
      .poll(() =>
        page
          .locator("#hero-title")
          .evaluate((el) => (el as HTMLElement).style.opacity),
      )
      .toBe("");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });
}

test("direct home anchor plays the opening", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/portfolio#home");
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { openingSeen: boolean }).openingSeen,
      ),
    )
    .toBe(true);
  await expect(page.locator("#hero-title")).toHaveCSS("transform", "none");
});

test("entry view transition avoids a second GSAP opening", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
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
  await expect(page.locator("#hero-title")).toHaveCSS("clip-path", "none");
  await expect(page.locator(".site-shell")).not.toHaveAttribute(
    "data-entry-revealed",
  );
  expect(
    await page.evaluate(
      () => (window as unknown as { openingSeen: boolean }).openingSeen,
    ),
  ).toBe(false);
});

test("reduced motion and direct anchors skip the homepage opening", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/portfolio");
  await page
    .getByRole("link", { name: "Review my projects", exact: true })
    .click();
  expect(
    await page.evaluate(
      () => (window as unknown as { openingSeen: boolean }).openingSeen,
    ),
  ).toBe(false);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("about:blank");
  await page.goto("/portfolio#projects");
  await page
    .getByRole("button", {
      name: "EMS – Energy Management System",
      exact: true,
    })
    .click();
  expect(
    await page.evaluate(
      () => (window as unknown as { openingSeen: boolean }).openingSeen,
    ),
  ).toBe(false);
});

test("hero interaction finishes the opening and client return does not replay it", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/portfolio");
  const name = page.locator(".hero-name-button");
  await name.focus();
  await expect(page.locator("#hero-title")).toHaveCSS("transform", "none");
  await name.press("Enter");
  await page
    .getByRole("button", { name: "Return to introduction", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "EMS – Energy Management System",
      exact: true,
    })
    .click();
  await page
    .getByRole("link", { name: "Project overview", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects\//);
  await page.evaluate(() => {
    (window as unknown as { openingSeen: boolean }).openingSeen = false;
  });
  await page.getByRole("link", { name: /All selected work/ }).click();
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page.locator("#hero-title")).toHaveCSS("opacity", "1");
  expect(
    await page.evaluate(
      () => (window as unknown as { openingSeen: boolean }).openingSeen,
    ),
  ).toBe(false);
});
