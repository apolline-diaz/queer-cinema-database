"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

// Nouvelle action de réinitialisation de mot de passe
export async function resetPassword(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    redirect("/forgot-password?error=" + encodeURIComponent(error.message));
  }

  // Redirigez vers une page de confirmation
  redirect("/forgot-password/confirmation");
}
