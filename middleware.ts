import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { nextUrl } = request

  // Public routes — no auth required
  const publicPaths = ["/", "/quiz", "/missions", "/onboarding", "/signin", "/signup"]
  const isPublic = publicPaths.some(
    (p) => nextUrl.pathname === p || nextUrl.pathname.startsWith(`${p}/`)
  )
  // API routes except admin/reviewer
  const isApiPublic = nextUrl.pathname.startsWith("/api/") &&
    !nextUrl.pathname.startsWith("/api/admin") &&
    !nextUrl.pathname.startsWith("/api/reviewer")

  if (isPublic || isApiPublic) {
    return NextResponse.next()
  }

  // Get session from cookie header
  const session = await auth.api.getSession({
    headers: new Headers({ cookie: request.headers.get("cookie") || "" }),
  })

  if (!session) {
    // Redirect unauthenticated users to signin for protected routes
    if (nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/reviewer")) {
      return NextResponse.redirect(new URL("/signin", request.url))
    }
    if (nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/signin", request.url))
    }
    return NextResponse.next()
  }

  // /admin/* requires ADMIN role
  if (nextUrl.pathname.startsWith("/admin")) {
    const role = (session.user as { role?: string }).role
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // /dashboard/* and /reviewer/* require auth (already verified)
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/reviewer/:path*"],
}
