import { NextResponse } from "next/server";
import { entryCookie, portfolioDestination } from "@/lib/entry-test";

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { message: "Reload the page and try skipping the test again." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  const destination = form.get("destination");
  const response = NextResponse.redirect(
    new URL(
      portfolioDestination(
        typeof destination === "string" ? destination : null,
      ),
      request.url,
    ),
    303,
  );
  response.headers.set("Cache-Control", "private, no-store");
  response.cookies.set(entryCookie.name, entryCookie.skipValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
  });
  return response;
}
