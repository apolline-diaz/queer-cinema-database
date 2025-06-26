"use client";

import Link from "next/link";
import { Image } from "@/app/components/image";
import { getImageUrl } from "@/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/movies?search=${encodeURIComponent(searchQuery)}&searchMode=field`
      );
    }
  };

  return (
    <>
      <div className="relative bg-rose-50 w-full overflow-hidden">
        <div
          className="relative w-full overflow-hidden h-[70vh] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://xcwrhyjbfgzsaslstssc.supabase.co/storage/v1/object/public/storage//1749767151774-chocolate_babies.webp')",
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center px-10 gap-y-8">
            <div className="relative w-4/5 sm:text-7xl text-5xl">
              <h2 className="text-center font-bold">
                <span className="text-white uppercase">Films & Archives </span>
                {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 via-green-400 via-blue-500 to-violet-500"> */}
                <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-rose-500  via-blue-500  to-yellow-400">
                  LGBTQI+
                </span>
              </h2>
            </div>
            {/* Barre de recherche qui redirige vers /movies */}
            <div className="z-10 flex flex-col sm:flex-row gap-5 justify-center items-center">
              <div className="flex flex-row items-center bg-white justify-center border rounded-xl px-4 border-rose-900">
                <input
                  type="text"
                  className="z-10 max-h-12  min-w-60 flex-1 py-4 bg-white  placeholder-rose-900 text-rose-900 font-light focus:outline-none"
                  placeholder="Rechercher un titre, mot-clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                {isSearching ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                ) : (
                  <Icon
                    icon="radix-icons:magnifying-glass"
                    fontSize={20}
                    onClick={handleSearch}
                    className="text-rose-900 hover:cursor-pointer hover:text-rose-500 transition-colors"
                  />
                )}
              </div>
              <Link
                href="/movies"
                className="relative flex flex-row gap-1 items-center bg-rose-900 text-white transition-colors duration-200 ease-in-out px-4 py-3 rounded-xl  hover:bg-rose-500"
              >
                Explorer le catalogue
                <Icon icon="uis:angle-right" fontSize={25} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
