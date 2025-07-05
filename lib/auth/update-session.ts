import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Create a response object that will be modified with updated cookies
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create Supabase server client with proper cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Get all cookies from the incoming request
        getAll() {
          return request.cookies.getAll();
        },
        // Set cookies on both request and response objects
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          // Create new response with updated request
          supabaseResponse = NextResponse.next({
            request,
          });
          // Set cookies on the response object to send back to client
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Get the current authenticated user from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Synchronize user data between Supabase Auth and Prisma database
  if (user) {
    try {
      // Check if user exists in our PostgreSQL database
      const existingUser = await prisma.users.findUnique({
        where: { id: user.id },
      });

      // Create user in our database if he doesn't exist
      // This happens when a user signs up via Supabase Auth
      if (!existingUser) {
        await prisma.users.create({
          data: {
            id: user.id,
            email: user.email!,
            role: "user",
            created_at: new Date(),
          },
        });
      }
    } catch (err) {
      console.error("User synchronization error:", err);
      // Note: We don't throw here to avoid breaking the middleware flow
    }
  }
  // Protect routes that require authentication
  // Allow access to public pages even without authentication
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/") &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // Redirect unauthenticated users to login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
