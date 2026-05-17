import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Fetch session from Better Auth API
  const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const sessionData = response.ok ? await response.json() : null;
  const session = sessionData?.session;
  const user = sessionData?.user;

  const isProtectedPath = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/community') ||
    request.nextUrl.pathname.startsWith('/missions') ||
    request.nextUrl.pathname.startsWith('/tools') ||
    request.nextUrl.pathname.startsWith('/settings');

  const isOnboardingPath = request.nextUrl.pathname.startsWith('/onboarding');
  const isQuizPath = request.nextUrl.pathname.startsWith('/quiz');

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (session && user) {
    // console.log("Middleware User State:", { path: request.nextUrl.pathname, situation: !!user.currentSituation, class: !!user.class, dream: !!user.dreamStatement });

    // 1. Check for Step 1: Initial Context (Country, Situation)
    if (!user.currentSituation && !isOnboardingPath && !isQuizPath && isProtectedPath) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // 2. Check for Step 2: Quiz (Psychometrics)
    if (user.currentSituation && !user.class && !isQuizPath && !isOnboardingPath && isProtectedPath) {
      return NextResponse.redirect(new URL("/quiz", request.url));
    }

    // 3. Check for Step 3: Post-Quiz (Dream, Focus, Blocker)
    const isPostQuizPath = request.nextUrl.pathname.startsWith('/onboarding/post-quiz');
    // Ensure we don't loop if the field is empty but the user is finishing Step 3
    if (user.class && !user.dreamStatement && !isPostQuizPath && isProtectedPath && !request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL("/onboarding/post-quiz", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/community/:path*",
    "/missions/:path*",
    "/tools/:path*",
    "/settings/:path*",
    "/dossier/:path*",
    "/dossier",
  ],
};
