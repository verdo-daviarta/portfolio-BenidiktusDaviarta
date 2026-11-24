import { NextResponse, type NextRequest } from "next/server";
import { entryCookie } from "@/lib/entry-test";

export function proxy(request: NextRequest) {
  // Image optimization fetches public assets without the visitor cookie.
  if (/\.[^/]+$/.test(request.nextUrl.pathname)) return NextResponse.next();
  const entryStatus = request.cookies.get(entryCookie.name)?.value;
  if (
    entryStatus === entryCookie.value ||
    entryStatus === entryCookie.skipValue
  ) {
    return NextResponse.next();
  }
  const destination = new URL("/", request.url);
  destination.searchParams.set(
    "next",
    request.nextUrl.pathname + request.nextUrl.search,
  );
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/portfolio/:path*", "/projects/:path*"],
};
