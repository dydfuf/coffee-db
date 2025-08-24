import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin access control (admin pages and admin-only API)
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/crawl")) {
    const cookieName = process.env.ADMIN_COOKIE; // cookie name managed via env
    const expectedValue = process.env.ADMIN_COOKIE_VALUE; // expected cookie value managed via env

    if (!cookieName || !expectedValue) {
      return new NextResponse("Admin access is not configured.", { status: 500 });
    }

    const provided = request.cookies.get(cookieName)?.value;

    if (provided !== expectedValue) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Authorized admin request -> proceed without forcing Supabase auth
    return NextResponse.next();
  }

  // Default behavior for other routes
  return await updateSession(request);
}

export const config = {
  matcher: ["/coffee/suggestion", "/api/:path*", "/admin", "/admin/:path*"],
};
