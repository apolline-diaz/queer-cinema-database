"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/utils/ensure-user-exist";

// Server action to Update user name

export async function updateUserName(formData: FormData) {
  const userSync = await ensureUserExists();

  if (!userSync.success) {
    return { type: "error", message: userSync.message, errors: null };
  }

  const supabase = createClient();

  try {
    // Check user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { error: "Invalid session. Please log in again." };
    }

    const fullName = formData.get("full_name") as string;

    if (!fullName || fullName.trim().length < 5) {
      return { error: "Le nom doit contenir au moins 5 caractères." };
    }

    // Update user metadata in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
      },
    });

    if (updateError) {
      return { error: "Error updating name." };
    }

    // Mise à jour dans la DB avec Prisma
    try {
      await prisma.users.update({
        where: { id: session.user.id },
        data: { full_name: fullName.trim() },
      });
    } catch (e) {
      console.warn("Prisma update error:", e);
      // On peut décider de ne pas retourner d’erreur ici
    }

    revalidatePath("/account/settings");
    return { success: "Name successfully updated!" };
  } catch (error) {
    console.error("UpdateUserName error:", error);
    return { error: "An unexpected error has occurred." };
  }
}
