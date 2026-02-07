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
      <Link href={`/movies/${id}`}>
        <div className="h-full">
          {/* Responsive width, full on small screens, fixed on larger ones */}
          <div className="group overflow-hidden relative w-full sm:w-[300px]  h-auto min-h-[200px] sm:min-h-0 bg-center aspect-[4/5] sm:aspect-[16/9]">
            <Image
              src={getImageUrl(image_url)}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              title={title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 w-full p-3">
              <div className="text-md font-semibold">{title}</div>
              <p className="text-sm font-light">{release_date}</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
