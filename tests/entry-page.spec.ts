import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [390, 1440]) {
  test(`API entry starts empty and unlocks the portfolio at ${width}px`, async ({
    page,
    context,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("textbox", { name: "Request body" }),
    ).toHaveValue('{\n  "visitor": "",\n  "id": ""\n}');
    await expect(
      page.getByRole("link", { name: "Enter portfolio" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Request documentation" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("400 Bad Request");
    await expect(
      page.getByRole("link", { name: "Enter portfolio" }),
    ).toHaveCount(0);
    await page
      .getByRole("textbox", { name: "Request body" })
      .fill(JSON.stringify({ visitor: "guest", id: "001" }, null, 2));
    const [response] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().endsWith("/api/entry-test") &&
          r.request().method() === "POST",
      ),
      page.getByRole("button", { name: "Send", exact: true }).click(),
    ]);
    expect(response.status()).toBe(200);
    expect(response.request().postDataJSON()).toEqual({
      visitor: "guest",
      id: "001",
    });
    await expect(page.getByRole("status")).toContainText("200 OK");
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    const cookie = (await context.cookies()).find(
      (c) => c.name === "portfolio-entry-test",
    );
    expect(cookie).toMatchObject({
      httpOnly: true,
      sameSite: "Lax",
      expires: -1,
    });
    await page.getByRole("link", { name: "Enter portfolio" }).click();
    await expect(page).toHaveURL("/portfolio");
    await expect(page.locator("#hero-title")).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL("/portfolio");
  });
}

for (const width of [390, 1440]) {
  test(`Skip test enters without submitting the API exercise at ${width}px`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    let exerciseRequests = 0;
    page.on("request", (request) => {
      if (new URL(request.url()).pathname === "/api/entry-test")
        exerciseRequests++;
    });
    await page.goto("/");
    await expect(
      page.getByRole("textbox", { name: "Request body" }),
    ).toHaveValue('{\n  "visitor": "",\n  "id": ""\n}');
    const skip = page.getByRole("button", { name: "Skip test", exact: true });
    await skip.focus();
    await skip.press("Enter");
    await expect(page).toHaveURL("/portfolio");
    await expect(page.locator("#hero-title")).toBeVisible();
    expect(exerciseRequests).toBe(0);
    expect(
      (await context.cookies()).find(
        (cookie) => cookie.name === "portfolio-entry-test",
      ),
    ).toMatchObject({
      value: "skipped",
      httpOnly: true,
      sameSite: "Lax",
      expires: -1,
    });
    await page.reload();
    await expect(page).toHaveURL("/portfolio");
    await page.goto("/projects/command-center");
    await expect(page).toHaveURL("/projects/command-center");
  });
}

