import { test, expect } from "@playwright/test";
import { gallery } from "../src/data/gallery";

for (const width of [360, 390, 430]) {
  test(`every mobile gallery filter uses one compact row at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const viewport = page.locator(".landing-gallery-mobile");
    for (const filter of [
      "All artifacts",
      "Video",
      "Source",
      "Spreadsheets",
      "Documents",
      "Web",
      "Images",
    ]) {
      const button = page.getByRole("button", { name: filter, exact: true });
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(viewport).toHaveCSS("overflow-x", "auto");
      await expect
        .poll(() => viewport.evaluate((element) => element.scrollLeft))
        .toBe(0);
      const dimensions = await viewport.evaluate((element) => {
        const cards = [...element.querySelectorAll(".gallery-item")].map(
          (card) => card.getBoundingClientRect(),
        );
        return {
          height: element.clientHeight,
          scrollHeight: element.scrollHeight,
          width: element.clientWidth,
          scrollWidth: element.scrollWidth,
          count: cards.length,
          firstWidth: cards[0].width,
          sameRow: cards.every((card) => Math.abs(card.top - cards[0].top) < 1),
        };
      });
      expect(dimensions.sameRow).toBe(true);
      expect(dimensions.height).toBeLessThan(800 * 0.65);
      expect(dimensions.scrollHeight).toBeLessThanOrEqual(
        dimensions.height + 1,
      );
      expect(dimensions.firstWidth).toBeGreaterThan(dimensions.width * 0.75);
      if (dimensions.count > 1) {
        expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.width);
        await expect(
          page.getByText("Swipe to explore", { exact: true }),
        ).toBeVisible();
        await viewport.hover();
        await page.mouse.wheel(260, 0);
        await expect
          .poll(() => viewport.evaluate((element) => element.scrollLeft))
          .toBeGreaterThan(0);
      } else {
        expect(dimensions.firstWidth).toBeGreaterThan(dimensions.width * 0.95);
        await expect(
          page.getByText("Swipe to explore", { exact: true }),
        ).toHaveCount(0);
      }
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
      if (width === 390 && filter === "Web")
        await viewport.screenshot({ path: ".next/mobile-web-filter.png" });
    }
  });
}

for (const width of [360, 390, 430]) {
  test(`mobile gallery leaves Contact reachable at ${width}px`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const scroller = page.getByRole("region", {
      name: "Work Gallery artifacts",
      exact: true,
    });
    await expect(
      page.getByText("Swipe to explore", { exact: true }),
    ).toBeVisible();
    await expect(scroller.locator(".gallery-item")).toHaveCount(gallery.length);
    const dimensions = await scroller.evaluate((element) => {
      const cards = [...element.querySelectorAll(".gallery-item")].map((card) =>
        card.getBoundingClientRect(),
      );
      return {
        height: element.clientHeight,
        scrollHeight: element.scrollHeight,
        width: element.clientWidth,
        scrollWidth: element.scrollWidth,
        top: cards[0].top,
        firstWidth: cards[0].width,
        lastTop: cards.at(-1)!.top,
        secondLeft: cards[1].left - element.getBoundingClientRect().left,
      };
    });
    expect(dimensions.height).toBeLessThan(800 * 0.65);
    expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.height + 1);
    expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.width);
    expect(dimensions.firstWidth).toBeGreaterThan(dimensions.width * 0.75);
    expect(dimensions.firstWidth).toBeLessThan(dimensions.width);
    expect(dimensions.top).toBeCloseTo(dimensions.lastTop, 1);
    expect(dimensions.secondLeft).toBeLessThan(dimensions.width);
    await scroller.scrollIntoViewIfNeeded();
    await scroller.focus();
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() => scroller.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(0);
    const trigger = scroller.getByRole("button", {
      name: "Preview EMS · QA automation source",
      exact: true,
    });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await scroller.hover();
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 500);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(before);
    expect(await scroller.evaluate((element) => element.scrollTop)).toBe(0);
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.locator("#contact h2")).toBeInViewport();
    await page.getByRole("button", { name: "Images", exact: true }).click();
    await expect
      .poll(() => scroller.evaluate((element) => element.scrollLeft))
      .toBe(0);
    expect(
      await scroller.evaluate((element) => element.clientHeight),
    ).toBeLessThan(800 * 0.65);
    await page
      .getByRole("button", { name: "All artifacts", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "All artifacts", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await page
      .locator(".work-gallery")
      .screenshot({ path: `.next/mobile-gallery-${width}.png` });
  });
}

test("gallery restores the desktop grid after resizing from mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/");
  const scroller = page.getByRole("region", {
    name: "Work Gallery artifacts",
    exact: true,
  });
  await expect(scroller).toHaveCSS("overflow-x", "auto");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(scroller).toHaveCSS("overflow-y", "auto");
  await expect
    .poll(() =>
      scroller.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    )
    .toBe(true);
  await expect(
    page.getByText("Swipe to explore", { exact: true }),
  ).not.toBeVisible();
  await page.setViewportSize({ width: 390, height: 800 });
  await expect(scroller).toHaveCSS("overflow-x", "auto");
  await expect
    .poll(() => scroller.evaluate((element) => element.style.maxHeight))
    .toBe("");
});
