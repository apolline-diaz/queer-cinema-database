"use client";

import { getImageUrl } from "@/utils";
import { SafeImage } from "@/app/components/safe-image";
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
  console.log("Original image URL:", image_url);
  console.log("Processed image URL:", getImageUrl(image_url));
  return (
    <>
      <Link href={`/movies/${id}`}>
        <div className="group overflow-hidden flex flex-col transition-transform">
          <div className="relative w-full h-48 overflow-hidden ">
            <SafeImage
              image_url={image_url}
              fill={true}
              title={title}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-50"
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
