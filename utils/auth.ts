import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function auth() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
