"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/utils/ensure-user-exist";
import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = createClient();

  try {
    // Get session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session || !session.user) {
      return { user: null, error: "Not authenticated" };
    }

    const user = session.user;

    // Ensure user exists in the DB
    const userSync = await ensureUserExists();
    if (!userSync.success) {
      return { user: null, error: userSync.message };
    }

    const dbUser = await prisma.users.findUnique({
      where: { id: user.id },
    });

    if (!user.email) {
      return { user: null, error: "Missing email for this user" };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || dbUser?.full_name || "",
        ...dbUser,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error getUser:", error);
    return { user: null, error: "Error data fetching" };
  }
}
