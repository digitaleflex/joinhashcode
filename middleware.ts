import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Fetch session from Better Auth API
  const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const session = response.ok ? await response.json() : null;

  const isProtectedPath = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/community') ||
    request.nextUrl.pathname.startsWith('/missions') ||
    request.nextUrl.pathname.startsWith('/tools') ||
    request.nextUrl.pathname.startsWith('/settings');

  if (isProtectedPath && (!session || !session.session)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/community/:path*",
    "/missions/:path*",
    "/tools/:path*",
    "/settings/:path*"
  ],
};
