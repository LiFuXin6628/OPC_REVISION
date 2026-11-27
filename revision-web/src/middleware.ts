import { NextRequest, NextResponse } from "next/server";
import { isAdmin, sessionCookie } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  if (!(await isAdmin(request.cookies.get(sessionCookie)?.value))) {
    const login = new URL("/login", request.url);
    const host = request.headers.get("host");
    if (host) login.host = host;
    const response = NextResponse.redirect(login);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

// Next.js 15 middleware defaults to the Edge runtime.
export const config = { matcher: ["/dashboard/:path*", "/screening/:path*"] };


