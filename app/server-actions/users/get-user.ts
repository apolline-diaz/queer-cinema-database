"use server";

import { createClient } from "@/utils/supabase/server";

export async function getUser() {
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { user: null, error: "User non authenticated" };
    }

    const { data: account, error: accountError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || account?.full_name || "",
        ...account,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error getUser:", error);
    return { user: null, error: "Error data fetching" };
  }
}
