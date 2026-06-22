import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie, getCookieCache } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  if (request.headers.get("x-middleware-subrequest")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (process.env.MAINTENANCE_MODE === "true" && request.nextUrl.pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  const isProtectedPath =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/missions') ||
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname.startsWith('/squad') ||
    request.nextUrl.pathname.startsWith('/dossier') ||
    request.nextUrl.pathname.startsWith('/feedback') ||
    request.nextUrl.pathname.startsWith('/onboarding') ||
    request.nextUrl.pathname.startsWith('/quiz');
  const isBetaAccessPath = request.nextUrl.pathname.startsWith('/beta-access');
  const isOnboardingPath = request.nextUrl.pathname.startsWith('/onboarding');
  const isQuizPath = request.nextUrl.pathname.startsWith('/quiz');

  if (!isProtectedPath && !isBetaAccessPath) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (isProtectedPath && !sessionCookie) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("reason", "auth_required");
    signinUrl.searchParams.set("callbackURL", request.nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }

  let sessionData = null;
  let fromCache = false;

  if (sessionCookie) {
    const cacheCookie = request.cookies.get("hc_mw")?.value;
    if (cacheCookie) {
      try {
        sessionData = JSON.parse(atob(cacheCookie));
        fromCache = true;
      } catch {
        // ignore and fetch
      }
    }

    // ⚡ Perf: Essayer de décoder localement le JWE via getCookieCache (évite l'appel HTTP)
    if (!sessionData) {
      try {
        const decoded = await getCookieCache(request, {
          secret: process.env.BETTER_AUTH_SECRET,
        });
        if (decoded) {
          sessionData = decoded;
        }
      } catch (error) {
        console.error("🟢 [Middleware] local getCookieCache decryption failed:", error);
      }
    }

    // Fallback de sécurité : appel HTTP si getCookieCache a échoué ou est expiré
    if (!sessionData) {
      try {
        const requestHeaders = new Headers(request.headers);
        const baseUrl = request.nextUrl.origin;
        const response = await fetch(`${baseUrl}/api/auth/middleware-session`, {
          headers: requestHeaders,
          cache: 'no-store',
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          sessionData = await response.json();
        }
      } catch (error) {
        console.error("🟢 [Middleware] Session fetch failed:", error);
      }
    }
  }

  const session = sessionData?.session;
  const user = sessionData?.user;

  let nextResponse = NextResponse.next();

  if (session && user) {
    if (isBetaAccessPath) {
      const dest = !user.currentSituation ? "/onboarding"
        : !user.class ? "/quiz"
        : "/dashboard";
      nextResponse = NextResponse.redirect(new URL(dest, request.url));
    }

    if (isProtectedPath && !request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.includes('.')) {
      if (!user.betaKeyId && !isBetaAccessPath) {
        nextResponse = NextResponse.redirect(new URL("/beta-access", request.url));
      } else if (!user.currentSituation && !isOnboardingPath && !isQuizPath) {
        nextResponse = NextResponse.redirect(new URL("/onboarding", request.url));
      } else if (user.currentSituation && !user.class && !isQuizPath && !isOnboardingPath) {
        nextResponse = NextResponse.redirect(new URL("/quiz", request.url));
      }
    }
  }

  // Cache session data in cookie if fetched from API
  if (sessionData && !fromCache) {
    try {
      const encoded = btoa(JSON.stringify(sessionData));
      nextResponse.cookies.set("hc_mw", encoded, {
        maxAge: 300, // 5 minutes
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    } catch (e) {
      console.error("🟢 [Middleware] Failed to set session cache cookie:", e);
    }
  }

  return nextResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|woff2?|ttf|eot)|api/).*)",
  ],
};

export { proxy as middleware };
