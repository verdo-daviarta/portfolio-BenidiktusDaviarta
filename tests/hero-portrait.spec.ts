import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import { profile } from "../src/data/profile";

for (const width of [390, 768, 1440]) {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`hero portrait toggles accessibly at ${width}px with ${reducedMotion} motion`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion });
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/portfolio");
      await page.evaluate(() => document.fonts.ready);
      const hero = page.locator(".hero-intro");
      const original = (await hero.boundingBox())!;
      const name = page.getByRole("button", {
        name: `Show portrait of ${profile.name}`,
        exact: true,
      });
      await expect(page.locator(".wordmark-name")).toHaveText(profile.name);
      await expect(page.locator("h1")).toHaveAccessibleName(profile.name);
      await expect(name).toHaveText(`${profile.name}.`);
      const cue = name.locator(".hero-name-cue");
      await expect(cue).toBeVisible();
      const cueWidth = (await cue.boundingBox())!.width;
      expect(cueWidth).toBeGreaterThan(0);
      expect(cueWidth).toBeLessThanOrEqual(84);
      const panel = page.locator(".hero-portrait-panel");
      const slogan = page.locator(".hero-portrait-slogan");
      await expect(slogan).not.toBeVisible();
      await expect(name).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Return to introduction" }),
      ).toHaveCount(0);
      await name.focus();
      await page.keyboard.press("Enter");
      const portrait = page.getByRole("button", {
        name: "Return to introduction",
        exact: true,
      });
      await expect(portrait).toBeFocused();
      if (reducedMotion === "reduce") {
        await expect(panel).toHaveCSS("transition-duration", "0s");
      } else {
        const directions = await panel.evaluate((element) =>
          element.getAnimations().flatMap((animation) => {
            const frames =
              animation.effect instanceof KeyframeEffect
                ? animation.effect.getKeyframes()
                : [];
            if (!frames[0]?.transform || !frames.at(-1)?.transform) return [];
            return [
              {
                from: new DOMMatrix(String(frames[0].transform)).m41,
                to: new DOMMatrix(String(frames.at(-1)!.transform)).m41,
              },
            ];
          }),
        );
        expect(
          directions.some((direction) => direction.from < direction.to),
        ).toBe(true);
      }
      await panel.evaluate((element) =>
        Promise.all(
          element.getAnimations().map((animation) => animation.finished),
        ),
      );
      const image = portrait.getByRole("img", {
        name: `Portrait of ${profile.name}`,
      });
      await expect(image).toBeVisible();
      await expect(slogan).toBeVisible();
      await expect(slogan).toHaveText("Tested by me, trusted by yours.");
      await expect(slogan).toHaveCSS(
        "font-family",
        await page
          .locator("#hero-title")
          .evaluate((element) => getComputedStyle(element).fontFamily),
      );
      const sloganBounds = (await slogan.boundingBox())!;
      const portraitFrame = (await portrait
        .locator(".hero-portrait-frame")
        .boundingBox())!;
      expect(sloganBounds.x + sloganBounds.width).toBeLessThanOrEqual(
        portraitFrame.x,
      );
      expect(sloganBounds.y).toBeLessThan(
        portraitFrame.y + portraitFrame.height,
      );
      expect(sloganBounds.y + sloganBounds.height).toBeGreaterThan(
        portraitFrame.y,
      );
      expect(sloganBounds.x).toBeGreaterThanOrEqual(original.x);
      expect(sloganBounds.x + sloganBounds.width).toBeLessThanOrEqual(
        original.x + original.width + 1,
      );
      expect(sloganBounds.y + sloganBounds.height).toBeLessThanOrEqual(
        original.y + original.height + 1,
      );
      await expect
        .poll(() =>
          image.evaluate(
            (element) =>
              (element as HTMLImageElement).complete &&
              (element as HTMLImageElement).naturalWidth > 0,
          ),
        )
        .toBe(true);
      await expect(
        page.getByRole("link", { name: "Review my projects", exact: true }),
      ).toHaveCount(0);
      const photoBounds = (await hero.boundingBox())!;
      expect(
        Math.abs(photoBounds.height - original.height),
      ).toBeLessThanOrEqual(1);
      expect(Math.abs(photoBounds.width - original.width)).toBeLessThanOrEqual(
        1,
      );
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(result.violations).toEqual([]);
      if (reducedMotion === "no-preference")
        await page
          .locator(".hero-grid")
          .screenshot({ path: `.next/hero-portrait-${width}.png` });
      await page.keyboard.press("Space");
      await expect(name).toBeFocused();
      await page
        .locator(".hero-text-panel")
        .evaluate((element) =>
          Promise.all(
            element.getAnimations().map((animation) => animation.finished),
          ),
        );
      await expect(
        page.getByRole("link", { name: "Review my projects", exact: true }),
      ).toBeVisible();
      for (let repeat = 0; repeat < 2; repeat++) {
        await name.click();
        await expect(portrait).toBeFocused();
        await portrait.click();
        await expect(name).toBeFocused();
      }
      expect(
        Math.abs((await hero.boundingBox())!.height - original.height),
      ).toBeLessThanOrEqual(1);
    });
  }
}
