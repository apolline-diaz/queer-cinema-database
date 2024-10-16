import Image from "next/image";
import Link from "next/link";
import Searchbox from "./searchbox";

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
    <div className="bg bg-gray-953 h-96 w-full justify-center items-center">
      <Link
        href={{
          pathname: `/catalogue`,
          // href={{
          //    pathname: `/movies/${id}`,
          query: {
            id,
            title,
            description: encodeURI(description),
            release_date,
            image_url,
          },
        }}
      >
        <div className="h-full w-full relative bg-center">
          <Image
            src={image_url}
            fill={true}
            alt={title}
            style={{ objectFit: "cover" }}
          />
          <div className="text-center absolute flex bg-black bg-opacity-50 items-center justify-center w-full h-full text-white font-light text-xl line-clamp-2 px-10 py-5">
            <div className="flex flex-col">
              <span className="m-5">Explorez le catalogue</span>
              {/* 
              <div className="w-full">
                <Searchbox />
              </div> */}
            </div>
          </div>
          {/* <div className="absolute flex flex-col px-10 py-5 text-white uppercase items-start justify-end">
            <div className="text-xl font-semi-bold line-clamp-2">{title}</div>
            <p className="inline-block text-base">
              <span className=" font-extralight text-gray-952 mr-2">
                {release_date}
              </span>
            </p>
          </div> */}
        </div>
      </Link>
    </div>
  );
}
