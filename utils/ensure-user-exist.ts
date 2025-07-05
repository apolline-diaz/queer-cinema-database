"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function ensureUserExists() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    // Attempts to create the user, silently ignores if it already exists
    await prisma.users.upsert({
      where: { id: data.user.id },
      update: {}, // Does not update any existing fields
      create: {
        id: data.user.id,
        email: data.user.email!,
        created_at: new Date(),
      },
    });

    return { success: true, message: "User synchronized" };
  } catch (err) {
    console.error("Errror when user synchronization:", err);
    return { success: false, message: "Error of synchronzation" };
  }
}
