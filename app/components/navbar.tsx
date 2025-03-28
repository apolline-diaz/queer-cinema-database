"use client";

import Link from "next/link";
import { useState } from "react";
import { logout } from "../logout/actions";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user: User | null; // import or define User type
  userIsAdmin: boolean;
}

export default function Navbar({ user, userIsAdmin }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Fonction pour déterminer si un lien est actif
  const isActive = (path: string) => {
    // Pour la page d'accueil
    if (path === "/" && pathname === "/") {
      return true;
    }
    // Pour les autres pages, vérifier si le pathname commence par le path
    return path !== "/" && pathname.startsWith(path);
  };

  // Classe CSS pour les liens actifs
  const activeLinkClass = "underline underline-offset-8 text-rose-500";
  const normalLinkClass = "hover:underline underline-offset-8";

  return (
    <div className="w-full fixed top-0 left-0 z-50 text-md bg-neutral-950">
      <div className="flex flex-row w-full items-center justify-between gap-10  px-10 py-3">
        {/* Logo */}
        <Link href="/">
          <h2 className="text-white text-xl xs:text-md">
            movie <span className="text-rose-500">diary</span>
          </h2>
        </Link>

        {/* mobile menu icon */}
        <div>
          <nav className="">
            <section className="MOBILE-MENU flex lg:hidden">
              <button
                onClick={handleClick}
                className="HAMBURGER-ICON space-y-2"
              >
                <svg
                  data-testid="geist-icon"
                  height="16"
                  strokeLinejoin="round"
                  viewBox="0 0 16 16"
                  width="16"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 2H1.75H14.25H15V3.5H14.25H1.75H1V2ZM1 12.5H1.75H14.25H15V14H14.25H1.75H1V12.5ZM1.75 7.25H1V8.75H1.75H14.25H15V7.25H14.25H1.75Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>

              {/* mobile menu */}
              <div
                className={`absolute top-0 right-0 h-screen w-1/2 xs:w-1/2 sm:w-1/2 bg-neutral-950 md:w-1/3 p-4 transform ${
                  isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 ease-in-out`}
              >
                {/* close button */}
                <button
                  onClick={handleClick}
                  className="absolute top-8 right-8"
                >
                  <svg
                    className="h-5 w-5 text-gray-black hover:text-rose-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* mobile navigation links */}
                <ul className="flex text-white flex-col items-center justify-center gap-5 min-h-[250px]">
                  <li
                    className={
                      pathname === "/movies" ? activeLinkClass : normalLinkClass
                    }
                  >
                    <Link href="/movies">Catalogue</Link>
                  </li>
                  <li
                    className={
                      pathname === "/movies/create"
                        ? activeLinkClass
                        : normalLinkClass
                    }
                  >
                    {userIsAdmin && (
                      <Link href="/movies/create">Contribuer</Link>
                    )}
                  </li>
                  <li
                    className={
                      isActive("/stats") ? activeLinkClass : normalLinkClass
                    }
                  >
                    <Link href="/stats">Statistiques</Link>
                  </li>
                  {user && (
                    <li
                      className={
                        isActive("/profile") ? activeLinkClass : normalLinkClass
                      }
                    >
                      <Link href="/profile" data-testid="profile-link-mobile">
                        Profil
                      </Link>
                    </li>
                  )}
                  {!user ? (
                    <li className="hover:text-rose-500 hover:border-rose-500 py-2 px-3 rounded-full border ">
                      <Link href="/login">Connexion</Link>
                    </li>
                  ) : (
                    <li>
                      <form action={logout}>
                        <button className="hover:text-rose-500 hover:border-rose-500 py-1 px-3 rounded-full border ">
                          Se déconnecter
                        </button>
                      </form>
                    </li>
                  )}
                </ul>
              </div>
            </section>

            {/* desktop menu */}
            <div className="text-white">
              <ul className="DESKTOP-MENU hidden space-x-12 lg:flex  items-center">
                <li
                  className={
                    pathname === "/movies" ? activeLinkClass : normalLinkClass
                  }
                >
                  <Link href="/movies">Catalogue</Link>
                </li>

                <li
                  className={
                    pathname === "/movies/create"
                      ? activeLinkClass
                      : normalLinkClass
                  }
                >
                  {userIsAdmin && <Link href="/movies/create">Contribuer</Link>}
                </li>
                <li
                  className={
                    isActive("/stats") ? activeLinkClass : normalLinkClass
                  }
                >
                  <Link href="/stats">Statistiques</Link>
                </li>
                {user && (
                  <li
                    className={
                      isActive("/profile") ? activeLinkClass : normalLinkClass
                    }
                  >
                    <Link href="/profile" data-testid="profile-link-desktop">
                      Profil
                    </Link>
                  </li>
                )}
                {!user ? (
                  <li>
                    <Link
                      href="/login"
                      className="hover:text-rose-500 hover:border-rose-500 py-2 px-3 rounded-full border"
                    >
                      Connexion
                    </Link>
                  </li>
                ) : (
                  <li>
                    <form action={logout}>
                      <button className="hover:text-rose-500 hover:border-rose-500 py-1 px-3 rounded-full border ">
                        Se déconnecter
                      </button>
                    </form>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
