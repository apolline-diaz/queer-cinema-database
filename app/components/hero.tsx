"use client";

import Link from "next/link";
import { Image } from "@/app/components/image";
import Searchfield from "./searchfield";
import { getImageUrl } from "@/utils";

interface CardProps {
  id: string;
  title: string;
  image_url?: string | null;
}

export default function Hero({ id, title, image_url }: CardProps) {
  return (
    <div className="relative bg-gray-953 h-96 w-full">
      <Image
        src={getImageUrl(image_url)}
        alt={title}
        className="object-cover h-full w-full"
        title={title}
      />
      <div className="absolute inset-0 flex flex-col justify-center items-left px-10 py-5">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        <div className="relative sm:w-[70%] xs:w-[100%] mb-5">
          <h2 className="text-2xl font-medium text-white">
            Le site de référence pour découvrir l&apos;histoire du cinéma{" "}
            <span className="text-transparent text-bold bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500">
              LGBTQI+
            </span>{" "}
            et ses archives.
          </h2>
        </div>

        <Link
          href="/movies"
          className="relative w-[225px] flex flex-row gap-3 items-center bg-gradient-to-r from-rose-500 to-red-500 text-white
            px-4 py-2 rounded-full hover:from-rose-600 hover:to-red-600"
        >
          Explorer le catalogue
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l73.4 73.4H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h370.7l-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
