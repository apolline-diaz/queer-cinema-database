"use client";

import { Image } from "@/app/components/image";
import Link from "next/link";

interface List {
  id: string;
  title: string;
  description?: string;
  lists_movies: {
    movie: {
      id: string;
      image_url?: string | null;
      title: string;
    };
  }[];
}

interface ListCardProps {
  list: List;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const firstMoviePoster = list.lists_movies[0]?.movie?.image_url;

  return (
    <div className="gap-4">
      <Link href={`/lists/${list.id}`}>
        <div className="group rounded-xl overflow-hidden flex flex-col transition-transform">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={firstMoviePoster}
              fill={true}
              alt={list.title}
              className="object-cover w-full h-full  transform transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-50"
              title={list.title}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col p-4 text-white uppercase justify-end">
              <div className="text-xl font-semibold line-clamp-2">
                {list.title}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
