"use client";

import Image from "next/image";
import Link from "next/link";

interface ListCardProps {
  id: number;
  title: string;
  imageUrl: string;
}

export default function ListCard({ id, title, imageUrl }: ListCardProps) {
  const isSupabaseImage = imageUrl.startsWith(
    "https://xcwrhyjbfgzsaslstssc.supabase.co"
  );
  const isMubiImage = imageUrl.startsWith("https://images.mubicdn.net");

  return (
    <div className="gap-4">
      <Link
        href={{
          pathname: `/lists/${id}`,
          query: { id, title, imageUrl },
        }}
      >
        <div className="bg-gray-953 rounded-sm overflow-hidden h-full flex flex-col justify-between">
          <div className="w-full relative h-48 bg-center">
            <Image
              src={imageUrl}
              fill={true}
              alt={title}
              className="object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/640x360";
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col p-4 text-white uppercase justify-end">
              <div className="text-xl font-semibold line-clamp-2">{title}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
