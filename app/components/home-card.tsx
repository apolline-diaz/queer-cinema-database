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
        <div className="group overflow-hidden rounded-xl h-full flex flex-col justify-between">
          {/* Responsive width, full on small screens, fixed on larger ones */}
          <div className="relative w-full sm:w-[300px] h-auto min-h-[300px] sm:min-h-0 sm:h-72 bg-center aspect-[3/4] sm:aspect-[16/9]">
            <Image
              src={getImageUrl(image_url)}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-50"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              title={title}
            />

            <div className="bottom-0 absolute w-full p-5">
              <div className="text-md font-semibold uppercase">{title}</div>
              <p className="text-sm font-light">{release_date}</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
