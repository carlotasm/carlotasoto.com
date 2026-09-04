import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidLang } from "@/app/lib/dictionaries";
import { detectLang } from "@/app/lib/locale";

// Send visitors to the language their browser prefers. Paths that already
// start with a supported language segment pass through untouched. Anything
// else (including unknown files like /sw.js) lands under a language so the
// site's own 404 page renders with the header.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";
  if (isValidLang(firstSegment)) return NextResponse.next();

  const lang = detectLang(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Must be a static literal: Next.js reads it at build time.
  // Skips API routes, Next internals, static asset folders, and root metadata files.
  matcher: [
    "/((?!api/|_next/|assets/|artworks/|fonts/|lg/|robots\\.txt|sitemap\\.xml|icon\\.png|favicon\\.ico).*)"
  ]
};
