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
    <div className="px-[clamp(1.25rem,5vw,2.5rem)] py-5">
      {/* Titre de section */}
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl pt-5 font-bold text-gray-900 mb-2">
          Dernières nouveautés
        </h2>
        <p className="text-gray-600">
          Découvrez les derniers films ajoutés à notre catalogue
        </p>
      </div>

      {/* Grille responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {movies.map((movie) => {
          const director = movie.movies_directors?.[0]?.directors.name;
          const releaseYear = movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : null;
          const genres = movie.movies_genres
            ?.map((item) => item.genres.name)
            .filter(Boolean)
            .slice(0, 2);

          return (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="group relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform ">
                {/* Image container */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={getImageUrl(movie.image_url || "")}
                    alt={movie.title}
                    className="w-full h-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-110"
                    title={movie.title}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Badge Nouveauté */}
                  <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                    Nouveau
                  </div>

                  {/* Infos sur l’image */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-300">
                    {genres && genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {genres.map((genre, index) => (
                          <span
                            key={index}
                            className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/30"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-white drop-shadow-md line-clamp-2">
                      {movie.title}
                    </h3>

                    <div className="text-white mt-2 space-y-1 drop-shadow-md">
                      {director && (
                        <div className="flex items-center gap-2 text-sm">
                          <Icon
                            icon="mdi:movie-open"
                            className="text-white text-lg"
                          />
                          <span className="line-clamp-1">{director}</span>
                        </div>
                      )}

                      {releaseYear && (
                        <div className="flex items-center gap-2 text-sm">
                          <Icon
                            icon="mdi:calendar"
                            className="text-white text-lg"
                          />
                          <span>{releaseYear}</span>
                        </div>
                      )}
                    </div>
                  </div>
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
