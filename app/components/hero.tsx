import Image from "next/image";
import Link from "next/link";

// Define the CardProps interface
interface CardProps {
  id: number;
  title: string;
  // director: string;
  description: string;
  release_date: string;
  image_url: string;
}

export default function Hero({
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
      <div className="bg bg-gray-953 h-96">
        <div className="h-full relative bg-center">
          <Image
            src={image_url}
            fill={true}
            alt={title}
            style={{ objectFit: "cover" }}
          />
          <div className="absolute flex bg-black bg-opacity-20 items-end justify-start w-full h-full text-white font-semi-bold text-xl line-clamp-2 px-10 py-5">
            explorez le catalogue
          </div>
          <div className="absolute flex flex-col px-10 py-5 text-white uppercase items-start justify-end">
            <div className="text-xl font-semi-bold line-clamp-2">{title}</div>
            <p className="inline-block text-base">
              <span className=" font-extralight text-gray-952 mr-2">
                {release_date}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
