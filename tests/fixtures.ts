import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  request: async ({ request }, provideRequest) => {
    const result = await request.post("/api/entry-test", {
      data: { visitor: "guest", id: "001" },
    });
    expect(result.status()).toBe(200);
    await provideRequest(request);
  },
  context: async ({ context }, provideContext) => {
    const result = await context.request.post("/api/entry-test", {
      data: { visitor: "guest", id: "001" },
    });
    expect(result.status()).toBe(200);
    await provideContext(context);
  },
});
export { expect };
