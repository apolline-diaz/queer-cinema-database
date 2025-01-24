"use client";

import Image from "next/image";
import Link from "next/link";

interface ListCardProps {
  id: number;
  title: string;
  image_url: string;
}

export default function ListCard({ id, title, image_url }: ListCardProps) {
  const isSupabaseImage = image_url.startsWith(
    "https://xcwrhyjbfgzsaslstssc.supabase.co"
  );
  const isMubiImage = image_url.startsWith("https://images.mubicdn.net");

  return (
    <div className="gap-4">
      <Link
        href={{
          pathname: `/lists/${id}`,
          query: { id, title, image_url },
        }}
      >
        <div className="bg-gray-953 rounded-sm overflow-hidden h-full flex flex-col justify-between">
          <div className="w-full relative h-56 bg-center">
            <Image
              src={image_url}
              fill={true}
              alt={title}
              style={{ objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/640x360";
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col p-4 text-white uppercase justify-end">
              <div className="text-xl font-semi-bold line-clamp-2">{title}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
