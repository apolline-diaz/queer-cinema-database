"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Server action to Update user name

export async function updateUserName(formData: FormData) {
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

    // If you have a users table in your database
    // You can also update it there.
    const { error: accountError } = await supabase
      .from("users")
      .update({ full_name: fullName.trim() })
      .eq("id", session.user.id);

    if (accountError) {
      console.warn("Account update error:", accountError);
      // Do not return error because auth is updated
    }

    revalidatePath("/account/settings");
    return { success: "Name successfully updated!" };
  } catch (error) {
    console.error("UpdateUserName error:", error);
    return { error: "An unexpected error has occurred." };
  }
}
