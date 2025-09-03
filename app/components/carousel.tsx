"use client";

import * as React from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
// import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getImageUrl } from "@/utils";

interface Movie {
  id: number;
  title: string;
  description?: string | null;
  release_date?: string | null;
  image_url?: string | null;
  movies_directors?: Array<{
    directors: {
      name: string;
    };
  }>;
}

interface LatestMoviesCarouselProps {
  movies: Movie[];
}

export function LatestMoviesCarousel({ movies }: LatestMoviesCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  // Prendre seulement les 3 premiers films
  const featuredMovies = movies.slice(0, 3);

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {featuredMovies.map((movie) => (
          <CarouselItem key={`${movie.title}-${movie.id}`}>
            <div className="relative w-full h-[400px]">
              <Link
                href={`/movies/${movie.id}`}
                className="h-full w-full overflow-hidden block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(movie.image_url || "")}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="bg-black/10 absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/100 z-10 rounded-xl" />
                <div className="absolute sm:bottom-10 bottom-5 px-5 sm:px-10 flex flex-col gap-1 text-left z-20">
                  <h3 className="text-2xl font-medium text-white">
                    {movie.title}
                  </h3>
                  <p className="text-md font-medium flex flex-wrap gap-2 text-white">
                    {movie?.movies_directors
                      ?.map((item) => item.directors.name)
                      .filter(Boolean) // Filtre les noms null
                      .join(", ") || ""}
                    <span className="text-md font-light">
                      {movie.release_date || ""}
                    </span>
                  </p>
                  <p className="line-clamp-4 sm:line-clamp-3 text-justify sm:text-left w-full sm:w-3/4 overflow-hidden text-md font-extralight text-white">
                    {movie.description || ""}
                  </p>
                </div>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
