import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// check is the user have a session, if he is connected
export async function auth() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
