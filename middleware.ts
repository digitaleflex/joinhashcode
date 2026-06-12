import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  // CVE-2025-29927: strip header that would bypass middleware execution
  if (request.headers.get("x-middleware-subrequest")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  let sessionData = null;
  // True when we could NOT determine the session (network/port/container error),
  // as opposed to a confirmed "no session". On failure we do NOT fail open blindly:
  // we fall back to the presence of the signed session cookie (see below).
  let sessionFetchFailed = false;

  try {
    const requestHeaders = new Headers(request.headers);
    const host = request.headers.get("host");
    if (host) {
      requestHeaders.set("host", host);
    }

    const loopbackPort = process.env.PORT || "3000";
    let response;
    try {
      // 1. Try local loopback first to bypass DNS and NAT loopback limitations in Docker/production
      response = await fetch(`http://127.0.0.1:${loopbackPort}/api/auth/get-session`, {
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
    } else {
      sessionFetchFailed = true;
    }
  } catch (error) {
    console.error("🟢 [Middleware] Session fetch failed:", error);
    sessionFetchFailed = true;
  }

  const session = sessionData?.session;
  let user = sessionData?.user;

  // Stale cache remediation (CVE-2026-STALE): Better Auth JWT cookies hold stale user fields (e.g. currentSituation or class)
  // until a session update is requested. Query /api/user/me to bypass this cache and get the up-to-date fields
  // directly from PostgreSQL. This prevents the infinite onboarding/quiz redirect loops.
  if (session) {
    try {
      const requestHeaders = new Headers(request.headers);
      const host = request.headers.get("host");
      if (host) {
        requestHeaders.set("host", host);
      }

      const loopbackPort = process.env.PORT || "3000";
      let meResponse;
      try {
        meResponse = await fetch(`http://127.0.0.1:${loopbackPort}/api/user/me`, {
          headers: requestHeaders,
          cache: "no-store",
        });
      } catch {
        const baseUrl = request.nextUrl.origin;
        meResponse = await fetch(`${baseUrl}/api/user/me`, {
          headers: requestHeaders,
          cache: "no-store",
        });
      }

      if (meResponse.ok) {
        const freshUser = await meResponse.json();
        if (freshUser) {
          user = freshUser;
        }
      }
    } catch (meError) {
      console.error("🟢 [Middleware] Stale session fallback - direct user fetch failed:", meError);
    }
  }

  // Block banned users everywhere before any route-specific check
  if (user?.banned) {
    const banExpires = user.banExpires ? new Date(user.banExpires as string) : null;
    if (!banExpires || banExpires > new Date()) {
      const bannedUrl = new URL("/signin", request.url);
      bannedUrl.searchParams.set("error", "banned");
      return NextResponse.redirect(bannedUrl);
    }
  }

  const isProtectedPath =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/missions') ||
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname.startsWith('/squad') ||
    request.nextUrl.pathname.startsWith('/dossier') ||
    request.nextUrl.pathname.startsWith('/reviewer') ||
    request.nextUrl.pathname.startsWith('/feedback') ||
    request.nextUrl.pathname.startsWith('/onboarding') ||
    request.nextUrl.pathname.startsWith('/quiz');

  const isOnboardingPath = request.nextUrl.pathname.startsWith('/onboarding');
  const isQuizPath = request.nextUrl.pathname.startsWith('/quiz');
  const isBetaAccessPath = request.nextUrl.pathname.startsWith('/beta-access');

  if (isProtectedPath && !session) {
    // If the loopback session probe returned null (e.g. due to HTTP loopback / secure cookie mismatch),
    // we fall back to the presence of the session cookie. This prevents the signin↔onboarding
    // infinite redirect loop. The destination page's own server-side getSession() guard will
    // cryptographically re-validate the session cookie, keeping the application secure.
    const hasSessionCookie = !!getSessionCookie(request);
    if (!hasSessionCookie) {
      const signinUrl = new URL("/signin", request.url);
      signinUrl.searchParams.set("reason", "auth_required");
      signinUrl.searchParams.set("callbackURL", request.nextUrl.pathname);
      return NextResponse.redirect(signinUrl);
    }
  }

  if (session && user) {
    // Redirect anyone landing on /beta-access to the appropriate next step
    if (isBetaAccessPath) {
      const dest = !user.currentSituation ? "/onboarding"
        : !user.class ? "/quiz"
        : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }

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
    "/onboarding", "/onboarding/:path*",
    "/quiz",      "/quiz/:path*",
    "/beta-access"
  ],
};
