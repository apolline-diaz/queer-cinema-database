"use client";

import Link from "next/link";
import { getImageUrl } from "@/utils";
import { Prisma } from "@prisma/client";
import { Icon } from "@iconify/react";
import { Image } from "@/app/components/image";

type MovieWithIncludes = Prisma.moviesGetPayload<{
  include: {
    movies_genres: {
      include: { genres: true };
    };
    movies_directors: {
      include: { directors: true };
    };
    movies_countries: {
      include: { countries: true };
    };
    movies_keywords: {
      include: { keywords: true };
    };
  };
}>;

interface LatestMoviesGridProps {
  movies: MovieWithIncludes[];
}

export function LatestMoviesGrid({ movies }: LatestMoviesGridProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pointer-events-none">
        <h2 className="text-center font-bold sm:text-7xl md:text-7xl lg:text-8xl text-5xl px-10">
          <span className="text-white uppercase drop-shadow-lg">
            Films & Archives{" "}
          </span>
          <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-400">
            LGBTQI+
          </span>
        </h2>
        {/* <Link
          href={`/movies`}
          className="border rounded-full px-2 py-1 border-pink-500 text-pink-500 hover:border-pink-500 hover:bg-pink-500 hover:text-white text-sm whitespace-nowrap flex-shrink-0"
        >
          Tous les films{" "}
          <Icon icon="mdi:chevron-right" className="inline size-4" />
        </Link> */}
      </div>

      {/* Grille responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => {
          const director = movie.movies_directors?.[0]?.directors.name;
          const releaseYear = movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : null;
          const genres = movie.movies_genres
            ?.map((item) => item.genres.name)
            .filter(Boolean)
            .slice(0, 3);

          return (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="group relative"
            >
              <div className="relative overflow-hidden transition-all duration-500 transform ">
                {/* Image container */}
                <div className="relative w-full aspect-video overflow-hidden bg-gray-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={getImageUrl(movie.image_url || "")}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    title={movie.title}
                  />
                  <div className="absolute inset-0 bg-black/20" />

                  {/* Infos sur l’image */}
                  {/* <div className="absolute inset-0 p-3 flex flex-col justify-end transition-opacity duration-300">
                    <h3 className="text-xs font-semibold leading-tight text-white  line-clamp-2">
                      {movie.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-2 items-center text-white ">
                      {director && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="line-clamp-1">{director}</span>
                        </div>
                      )}{" "}
                      {releaseYear && (
                        <div className="flex items-center gap-2 text-xs font-light text-white/90">
                          <span>{releaseYear}</span>
                        </div>
                      )}
                    </div> 
                  </div> */}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Message si pas de films */}
      {movies.length === 0 && (
        <div className="text-center py-12">
          <Icon
            icon="mdi:movie-open-outline"
            className="text-6xl text-gray-300 mx-auto mb-4"
          />
          <p className="text-gray-500 text-lg">
            Aucun film disponible pour le moment
          </p>
        </div>
      )}
    </div>
  );
}
