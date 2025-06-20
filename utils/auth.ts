import { createClient } from "@/utils/supabase/server";

// check is the user have a session, if he is connected
export async function auth() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
