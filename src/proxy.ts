import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("middle were here");
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isProtectedPage =
    pathname.startsWith("/dashboard") || pathname.startsWith("/jobs");

  const refreshCookie = request.cookies.get("refreshToken");
  const isLoggedIn = Boolean(refreshCookie?.value);

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  console.log("MIDDLEWARE:", request.cookies.getAll());
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register/:path*", "/dashboard/:path*", "/jobs/:path*"],
};
