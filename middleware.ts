import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware focused ONLY on:
 * 1. Session management with proper cookie handling
 * 2. Route protection
 *
 * User synchronization moved to utilities for better separation of concerns
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create Supabase server client with proper cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route protection - redirect unauthenticated users
  if (!user && !isPublicRoute(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

/**
 * Helper function to determine if a route is public
 * Centralized route configuration for better maintainability
 */
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/about",
    "/movies",
    "/catalogue",
    "/contact",
    "/stats",
  ];

  return (
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/auth/")
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
