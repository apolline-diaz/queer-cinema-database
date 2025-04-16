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

  // Function to define if a link is active
  const isActive = (path: string) => {
    // Ror homepage
    if (path === "/" && pathname === "/") {
      return true;
    }
    // For other pages, check if the pathname starts with the path
    return path !== "/" && pathname.startsWith(path);
  };

  // Classe CSS for active links
  const activeLinkClass = "underline underline-offset-8 text-rose-500";
  const normalLinkClass = "hover:underline underline-offset-8";

  return (
    <div className="w-full fixed top-0 left-0 z-50 text-md bg-red-100">
      <div className="flex flex-row w-full items-center justify-between gap-10  px-10 py-3">
        {/* Logo */}
        <Link href="/">
          <h2 className="text-white text-xl xs:text-md">
            <span className="text-rose-500">queer</span>{" "}
            <span className="">videoclub</span>
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
                  className="absolute top-O right-0 px-8"
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
                <ul className="flex text-white flex-col items-center justify-between gap-5 h-full mt-6">
                  <div className="flex flex-col items-center justify-center gap-5">
                    <li
                      className={
                        pathname === "/movies"
                          ? activeLinkClass
                          : normalLinkClass
                      }
                    >
                      <Link href="/movies">Catalogue</Link>
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
                          isActive("/profile")
                            ? activeLinkClass
                            : normalLinkClass
                        }
                      >
                        <Link href="/profile" data-testid="profile-link-mobile">
                          Profil
                        </Link>
                      </li>
                    )}
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
                  </div>
                  <div className="py-10">
                    {!user ? (
                      <li className="hover:text-rose-500 hover:border-rose-500 py-1 px-3 rounded-full border ">
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
                  </div>
                </ul>
              </div>
            </section>

            {/* desktop menu */}
            <div className="text-white ">
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
                <li
                  className={
                    pathname === "/movies/create"
                      ? activeLinkClass
                      : normalLinkClass
                  }
                >
                  {userIsAdmin && <Link href="/movies/create">Contribuer</Link>}
                </li>
                <div className="pl-5">
                  {!user ? (
                    <li>
                      <Link
                        href="/login"
                        className="hover:text-rose-500 hover:border-rose-500 py-1 px-3 rounded-full border"
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
                </div>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
