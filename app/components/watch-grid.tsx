"use client";

import Link from "next/link";
import { getImageUrl } from "@/utils";
import { Prisma } from "@prisma/client";
import { Icon } from "@iconify/react";
import { Image } from "@/app/components/image";

type MovieWithIncludes = Prisma.moviesGetPayload<{
  include: {
    movies_genres: { include: { genres: true } };
    movies_directors: { include: { directors: true } };
    movies_countries: { include: { countries: true } };
  };
}> & {
  links?: { url: string; label?: string }[];
};

interface WatchGridProps {
  movies: MovieWithIncludes[];
}

export function WatchGrid({ movies }: WatchGridProps) {
  // On garde uniquement les 3 derniers films avec au moins 1 lien
  const latestOnline = movies
    .filter((m) => m.links && m.links.length > 0)
    .slice(0, 8);

  return (
    <div className="px-[clamp(1.25rem,5vw,2.5rem)] py-5">
      {/* Titre */}
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl pt-5 font-bold text-black leading-tight">
          À voir en ligne
        </h2>
      </div>

      {/* Grille 3 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
        {latestOnline.map((movie) => {
          const directors = movie?.movies_directors
            ?.map((item) => item.directors.name)
            .filter(Boolean)
            .join(", ");

          return (
            <div key={movie.id} className="flex flex-col gap-4">
              <Link
                href={`/movies/${movie.id}`}
                className="relative group overflow-hidden transition-all duration-500 block"
              >
                <div className="relative w-full aspect-video overflow-hidden bg-gray-900">
                  <Image
                    src={getImageUrl(movie.image_url || "")}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    title={movie.title}
                  />

                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Infos superposées */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end  transition-opacity duration-300">
                    <h3 className="text-md font-semibold leading-tight text-white line-clamp-2">
                      {movie.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 items-center text-white">
                      {directors && (
                        <p className="text-white text-sm">{directors}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm font-light text-white/90">
                        {movie.release_date &&
                          new Date(movie.release_date).getFullYear()}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      {/* Message si aucun film */}
      {latestOnline.length === 0 && (
        <div className="text-center py-10">
          <Icon
            icon="mdi:movie-open-outline"
            className="text-6xl text-gray-300 mx-auto mb-4"
          />
          <p className="text-gray-500 text-lg">
            Aucun film disponible à la vision en ligne
          </p>
        </div>
      )}
    </div>
  );
}
