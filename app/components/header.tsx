import { createClient } from "@/utils/supabase/server";
import Navbar from "./navbar";
import { isAdmin } from "@/utils/is-user-admin";

async function Header() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user || null;
  const userIsAdmin = await isAdmin();

  // pass the user data as a prop to the Header component
  return <Navbar user={user} userIsAdmin={userIsAdmin} />;
}

export default Header;
