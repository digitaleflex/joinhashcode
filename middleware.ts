import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie, getCookieCache } from "better-auth/cookies";

const PROTECTED_PATHS = ["/dashboard", "/missions", "/settings", "/squad", "/dossier", "/feedback", "/onboarding", "/quiz", "/reviewer"];

export async function proxy(request: NextRequest) {
  if (request.headers.get("x-middleware-subrequest")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Normalise www → non-www pour éviter les erreurs state_mismatch OAuth
  // (le cookie d'état est lié au domaine de la requête initiale)
  const host = request.headers.get("host") || "";
  if (host.startsWith("www.")) {
    const url = new URL(request.url);
    url.host = host.replace("www.", "");
    return NextResponse.redirect(url, 308);
  }

  const pathname = request.nextUrl.pathname;
  const isProtectedPath = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isOnboardingPath = pathname.startsWith("/onboarding");
  const isQuizPath = pathname.startsWith("/quiz");

  if (pathname.startsWith("/beta-access")) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (process.env.MAINTENANCE_MODE === "true" && pathname !== "/maintenance") {
    if (pathname === "/signin" || pathname === "/feedback") {
      return NextResponse.json(
        { error: "Service temporairement indisponible pour maintenance" },
        { status: 503 }
      );
    }
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (isProtectedPath && !sessionCookie) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("reason", "auth_required");
    signinUrl.searchParams.set("callbackURL", pathname);
    return NextResponse.redirect(signinUrl);
  }

  let sessionData: { session?: unknown; user?: Record<string, unknown> } | null = null;

  if (sessionCookie) {
    try {
      const decoded = await getCookieCache(request, {
        secret: process.env.BETTER_AUTH_SECRET,
      });
      if (decoded) {
        sessionData = decoded;
      }
    } catch {
      // Fallback HTTP si le décodage JWE échoue
    }

    if (!sessionData) {
      try {
        const requestHeaders = new Headers(request.headers);
        const response = await fetch(`http://127.0.0.1:3000/api/auth/middleware-session`, {
          headers: requestHeaders,
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
          sessionData = await response.json();
        }
      } catch {
        // Session indisponible — la route gérera l'auth elle-même
      }
    }
  }

  const session = sessionData?.session;
  const user = sessionData?.user;
  let nextResponse = NextResponse.next();

  if (session && user) {
    const isDeactivated = user.deactivatedAt && new Date(user.deactivatedAt as string) <= new Date();
    const isBanned = (user as Record<string, unknown>).banned === true;

    if (isDeactivated || isBanned) {
      if (pathname === "/reactivate") return nextResponse;
      if (pathname.startsWith("/signin")) return nextResponse;
      if (!pathname.startsWith("/api")) {
        return NextResponse.redirect(new URL("/reactivate", request.url));
      }
      return NextResponse.json({ error: "Compte désactivé" }, { status: 403 });
    }

    const needsOnboarding = !user.currentSituation;
    const needsQuiz = user.currentSituation && !user.class;

    if (isProtectedPath && !pathname.startsWith("/api") && !pathname.includes(".")) {
      if (needsOnboarding && !isOnboardingPath && !isQuizPath) {
        nextResponse = NextResponse.redirect(new URL("/onboarding", request.url));
      } else if (needsQuiz && !isQuizPath && !isOnboardingPath) {
        nextResponse = NextResponse.redirect(new URL("/quiz", request.url));
      }
    }
  }

  return nextResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\.ico|.*\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|woff2?|ttf|eot)|api/).*)",
  ],
};

export { proxy as middleware }
