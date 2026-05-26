import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let sessionData = null;

  try {
    const requestHeaders = new Headers(request.headers);
    const host = request.headers.get("host");
    if (host) {
      requestHeaders.set("host", host);
    }

    let response;
    try {
      // 1. Try local loopback first to bypass DNS and NAT loopback limitations in Docker/production
      response = await fetch("http://127.0.0.1:3000/api/auth/get-session", {
        headers: requestHeaders,
        cache: 'no-store',
      });
    } catch (localError) {
      // 2. Fallback to origin if running on a custom port locally
      const baseUrl = request.nextUrl.origin;
      response = await fetch(`${baseUrl}/api/auth/get-session`, {
        headers: requestHeaders,
        cache: 'no-store'
      });
    }

    if (response.ok) {
      sessionData = await response.json();
    }
  } catch (error) {
    console.error("🟢 [Middleware] Session fetch failed:", error);
  }

  const session = sessionData?.session;
  const user = sessionData?.user;

  const isProtectedPath =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/missions') ||
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname.startsWith('/squad') ||
    request.nextUrl.pathname.startsWith('/dossier') ||
    request.nextUrl.pathname.startsWith('/reviewer') ||
    request.nextUrl.pathname.startsWith('/feedback');

  const isOnboardingPath = request.nextUrl.pathname.startsWith('/onboarding');
  const isQuizPath = request.nextUrl.pathname.startsWith('/quiz');

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (session && user) {
    // Determine if we are on an onboarding/quiz path
    const isPostQuizPath = request.nextUrl.pathname.startsWith('/onboarding/post-quiz');

    // ONLY redirect if we are on a protected path AND it's NOT an API call or internal Next.js request
    if (isProtectedPath && !request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.includes('.')) {
      
      // 1. Check for Step 1: Initial Context (Country, Situation)
      if (!user.currentSituation && !isOnboardingPath && !isQuizPath) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }

      // 2. Check for Step 2: Quiz (Psychometrics)
      if (user.currentSituation && !user.class && !isQuizPath && !isOnboardingPath) {
        return NextResponse.redirect(new URL("/quiz", request.url));
      }

      // 3. Check for Step 3: Post-Quiz (Dream, Focus, Blocker)
      if (user.class && !user.dreamStatement && !isPostQuizPath) {
        return NextResponse.redirect(new URL("/onboarding/post-quiz", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard", "/dashboard/:path*",
    "/missions",  "/missions/:path*",
    "/settings",  "/settings/:path*",
    "/dossier",   "/dossier/:path*",
    "/squad",     "/squad/:path*",
    "/reviewer",  "/reviewer/:path*",
    "/feedback",  "/feedback/:path*",
  ],
};
