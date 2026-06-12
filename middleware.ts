import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Fix SEC-010: Build nonce-based CSP — replaces static `unsafe-inline` for script-src
function buildCSP(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://va.vercel-scripts.com https://vercel.live https://*.vercel.live https://static.cloudflareinsights.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live https://*.vercel.live",
    "img-src 'self' data: https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://api.qrserver.com https://vercel.live https://*.vercel.live https://vercel.com",
    "font-src 'self' data: https://fonts.gstatic.com https://vercel.live https://*.vercel.live",
    "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live https://*.vercel.live",
    "frame-src 'self' https://vercel.live https://*.vercel.live",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export async function middleware(request: NextRequest) {
  // CVE-2025-29927: strip header that would bypass middleware execution
  if (request.headers.get("x-middleware-subrequest")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Fix SEC-010: generate per-request nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

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
  const isBetaAccessPath = request.nextUrl.pathname.startsWith('/beta-access');

  // Public routes: inject CSP nonce and return immediately — no session fetch
  if (!isProtectedPath && !isBetaAccessPath) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", buildCSP(nonce));
    return response;
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
      response = await fetch(`http://127.0.0.1:${loopbackPort}/api/auth/middleware-session`, {
        headers: requestHeaders,
        cache: 'no-store',
      });
    } catch (localError) {
      // 2. Fallback to origin if running on a custom port locally
      const baseUrl = request.nextUrl.origin;
      response = await fetch(`${baseUrl}/api/auth/middleware-session`, {
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
    console.error("🟢 [Middleware] Unified session fetch failed:", error);
    sessionFetchFailed = true;
  }

  const session = sessionData?.session;
  let user = sessionData?.user;

  // Block banned users everywhere before any route-specific check
  if (user?.banned) {
    const banExpires = user.banExpires ? new Date(user.banExpires as string) : null;
    if (!banExpires || banExpires > new Date()) {
      const bannedUrl = new URL("/signin", request.url);
      bannedUrl.searchParams.set("error", "banned");
      return NextResponse.redirect(bannedUrl);
    }
  }

  const isOnboardingPath = request.nextUrl.pathname.startsWith('/onboarding');
  const isQuizPath = request.nextUrl.pathname.startsWith('/quiz');

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

  // Fix SEC-010: inject nonce into request headers (readable by server components via headers())
  // and set nonce-based CSP on the response (overrides next.config.mjs for matched routes)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", buildCSP(nonce));
  return response;
}

export const config = {
  // SEC-010: expanded to all HTML pages so every response gets a CSP nonce.
  // Static assets (_next/static, images, favicons) are excluded to avoid overhead.
  // API routes are excluded — they don't serve HTML and don't need CSP.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|woff2?|ttf|eot)|api/).*)",
  ],
};
