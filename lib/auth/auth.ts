import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

/**
 * Quick authentication check - returns only if user is authenticated
 * Used if need to check if user is logged in
 */
export async function auth() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
