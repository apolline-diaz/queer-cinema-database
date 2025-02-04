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

export default function HomeCard({
  id,
  title,
  description,
  release_date,
  image_url,
}: CardProps) {
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
      <div className="group bg-gray-950 overflow-hidden h-full flex flex-col justify-between">
        {/* Responsive width, full on small screens, fixed on larger ones */}
        <div className="w-[300px] relative h-48 bg-center">
          <Image
            src={image_url}
            fill={true}
            alt={title}
            className="object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
        </div>
        <div className="text-left text-white mt-4">
          <div className="text-md font-semibold uppercase truncate">
            {title}
          </div>
          <p className="text-sm text-gray-300">{release_date}</p>
        </div>
      </div>
    </Link>
  );
}
