import Link from "next/link";

export default function Header() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start mx-5">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Films</a>
            </li>
            <li>
              <a>Séries</a>
            </li>
            <li>
              <a>Listes</a>
            </li>
            <li>
            <Link href="/movies/upload">Ajouter un film</Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="text-xl">
          movie diary
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex mx-5">
        <ul className="menu menu-horizontal rounded-full px-1">
          <li>
            <a className="rounded-full">Films</a>
          </li>
          <li>
            <a className="rounded-full">Séries</a>
          </li>
          <li>
            <a className="rounded-full">Listes</a>
          </li>
          <li>
            <Link href="/movies/upload" className="rounded-full">
              Ajouter un film
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end mx-5">
        <Link href="/login" className="hover:underline underline-offset-8 p-5">
          Connexion
        </Link>
      </div>
    </div>
  );
}
