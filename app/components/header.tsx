import { createClient } from "@/utils/supabase/server";
import Navbar from "./navbar";

async function Header() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user || null;

  // pass the user data as a prop to the Header component
  return <Navbar user={user} />;
}

export default Header;
