"use client";

import Link from "next/link";
import { getImageUrl } from "@/utils";
import { Prisma } from "@prisma/client";
import { Icon } from "@iconify/react";

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

interface FeaturedLatestMovieProps {
  movie: MovieWithIncludes;
}

export function FeaturedLatestMovie({ movie }: FeaturedLatestMovieProps) {
  const directors = movie?.movies_directors
    ?.map((item) => item.directors.name)
    .filter(Boolean)
    .join(", ");

  const genres = movie?.movies_genres
    ?.map((item) => item.genres.name)
    .filter(Boolean)
    .slice(0, 3);

  const countries = movie?.movies_countries
    ?.map((item) => item.countries.name)
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div className="w-full px-[clamp(1.25rem,5vw,2.5rem)] pt-5">
      {/* Titre de section */}
      <h2 className="text-3xl mb-6 font-bold text-black leading-tight">
        Dernière nouveauté
      </h2>

      {/* Container principal */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Image du film */}
        <Link
          href={`/movies/${movie.id}`}
          className="w-full lg:w-2/3 relative group overflow-hidden rounded-2xl"
        >
          <div className="aspect-[16/10] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(movie.image_url || "")}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay au survol */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badge "Nouveau" */}
            <div className="absolute top-4 left-4 bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              <Icon icon="mdi:new-box" className="inline mr-1" />
              Nouveau
            </div>

            {/* Icône play au centre au survol */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 rounded-full p-4 shadow-2xl">
                <Icon icon="mdi:play" className="text-rose-500 text-4xl" />
              </div>
            </div>
          </div>
        </Link>

        {/* Infos techniques */}
        <div className="w-full lg:w-1/3 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-lg">
          <div className="space-y-6">
            {/* Titre */}
            <div>
              <Link
                href={`/movies/${movie.id}`}
                className="hover:text-rose-600 transition-colors"
              >
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight line-clamp-2">
                  {movie.title}
                </h3>
              </Link>
              {movie.release_date && (
                <p className="text-gray-600 mt-2 font-medium">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              )}
            </div>

            {/* Réalisateur */}
            {directors && (
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:movie-open"
                  className="text-rose-500 text-xl flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Réalisateur
                  </p>
                  <p className="text-gray-900 font-medium">{directors}</p>
                </div>
              </div>
            )}

            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:tag-multiple"
                  className="text-rose-500 text-xl flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Genres
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {genres.map((genre, index) => (
                      <span
                        key={index}
                        className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 shadow-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pays */}
            {countries && countries.length > 0 && (
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:earth"
                  className="text-rose-500 text-xl flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Pays
                  </p>
                  <p className="text-gray-900 font-medium">
                    {countries.join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Durée si disponible */}
            {movie.runtime && (
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:clock-outline"
                  className="text-rose-500 text-xl flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Durée
                  </p>
                  <p className="text-gray-900 font-medium">
                    {/* {movie.runtime} min */}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bouton d'action */}
          <Link
            href={`/movies/${movie.id}`}
            className="mt-6 w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            Voir les détails
            <Icon icon="mdi:arrow-right" className="text-xl" />
          </Link>
        </div>
      </div>
    </div>
  );
}
