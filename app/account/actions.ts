"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function resetPassword(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/reset-password`,
  });

  if (error) {
    redirect("/forgot-password?error=" + encodeURIComponent(error.message));
  }

  redirect("/forgot-password/confirmation");
}
