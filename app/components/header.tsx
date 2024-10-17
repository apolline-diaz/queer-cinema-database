import Link from "next/link";
import { logout } from "../logout/actions";
import { createClient } from "@/utils/supabase/server";

export default async function Header() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  return (
    <>
      <div className="flex flex-row items-between justify-between mx-5 p-5 gap-10">
        <Link href="/" className="text-xl">
          movie <span className="text-pink-400">diary</span>
        </Link>
        <div className="flex flex-row items-center">
          <ul className="flex flex-row gap-5 items-center">
            <li>
              <Link
                href="/catalogue"
                className="hover:underline underline-offset-8 "
              >
                Catalogue
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  href="/profile"
                  className="hover:underline underline-offset-8"
                >
                  Profil
                </Link>
              </li>
            )}
            {!user ? (
              <li>
                <Link
                  href="/login"
                  className="hover:bg-pink-200 underline-offset-8 border border-black rounded-full p-2"
                >
                  Connexion
                </Link>
              </li>
            ) : (
              <li>
                <form action={logout}>
                  <button className="hover:bg-pink-200 underline-offset-8 border border-black rounded-full p-2">
                    Se déconnecter
                  </button>
                </form>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
