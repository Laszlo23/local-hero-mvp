import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/profile", "/submit"];
const adminPaths = ["/admin"];

function hasSession(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const privyToken = request.cookies.get("privy-token");

  return Boolean(authHeader || privyToken);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAdmin = adminPaths.some((path) => pathname.startsWith(path));

  if ((isProtected || isAdmin) && !hasSession(request)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdmin && !request.headers.get("x-admin-access")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/submit/:path*", "/admin/:path*"],
};
