"use client";

import * as React from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getImageUrl } from "@/utils";
import { Prisma } from "@prisma/client";

type MovieWithIncludes = Prisma.moviesGetPayload<{
  include: {
    movies_genres: { include: { genres: true } };
    movies_directors: { include: { directors: true } };
    movies_countries: { include: { countries: true } };
  };
}> & {
  links?: { url: string; label?: string }[]; // ajout du champ links
};

interface WatchCarouselProps {
  movies: MovieWithIncludes[];
}

export function WatchCarousel({ movies }: WatchCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {movies.map((movie) => (
          <CarouselItem key={`${movie.title}-${movie.id}`}>
            <div className="relative w-full h-[600px]">
              <Link
                href={`/movies/${movie.id}`}
                className="h-full w-full overflow-hidden block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(movie.image_url || "")}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="bg-black/10 absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/100 z-10" />
                <div className="absolute bottom-10 px-[clamp(1.25rem,5vw,2.5rem)] flex flex-col gap-1 text-left z-20">
                  <h3 className="text-2xl font-medium text-white w-3/4 sm:w-1/2">
                    {movie.title}
                  </h3>
                  <p className="text-md font-medium flex flex-wrap gap-2 text-white">
                    {movie?.movies_directors
                      ?.map((item) => item.directors.name)
                      .filter(Boolean)
                      .join(", ") || ""}{" "}
                    <span className="text-md font-light">
                      {movie.release_date || ""}
                    </span>
                  </p>
                  <p className="line-clamp-5 sm:text-left w-full sm:w-1/2 overflow-hidden text-md font-extralight text-white">
                    {movie.description || ""}
                  </p>
                </div>
              </Link>

              {/* Boutons de visionnage externes - sortis du Link */}
              {movie.links && movie.links.length > 0 && (
                <div className="absolute bottom-4 left-[clamp(1.25rem,5vw,2.5rem)] z-30">
                  <div className="flex flex-wrap gap-2">
                    {movie.links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-200 px-4 py-2 bg-white text-black hover:text-white hover:bg-gray-800 rounded-xl hover:opacity-90"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Voir le film
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
