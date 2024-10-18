import Image from "next/image";
import Link from "next/link";

interface CardProps {
  id: number;
  title: string;
  directors: {
    first_name: string;
    last_name: string;
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
      <div className="bg-gray-953 rounded-sm overflow-hidden h-full flex flex-col justify-between">
        {/* Responsive width, full on small screens, fixed on larger ones */}
        <div className="w-[300px] xs:w-[300px] sm:w-[400px] md:w-[500px] lg:w-[500px] relative h-56 bg-center">
          <Image
            src={image_url}
            fill={true}
            alt={title}
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col px-6 py-4 text-white uppercase justify-end">
            <div className="text-xl font-semi-bold line-clamp-2">{title}</div>
            <p className="inline-block text-base">
              <span className="font-extralight text-gray-952 mr-2">
                {release_date}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
