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
  await expect(page.locator("article.featured-project img")).toBeVisible();
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
  await expect(page.locator(".gallery-item")).toHaveCount(
    gallery.filter((item) => item.type === "spreadsheet").length,
  );
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

test("landing gallery scrolls after six cards and removes the limit for filtered results", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scroller = page.getByRole("region", { name: "Work Gallery artifacts" });
  const cards = scroller.locator(".gallery-item");
  await expect(cards).toHaveCount(gallery.length);

  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    await scroller.evaluate((element) => {
      element.scrollTop = 0;
    });
    await expect
      .poll(() =>
        scroller.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          const items = Array.from(element.querySelectorAll(".gallery-item"));
          return items.filter((item) => {
            const card = item.getBoundingClientRect();
            return card.top >= bounds.top && card.bottom <= bounds.bottom + 1;
          }).length;
        }),
      )
      .toBe(6);
    const columns = await scroller
      .locator(".gallery-grid")
      .evaluate(
        (element) =>
          getComputedStyle(element).gridTemplateColumns.split(" ").length,
      );
    expect(columns).toBe(width === 1440 ? 3 : width === 768 ? 2 : 1);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await scroller.scrollIntoViewIfNeeded();
  await scroller.hover();
  const pageY = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 600);
  await expect
    .poll(() => scroller.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(pageY);
  await scroller.focus();
  await page.keyboard.press("Home");
  await expect
    .poll(() => scroller.evaluate((element) => element.scrollTop))
    .toBe(0);
  await page.keyboard.press("End");
  await expect
    .poll(() => scroller.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  const trigger = page.getByRole("button", {
    name: "Preview Automation source",
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  for (const [filter, count] of [
    ["Images", gallery.filter((item) => item.type === "image").length],
    [
      "Spreadsheets",
      gallery.filter((item) => item.type === "spreadsheet").length,
    ],
  ] as const) {
    await page.getByRole("button", { name: filter, exact: true }).click();
    await expect(page.locator(".gallery-item")).toHaveCount(count);
    if (count > 6) {
      await expect(scroller).toBeVisible();
      await expect
        .poll(() =>
          scroller.evaluate(
            (element) => element.scrollHeight > element.clientHeight,
          ),
        )
        .toBe(true);
    } else {
      await expect(scroller).toHaveCount(0);
      expect(
        await page
          .locator(".gallery-grid")
          .evaluate((element) => element.parentElement!.style.maxHeight),
      ).toBe("");
    }
  }
  await page
    .getByRole("button", { name: "All artifacts", exact: true })
    .click();
  await expect(scroller).toBeVisible();
  await expect
    .poll(() =>
      scroller.evaluate((element) => ({
        top: element.scrollTop,
        overflowing: element.scrollHeight > element.clientHeight,
      })),
    )
    .toEqual({ top: 0, overflowing: true });
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

test("Bela Negara shows three application links and other projects retain single or no live links", async ({
  page,
}) => {
  const destinations = [
    [
      "Learning Management System",
      "http://ar-bn-frontend.10.70.0.45.nip.io/login",
    ],
    ["E-Exam", "http://10.70.0.40:18000/login"],
    ["Data Archive", "http://data-archive.10.70.0.45.nip.io/"],
  ] as const;
  await page.goto("/projects/pusdiklat-bela-negara");
  const links = page.locator(".project-live-links");
  await expect(links.getByRole("link")).toHaveCount(3);
  await expect(
    page.getByRole("link", { name: "Live project", exact: true }),
  ).toHaveCount(0);
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    let previousBottom = 0;
    for (const [label, url] of destinations) {
      const link = links.getByRole("link", { name: label, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", url);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      const bounds = await link.boundingBox();
      expect(bounds!.y).toBeGreaterThan(previousBottom);
      previousBottom = bounds!.y + bounds!.height;
    }
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
  await expect(
    links.getByRole("link", {
      name: /Augmented Reality|Virtual Reality|AR|VR/,
    }),
  ).toHaveCount(0);

  await page.goto("/projects/command-center");
  await expect(links.getByRole("link")).toHaveCount(1);
  await expect(
    links.getByRole("link", { name: "Live project", exact: true }),
  ).toHaveAttribute("href", "https://command-center.kemhan.go.id/");
  await page.goto("/projects/pusdiklat-bahasa");
  await expect(links).toHaveCount(0);
});

test("Bela Negara uses the LMS hero and previews all remaining supplied screenshots", async ({
  page,
  request,
}) => {
  const heroSource =
    "/projects/pusdiklat-bela-negara/learning-management/image-1.png";
  const screenshots = gallery.filter(
    (item) =>
      item.projectSlug === "pusdiklat-bela-negara" && item.type === "image",
  );
  expect(screenshots).toHaveLength(18);
  expect(new Set(screenshots.map((item) => item.source)).size).toBe(18);
  const hero = screenshots.find((item) => item.source === heroSource)!;
  expect(hero).toBeDefined();
  const response = await page.goto("/projects/pusdiklat-bela-negara");
  expect(response?.status()).toBe(200);
  const heroTrigger = page.locator(".main-project-preview");
  const heroImage = heroTrigger.getByRole("img", { name: hero.thumbnailAlt });
  await expect
    .poll(() =>
      heroImage.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
  expect(
    new URL(
      (await heroImage.getAttribute("src"))!,
      page.url(),
    ).searchParams.get("url"),
  ).toBe(heroSource);
  const sidebar = page.locator(".work-gallery-sidebar");
  await expect(sidebar.locator(".gallery-item")).toHaveCount(
    gallery.filter((item) => item.projectSlug === "pusdiklat-bela-negara")
      .length - 1,
  );
  await expect(
    sidebar.getByRole("button", { name: `Preview ${hero.title}`, exact: true }),
  ).toHaveCount(0);
  const scroller = sidebar.getByRole("region", {
    name: "Work Gallery screenshots",
  });
  await expect
    .poll(() =>
      scroller.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    )
    .toBe(true);

  for (const item of screenshots) {
    const imageResponse = await request.get(item.source!);
    expect(imageResponse.status()).toBe(200);
    expect(imageResponse.headers()["content-type"]).toMatch(/^image\//);
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
    await expect(dialog).toBeVisible();
    const preview = dialog.getByRole("img", { name: item.thumbnailAlt });
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

  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await heroTrigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    const last = screenshots[screenshots.length - 1];
    await sidebar
      .getByRole("button", { name: `Preview ${last.title}`, exact: true })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
  }
});

test("AR issue document appears on the landing gallery and Bela Negara with a safe external link", async ({
  page,
}) => {
  const documentUrl =
    "https://docs.google.com/document/d/1HY3UR9OErT7YvaGcMs3tYiWyV2cr2jHf-WLomZ5STB8/edit?usp=sharing";
  for (const route of ["/", "/projects/pusdiklat-bela-negara"]) {
    await page.goto(route);
    if (route === "/") {
      await page
        .getByRole("button", { name: "Documents", exact: true })
        .click();
      await expect(page.locator(".gallery-item")).toHaveCount(2);
      const card = page
        .locator(".gallery-item")
        .filter({ hasText: "AR_Issue" });
      await expect(
        card.getByRole("link", { name: "View document", exact: true }),
      ).toHaveAttribute("href", documentUrl);
    }
    const trigger = page.getByRole("button", {
      name: "Preview AR_Issue",
      exact: true,
    });
    await trigger.scrollIntoViewIfNeeded();
    const cover = trigger.locator(".document-overview");
    await expect(cover).toBeVisible();
    await expect(cover.getByText("Google Docs", { exact: true })).toBeVisible();
    await expect(
      cover.getByText("MODUL & SCENARIO Unity Level Design", { exact: true }),
    ).toBeVisible();
    await expect(
      cover.getByText("jeda scene 3a ke 4a terlalu lama", { exact: true }),
    ).toBeVisible();
    await expect(
      cover.getByText("Content excerpt", { exact: true }),
    ).toBeVisible();
    await expect(trigger.getByText("Media pending")).toHaveCount(0);
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "AR_Issue", exact: true }),
    ).toBeVisible();
    await expect(dialog.locator(".document-overview")).toBeVisible();
    await expect(dialog.getByText("SC002", { exact: true })).toBeVisible();
    await expect(
      dialog.getByText("setelah scene 3a ada VO yang tidak sesuai", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      dialog.getByText(
        "Content excerpt · Open the document for the full issue report.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      dialog.getByText(
        /Artifact not published|No artifact has been provided yet|Media pending/,
      ),
    ).toHaveCount(0);
    const link = dialog.getByRole("link", {
      name: "View document",
      exact: true,
    });
    await expect(link).toHaveAttribute("href", documentUrl);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await link.focus();
    await page.keyboard.press("Tab");
    await expect(
      dialog.getByRole("button", { name: "Close preview" }),
    ).toBeFocused();
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test("document overview keeps a readable issue excerpt and usable preview at responsive widths", async ({
  page,
}) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/projects/pusdiklat-bela-negara"]) {
      await page.goto(route);
      if (route === "/") {
        await page
          .getByRole("button", { name: "Documents", exact: true })
          .click();
      }
      const trigger = page.getByRole("button", {
        name: "Preview AR_Issue",
        exact: true,
      });
      await trigger.scrollIntoViewIfNeeded();
      const sheet = trigger.locator(".document-sheet");
      const firstIssue = sheet.getByText("jeda scene 3a ke 4a terlalu lama", {
        exact: true,
      });
      const sheetBounds = (await sheet.boundingBox())!;
      const issueBounds = (await firstIssue.boundingBox())!;
      const triggerBounds = (await trigger.boundingBox())!;
      const coverBounds = (await trigger
        .locator(".document-overview")
        .boundingBox())!;
      expect(coverBounds.width).toBeLessThanOrEqual(triggerBounds.width + 1);
      expect(sheetBounds.x + sheetBounds.width).toBeLessThanOrEqual(
        triggerBounds.x + triggerBounds.width,
      );
      // The excerpt must fit above the thumbnail's bottom fade, not just exist in the DOM.
      expect(issueBounds.y).toBeGreaterThan(sheetBounds.y);
      expect(issueBounds.y + issueBounds.height).toBeLessThanOrEqual(
        sheetBounds.y + sheetBounds.height * 0.85,
      );
      await trigger.click();
      const dialog = page.getByRole("dialog");
      const link = dialog.getByRole("link", {
        name: "View document",
        exact: true,
      });
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeInViewport();
      expect(
        await dialog.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
    }
  }
});

test("Data Archive sheet has a readable table overview and opens the exact tab", async ({
  page,
}) => {
  const title = "Data Archive · Test cases & scenarios";
  const url =
    "https://docs.google.com/spreadsheets/d/1PNT3h3j_aFL7UaqpJPOTVkDDPNO7Xi4v7qiGB7f4LeA/edit?gid=352178411#gid=352178411&range=A1:B1";
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/projects/pusdiklat-bela-negara"]) {
      await page.goto(route);
      if (route === "/") {
        await page
          .getByRole("button", { name: "Spreadsheets", exact: true })
          .click();
        await expect(page.locator(".gallery-item")).toHaveCount(2);
        const card = page.locator(".gallery-item").filter({
          has: page.getByRole("heading", { name: title, exact: true }),
        });
        await expect(
          card.getByRole("link", { name: "Open spreadsheet", exact: true }),
        ).toHaveAttribute("href", url);
      }
      const trigger = page.getByRole("button", {
        name: `Preview ${title}`,
        exact: true,
      });
      await trigger.scrollIntoViewIfNeeded();
      const cover = trigger.locator(".spreadsheet-overview");
      await expect(cover).toBeVisible();
      await expect(
        cover.getByText("CasesSheet", { exact: true }),
      ).toBeVisible();
      await expect(
        cover.getByText("Berhasil login", { exact: true }),
      ).toBeVisible();
      await expect(
        cover.getByText(/Media pending|Name Tester|Mutia/),
      ).toHaveCount(0);
      await expect(cover.getByRole("columnheader")).toHaveCount(2);
      const bounds = (await trigger.boundingBox())!;
      const sheetBounds = (await cover
        .locator(".document-sheet")
        .boundingBox())!;
      const caseBounds = (await cover
        .getByText("Berhasil login", { exact: true })
        .boundingBox())!;
      expect((await cover.boundingBox())!.width).toBeLessThanOrEqual(
        bounds.width + 1,
      );
      expect(caseBounds.x + caseBounds.width).toBeLessThanOrEqual(
        bounds.x + bounds.width,
      );
      expect(caseBounds.y + caseBounds.height).toBeLessThanOrEqual(
        sheetBounds.y + sheetBounds.height * 0.85,
      );
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(
        dialog.getByRole("heading", { name: title, exact: true }),
      ).toBeVisible();
      await expect(
        dialog.getByText("Google Sheets", { exact: true }),
      ).toBeVisible();
      const table = dialog.getByRole("table");
      await expect(table.getByRole("columnheader")).toHaveCount(4);
      await expect(table.getByRole("row")).toHaveCount(5);
      await expect(table.getByText("TC - 006", { exact: true })).toBeVisible();
      await expect(
        table.getByText("Pastikan dapat masuk ke halaman dashboard", {
          exact: true,
        }),
      ).toBeVisible();
      await expect(table.getByText(/Name Tester|Mutia/)).toHaveCount(0);
      const scroller = dialog.getByRole("region", {
        name: "Test case table excerpt",
        exact: true,
      });
      await scroller.focus();
      if (
        await scroller.evaluate(
          (element) => element.scrollWidth > element.clientWidth,
        )
      ) {
        await expect(scroller).toBeFocused();
        await page.keyboard.press("ArrowRight");
        await expect
          .poll(() => scroller.evaluate((element) => element.scrollLeft))
          .toBeGreaterThan(0);
      }
      const link = dialog.getByRole("link", {
        name: "Open spreadsheet",
        exact: true,
      });
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeInViewport();
      await expect(link).toHaveAttribute("href", url);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(
        await dialog.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
      await link.focus();
      await page.keyboard.press("Tab");
      await expect(
        dialog.getByRole("button", { name: "Close preview", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
    }
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
    for (const route of [
      "/",
      "/projects/command-center",
      "/projects/pusdiklat-bela-negara",
    ]) {
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
