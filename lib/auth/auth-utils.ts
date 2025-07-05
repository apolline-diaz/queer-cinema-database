import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

/**
 * Synchronizes user data between Supabase Auth and PostgreSQL
 * Call this in your auth callbacks or when needed
 */
export async function syncUserToDatabase(user: User): Promise<void> {
  try {
    const existingUser = await prisma.users.findUnique({
      where: { id: user.id },
    });

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
  } catch (error) {
    console.error("User synchronization error:", error);
    throw error; // Re-throw for proper error handling
  }
}

/**
 * Gets the current user from Supabase (server-side)
 * Use this in your server actions and API routes
 */
export async function getCurrentUser() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
