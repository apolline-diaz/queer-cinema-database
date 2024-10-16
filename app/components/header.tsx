import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="flex flex-row items-between justify-between mx-5 p-5 gap-10">
        <Link href="/" className="text-xl">
          movie <span className="text-pink-400">diary</span>
        </Link>
        <div className="flex flex-row items-center">
          <ul className="flex flex-row gap-5">
            <li>
              <Link
                href="/catalogue"
                className="hover:underline underline-offset-8 "
              >
                Catalogue
              </Link>
            </li>
            <li>
              <Link
                href="/upload"
                className="hover:underline underline-offset-8"
              >
                Ajouter un film
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="hover:bg-pink-200 underline-offset-8 border border-black rounded-full p-2"
              >
                Connexion
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
