import { NextResponse } from "next/server";
import { entryCookie } from "@/lib/entry-test";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: 400, message: "Body must be valid JSON." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("visitor" in body) ||
    body.visitor !== "guest" ||
    !("id" in body) ||
    body.id !== "001"
  ) {
    return NextResponse.json(
      {
        status: 400,
        message:
          "Check visitor and id against the documentation. Both values must be strings and match exactly.",
      },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const response = NextResponse.json(
    { status: 200, message: "Request accepted. You can enter the portfolio." },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
  // This session marker records completion of the public exercise.
  response.cookies.set(entryCookie.name, entryCookie.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
  });
  return response;
}
