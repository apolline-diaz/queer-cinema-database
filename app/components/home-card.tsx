"use client";

import { getImageUrl } from "@/utils";
import Link from "next/link";
import { Image } from "@/app/components/image";

interface CardProps {
  id: string;
  title: string;
  release_date?: string | null;
  image_url?: string | null;
}

export default function HomeCard({
  id,
  title,
  release_date = "",
  image_url,
}: CardProps) {
  return (
    <>
      <Link
        href={`/movies/${id}`}
        className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%] snap-start"
      >
        <div className="h-full">
          {/* Responsive width, full on small screens, fixed on larger ones */}
          <div className="group relative overflow-hidden w-full aspect-video bg-gray-900 transition-all duration-500">
            <Image
              src={getImageUrl(image_url)}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110"
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
              title={title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 w-full p-4">
              <div className="text-md leading-tight font-semibold">{title}</div>
              <p className="text-sm font-light">{release_date}</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
