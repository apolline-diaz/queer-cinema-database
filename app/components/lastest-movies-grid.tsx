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
    <div className="relative mt-10">
      <div className="absolute text-center inset-0 z-10 flex flex-col justify-center items-center pointer-events-none px-10">
        <h2 className="font-bold sm:text-7xl md:text-7xl lg:text-8xl text-6xl">
          <span className="text-white uppercase drop-shadow-lg">
            Films & Archives{" "}
          </span>
          <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-400 drop-shadow-lg">
            LGBTQI+
          </span>
        </h2>
        <p className="font-thin text-xl">
          Une base de données pour le cinéma queer
        </p>
        {/* <Link
          href={`/movies`}
          className="border rounded-full px-2 py-1 border-pink-500 text-pink-500 hover:border-pink-500 hover:bg-pink-500 hover:text-white text-sm whitespace-nowrap flex-shrink-0"
        >
          Tous les films{" "}
          <Icon icon="mdi:chevron-right" className="inline size-4" />
        </Link> */}
      </div>

      {/* Grille responsive */}
      <div className="w-full aspect-[16/9]">
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
              <div className="relative overflow-hidden">
                {/* Image container */}
                <div className="relative w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={getImageUrl(movie.image_url || "")}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    title={movie.title}
                  />
                  <div className="absolute inset-0 bg-black/20" />
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
