import { test, expect } from "@playwright/test";
import { gallery } from "../src/data/gallery";

for (const width of [390, 768, 1440]) {
  test(`Automation demo loads and plays the supplied video at ${width}px`, async ({
    page,
    request,
  }) => {
    const demo = gallery.find((item) => item.id === "automation-demo")!;
    expect(demo.isPlaceholder).toBe(false);
    expect(demo.videoProvider).toBe("file");
    expect(demo.source).toBe(
      "/videos/EMS_Automation_Testing - Google Chrome 2026-10-27 10-10-49.mp4",
    );
    const range = await request.get(demo.source!, {
      headers: { Range: "bytes=0-1023" },
    });
    expect(range.status()).toBe(206);
    expect(range.headers()["content-type"]).toContain("video/mp4");
    expect(range.headers()["content-range"]).toMatch(/^bytes 0-1023\/\d+$/);
    expect((await range.body()).length).toBe(1024);
    expect((await request.get(demo.thumbnail!)).status()).toBe(200);

    await page.setViewportSize({ width, height: 900 });
    const mediaRequests: string[] = [];
    page.on("request", (req) => {
      if (decodeURIComponent(req.url()).endsWith(demo.source!)) {
        mediaRequests.push(req.url());
      }
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Video", exact: true }).click();
    await expect(page.locator(".gallery-item")).toHaveCount(1);
    const trigger = page.getByRole("button", {
      name: "Preview Automation demo",
      exact: true,
    });
    await trigger.scrollIntoViewIfNeeded();
    await expect(
      trigger.getByRole("img", { name: demo.thumbnailAlt, exact: true }),
    ).toBeVisible();
    await expect(trigger.locator(".media-empty")).toHaveCount(0);
    expect(mediaRequests).toEqual([]);
    await trigger.click();
    const dialog = page.getByRole("dialog");
    const video = dialog.locator("video");
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute("src", demo.source!);
    await expect(video).toHaveAttribute("poster", demo.thumbnail!);
    await expect(video).toHaveAttribute("preload", "metadata");
    await expect(video).not.toHaveAttribute("autoplay");
    await expect
      .poll(() =>
        video.evaluate((element: HTMLVideoElement) => element.readyState),
      )
      .toBeGreaterThanOrEqual(2);
    expect(
      await video.evaluate((element: HTMLVideoElement) => ({
        muted: element.muted,
        paused: element.paused,
        controls: element.controls,
        inline: element.playsInline,
        playable:
          Number.isFinite(element.duration) &&
          element.duration > 0 &&
          element.videoWidth > 0,
      })),
    ).toEqual({
      muted: true,
      paused: true,
      controls: true,
      inline: true,
      playable: true,
    });
    await expect(dialog.locator(".preview-note")).toHaveCount(0);
    // Exercise real media decoding/playback, not just the video element markup.
    await video.evaluate((element: HTMLVideoElement) => element.play());
    await expect
      .poll(() =>
        video.evaluate((element: HTMLVideoElement) => element.currentTime),
      )
      .toBeGreaterThan(0.1);
    await video.evaluate((element: HTMLVideoElement) => element.pause());
    const targetTime = await video.evaluate((element: HTMLVideoElement) => {
      const target = Math.min(5, element.duration / 2);
      element.currentTime = target;
      return target;
    });
    await expect
      .poll(() =>
        video.evaluate((element: HTMLVideoElement) => element.seeking),
      )
      .toBe(false);
    expect(
      await video.evaluate((element: HTMLVideoElement) => element.currentTime),
    ).toBeCloseTo(targetTime, 1);
    const handle = await video.elementHandle();
    await video.evaluate((element: HTMLVideoElement) => element.play());
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(page.locator("video")).toHaveCount(0);
    expect(
      await handle!.evaluate((element: HTMLVideoElement) => element.paused),
    ).toBe(true);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(dialog.locator("video")).toBeVisible();
    expect(
      await dialog
        .locator("video")
        .evaluate((element: HTMLVideoElement) => element.paused),
    ).toBe(true);
    await dialog
      .getByRole("button", { name: "Close preview", exact: true })
      .click();
    await expect(trigger).toBeFocused();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });
}
