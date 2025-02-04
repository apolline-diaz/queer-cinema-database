import Image from "next/image";
import Link from "next/link";

interface CardProps {
  id: number;
  title: string;
  directors: {
    name: string;
  } | null;
  description: string;
  release_date: string;
  image_url: string;
}

export default function Card({
  id,
  title,
  description,
  release_date,
  image_url,
}: CardProps) {
  const isSupabaseImage = image_url.startsWith(
    "https://xcwrhyjbfgzsaslstssc.supabase.co"
  );
  const isMubiImage = image_url.startsWith("https://images.mubicdn.net");

  return (
    <Link
      href={{
        pathname: `/movies/${id}`,
        query: {
          id,
          title,
          description: encodeURI(description),
          release_date,
          image_url,
        },
      }}
    >
      <div className="group overflow-hidden flex flex-col items-left transition-transform">
        <div className="relative w-full h-48 overflow-hidden ">
          <Image
            src={image_url}
            fill={true}
            alt={title}
            className="object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/640x360";
            }}
          />
        </div>
      </div>
      <div className="text-left text-white mt-4">
        <div className="text-md font-semibold uppercase">{title}</div>
        <p className="text-sm text-gray-300">{release_date}</p>
      </div>
    </Link>
  );
}
