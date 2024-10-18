"use client";

import Link from "next/link";
import { useState } from "react";
import { logout } from "../logout/actions";
import { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null; // import or define User type
}

export default function Navbar({ user }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-white">
      <div className="flex flex-row w-full items-between justify-between gap-10 border-b border-gray-400 p-5">
        {/* Logo */}
        <Link href="/">
          movie <span className="text-pink-400">diary</span>
        </Link>

        {/* mobile menu icon */}
        <div>
          <nav className="">
            <section className="MOBILE-MENU flex lg:hidden">
              <button
                onClick={handleClick}
                className="HAMBURGER-ICON space-y-2"
              >
                <span className="block h-0.5 w-8 bg-gray-600"></span>
                <span className="block h-0.5 w-8 bg-gray-600"></span>
                <span className="block h-0.5 w-8 bg-gray-600"></span>
              </button>

              {/* mobile menu */}
              <div
                className={`absolute top-0 right-0 h-screen w-1/2 xs:w-1/2 sm:w-1/2 md:w-1/3 bg-white p-4 transform ${
                  isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 ease-in-out`}
              >
                {/* close button */}
                <button
                  onClick={handleClick}
                  className="absolute top-8 right-8"
                >
                  <svg
                    className="h-8 w-8 text-gray-600"
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
                <ul className="flex flex-col items-center justify-center gap-5 min-h-[250px]">
                  <li className="border-b border-gray-400">
                    <Link href="/catalogue">Catalogue</Link>
                  </li>
                  {user && (
                    <li className="border-b border-gray-400">
                      <Link href="/profile">Profil</Link>
                    </li>
                  )}
                  {!user ? (
                    <li className="border-b border-gray-400">
                      <Link href="/login">Connexion</Link>
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
            </section>

            {/* desktop menu */}
            <div className="items-between justify-between">
              <ul className="DESKTOP-MENU hidden space-x-8 lg:flex">
                <li>
                  <Link href="/catalogue">Catalogue</Link>
                </li>
                {user && (
                  <li>
                    <Link href="/profile">Profil</Link>
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
          </nav>
        </div>
      </div>
    </div>
  );
}
