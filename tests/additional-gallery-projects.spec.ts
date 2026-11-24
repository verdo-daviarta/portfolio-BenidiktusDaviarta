import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";

const projects = [
  {
    title: "Wedding Invitation",
    filter: "Web",
    repo: "wedding-invitation",
    preview: ".site-invitation",
    note: "Illustrative preview",
  },
  {
    title: "light4web · Custom Apparel",
    filter: "Web",
    repo: "light4web",
    preview: ".site-business",
    note: "Private repository · GitHub access required",
  },
  {
    title: "Cashback Sociolla Finance · QA Source",
    filter: "Source",
    repo: "CashbackSociollaFinance",
    preview: ".repository-overview",
    note: "Branch / master",
  },
  {
    title: "SQA Batch Training · Selenium Source",
    filter: "Source",
    repo: "SQABatchTrainingProject",
    preview: ".repository-overview",
    note: "Branch / master",
  },
];

for (const width of [390, 768, 1440]) {
  test(`additional Web and Source projects have accurate usable previews at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto("/portfolio");
    for (const project of projects) {
      const filter = page.getByRole("button", {
        name: project.filter,
        exact: true,
      });
      await filter.click();
      await expect(filter).toHaveAttribute("aria-pressed", "true");
      const trigger = page.getByRole("button", {
        name: `Preview ${project.title}`,
        exact: true,
      });
      await expect(trigger.locator(`${project.preview}.compact`)).toBeVisible();
      if (project.filter === "Web") {
        await expect(trigger.locator(".web-overview-kicker")).toHaveCount(0);
        await expect(
          trigger.getByText("Illustrative preview", { exact: true }),
        ).toHaveCount(0);
      }
      const bounds = (await trigger.boundingBox())!;
      expect(bounds.height).toBeCloseTo(200, 2);
      expect(
        await trigger.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
      if (width === 1440)
        await trigger.screenshot({ path: `.next/card-${project.repo}.png` });
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toHaveCSS(
        "background-color",
        await page.locator("html").evaluate((element) => {
          return getComputedStyle(element).backgroundColor;
        }),
      );
      await expect(
        dialog.getByRole("heading", { name: project.title, exact: true }),
      ).toBeVisible();
      await expect(dialog.locator(project.preview)).toBeVisible();
      await expect(
        dialog.getByText(project.note, { exact: true }),
      ).toBeVisible();
      const link = dialog.getByRole("link", {
        name: "View repository",
        exact: true,
      });
      await expect(link).toHaveAttribute(
        "href",
        `https://github.com/verdo-daviarta/${project.repo}`,
      );
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(
        dialog.locator("iframe, .media-empty, .preview-note"),
      ).toHaveCount(0);
      if (project.filter === "Source") {
        await expect(dialog.locator(".repository-language")).toHaveText("Java");
        await expect(dialog.locator("code")).toContainText("WebDriver");
      } else {
        await expect(dialog.locator(".web-feature-list > li")).toHaveCount(4);
        await expect(
          dialog.getByText("OpenAI / Gemini", { exact: true }),
        ).toHaveCount(0);
      }
      expect(
        await dialog.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
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
      if (width === 390)
        await page.screenshot({ path: `.next/modal-${project.repo}-390.png` });
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
    }
  });
}
