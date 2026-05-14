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
      <div className="absolute text-center inset-0 z-10 flex flex-col justify-center items-center px-10 gap-6">
        {" "}
        {/* pointer-events-none pour rendre l'image cliquable vers la fiche film */}
        <h2 className="font-bold sm:text-7xl md:text-7xl lg:text-8xl text-5xl">
          <span className="bg-white inline-block text-black uppercase line-clamp-2">
            Films / Archives{" "}
          </span>
          <br />
          <span className="bg-white inline-block px-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-400">
              LGBTQI+
            </span>
          </span>
        </h2>
        {/* <p className="font-light text-md sm:text-xl mx-10 my-3 mb-10 px-2 text-white inline-block">
          Une base de données pour le cinéma queer
        </p> */}
        <Link
          href={`/movies`}
          className="border rounded-md py-2 px-4 border-white text-white hover:border-pink-500 hover:text-pink-500 text-sm sm:text-lg whitespace-nowrap"
        >
          Explorer la base de données{" "}
          {/* <Icon icon="mdi:chevron-right" className="inline size-4" /> */}
        </Link>
      </div>

      {/* Grille responsive */}
      <div className="w-full aspect-[4/5] max-h-[85vh]">
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
              className="group relative block w-full h-full"
            >
              <div className="relative overflow-hidden w-full h-full">
                {/* Image container */}
                <div className="relative w-full h-full">
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
