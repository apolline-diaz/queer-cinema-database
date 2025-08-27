"use client";

import Link from "next/link";
import { Image } from "@/app/components/image";
import { getImageUrl } from "@/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";

interface CardProps {
  id: string;
  title: string;
  image_url?: string | null;
}

export default function Hero({ id, title, image_url }: CardProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/search?search=${encodeURIComponent(searchQuery)}&searchMode=field`
      );
    }
  };

  return (
    <>
      <div className="relative bg-rose-50 w-full overflow-hidden">
        <div className="relative w-full overflow-hidden h-[80vh]">
          <Image
            src={getImageUrl(image_url)}
            alt={title}
            className="object-cover h-full w-full"
            title={title}
          />
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
              <div className="flex flex-row items-center bg-white justify-center border rounded-xl px-4 border-rose-500">
                <input
                  type="text"
                  className="z-10 max-h-12  min-w-60 flex-1 py-4 bg-white  placeholder-gray-500 text-black font-light focus:outline-none"
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
                    className="text-black hover:cursor-pointer hover:text-rose-500 transition-colors"
                  />
                )}
              </div>
              <Link
                href="/movies"
                className="relative flex flex-row gap-1 font-semibold items-center bg-gradient-to-r from-rose-600 to-pink-600  hover:from-rose-700 hover:to-pink-700  transition-all duration-500 ease-in-out hover:text-white px-4 py-3 rounded-xl"
              >
                Découvrir tous les films
                <Icon icon="uis:angle-right" fontSize={25} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