test("skip resumes project destinations and rejects external redirects", async ({
  request,
}) => {
  expect((await request.get("/api/entry-test/skip")).status()).toBe(405);
  for (const [destination, expected] of [
    ["/projects/command-center", "/projects/command-center"],
    ["https://example.com", "/portfolio"],
  ]) {
    const response = await request.post("/api/entry-test/skip", {
      form: { destination },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(303);
    expect(new URL(response.headers().location).pathname).toBe(expected);
    expect(new URL(response.headers().location).hostname).not.toBe(
      "example.com",
    );
    expect(response.headers()["set-cookie"]).toContain(
      "portfolio-entry-test=skipped",
    );
  }
});

test("request tabs support keyboard navigation and preserve the JSON body", async ({
  page,
}) => {
  await page.goto("/");
  const body = page.getByRole("textbox", { name: "Request body" });
  const payload = JSON.stringify({ visitor: "guest", id: "001" }, null, 2);
  await body.fill(payload);
  const headers = page.getByRole("tab", { name: "Headers", exact: true });
  await headers.click();
  await expect(headers).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("cell", { name: "application/json", exact: true }),
  ).toBeVisible();
  await expect(body).toBeHidden();
  await headers.press("ArrowLeft");
  await expect(
    page.getByRole("tab", { name: "Body", exact: true }),
  ).toBeFocused();
  await expect(body).toHaveValue(payload);
});

test("the raw editor reports malformed JSON and shows request progress", async ({
  page,
}) => {
  await page.goto("/");
  const body = page.getByRole("textbox", { name: "Request body" });
  await body.fill("{");
  const send = page.getByRole("button", { name: "Send", exact: true });
  await send.focus();
  await send.press("Enter");
  await expect(page.getByRole("status")).toContainText(
    "Body must be valid JSON.",
  );
  await expect(page.getByRole("link", { name: "Enter portfolio" })).toHaveCount(
    0,
  );
  await body.fill(JSON.stringify({ visitor: "guest", id: "001" }));
  let releaseRequest!: () => void;
  const waitForRelease = new Promise<void>((resolve) => {
    releaseRequest = resolve;
  });
  await page.route("**/api/entry-test", async (route) => {
    await waitForRelease;
    await route.continue();
  });
  try {
    await send.click();
    await expect(
      page.getByRole("button", { name: "Sending..." }),
    ).toBeDisabled();
    await expect(body).toBeDisabled();
    await expect(page.getByRole("status")).toContainText(
      "Sending POST request...",
    );
  } finally {
    releaseRequest();
  }
  await expect(page.getByRole("status")).toContainText("200 OK");
  await expect(body).toBeEnabled();
});

test("POST validates strings and only success grants entry", async ({
  request,
}) => {
  expect((await request.get("/api/entry-test")).status()).toBe(405);
  const malformed = await request.post("/api/entry-test", {
    data: "{",
    headers: { "Content-Type": "application/json" },
  });
  expect(malformed.status()).toBe(400);
  for (const data of [
    null,
    [],
    {},
    { visitor: "guest" },
    { visitor: "unknown", id: "001" },
    { visitor: "guest", id: 1 },
    { visitor: "Guest", id: "001" },
    { visitor: "guest", id: "001 " },
  ]) {
    const response = await request.post("/api/entry-test", {
      data: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    expect(response.status()).toBe(400);
    expect(response.headers()["set-cookie"]).toBeUndefined();
  }
  const result = await request.post("/api/entry-test", {
    data: { visitor: "guest", id: "001" },
  });
  expect(result.status()).toBe(200);
  expect((await result.json()).status).toBe(200);
});

test("direct visits require completion and resume the requested project", async ({
  page,
  context,
}) => {
  await page.goto("/projects/command-center");
  await expect(page).toHaveURL(/\/?next=/);
  await expect(page.locator("#hero-title")).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Request body" })
    .fill(JSON.stringify({ visitor: "guest", id: "001" }, null, 2));
  await page.getByRole("button", { name: "Send", exact: true }).click();
  const enter = page.getByRole("link", { name: "Enter portfolio" });
  await expect(enter).toHaveAttribute("href", "/projects/command-center");
  await enter.click();
  await expect(page).toHaveURL("/projects/command-center");
  await expect(
    page.getByRole("heading", { name: "Command Center.", exact: true }),
  ).toBeVisible();
  await context.clearCookies();
  await page.reload();
  await expect(page).toHaveURL(/\/?next=/);
});

test("portfolio cannot be entered by typing its URL before sending", async ({
  request,
}) => {
  const response = await request.get("/portfolio", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(
    new URL(response.headers().location, "http://localhost").pathname,
  ).toBe("/");
});

test("request failure is recoverable and never unlocks entry", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Request body" })
    .fill(JSON.stringify({ visitor: "guest", id: "001" }, null, 2));
  await page.route("**/api/entry-test", (route) => route.abort());
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "could not be completed",
  );
  await expect(page.getByRole("link", { name: "Enter portfolio" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: "Send", exact: true }),
  ).toBeEnabled();
  await page.unroute("**/api/entry-test");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("200 OK");
});

test("destination cannot redirect to another site", async ({ page }) => {
  await page.goto("/?next=https%3A%2F%2Fexample.com");
  await page
    .getByRole("textbox", { name: "Request body" })
    .fill(JSON.stringify({ visitor: "guest", id: "001" }, null, 2));
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Enter portfolio" }),
  ).toHaveAttribute("href", "/portfolio");
});

test("entry explains JavaScript requirements when scripting is disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(process.env.QA_BASE_URL ?? "http://127.0.0.1:3100");
    await expect(page.locator("noscript > p")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Request documentation" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Enter portfolio" }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Skip test", exact: true }).click();
    await expect(page).toHaveURL(/\/portfolio$/);
    await expect(page.locator("#hero-title")).toBeVisible();
  } finally {
    await context.close();
  }
});
