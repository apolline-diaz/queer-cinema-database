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
        <div className="relative w-full sm:w-[300px] h-auto min-h-[200px] sm:min-h-0 sm:h-48 bg-center aspect-[3/4] sm:aspect-[16/9]">
          <Image
            src={image_url}
            fill={true}
            alt={title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover h-full w-full transform transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-50"
          />
          <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-md font-semibold uppercase">{title}</div>
            <p className="text-sm text-gray-300">{release_date}</p>
            <p className="absolute text-sm text-gray-200 mt-2">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
