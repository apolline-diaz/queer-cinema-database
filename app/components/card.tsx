"use client";

import { getImageUrl } from "@/utils";
import { Image } from "@/app/components/image";
import Link from "next/link";

interface CardProps {
  id: string;
  title: string;
  release_date?: string | null;
  image_url?: string | null;
}

export default function Card({
  id,
  title,
  release_date,
  image_url,
}: CardProps) {
  return (
    <>
      <Link href={`/movies/${id}`}>
        <div className="group rounded-md overflow-hidden flex flex-col transition-transform">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={getImageUrl(image_url)}
              fill={true}
              alt={title}
              className="object-cover w-full h-full  transform transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-50"
              title={title}
            />
            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-md font-semibold uppercase">{title}</div>
              <p className="text-sm text-gray-300">{release_date}</p>
              {/* <p className="absolute text-sm text-gray-200 mt-2">{description}</p> */}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
