import HomeCard from "@/app/components/home-card";
import { getImageUrl } from "@/utils";
import Hero from "./components/hero";
import { getLatestMovies, getTopMovies } from "@/app/server-actions/movies";
import { getCollections } from "@/app/server-actions/lists/get-collections";

import Link from "next/link";
import { Icon } from "@iconify/react";
import React from "react";
import { LatestMoviesCarousel } from "./components/carousel";

export const revalidate = 3600; // revalidate every hour (Incremental Static Regeneration)

export default async function HomePage() {
  try {
    const topMovies = await getTopMovies();
    const latestMovies = await getLatestMovies();
    const collections = await getCollections();

    // Prendre les films pour le carrousel (3 premiers) et le reste pour la grille
    const carouselMovies = latestMovies.slice(0, 3);
    const otherLatestMovies = latestMovies.slice(3);

    return (
      <main className="w-full bg-white">
        <div className="w-full ">
          {topMovies.map((movie) => (
            <Hero
              key={`${movie.title}-${movie.id}`}
              {...movie}
              image_url={getImageUrl(movie.image_url)}
            />
          ))}
        </div>
        <div className="w-full p-10">
          <div className="flex flex-row justify-between">
            <h2 className="text-2xl mb-4 font-semibold text-rose-500 leading-tight line-clamp-3">
              Nouveautés
            </h2>
          </div>

          {/* Carrousel des 3 derniers films */}
          {carouselMovies.length > 0 && (
            <div className="mb-5">
              <LatestMoviesCarousel movies={carouselMovies} />
            </div>
          )}

          {/* Grille des autres films récents */}
          {otherLatestMovies.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {otherLatestMovies.map((movie) => (
                <HomeCard
                  key={`${movie.title}-${movie.id}`}
                  {...movie}
                  release_date={movie.release_date || ""}
                  image_url={getImageUrl(movie.image_url || "")}
                />
              ))}
            </div>
          )}
        </div>

        <div className="pl-10">
          {collections.length > 0 && (
            <div className="flex flex-col space-y-5 mb-10">
              {collections.map((collection) => (
                <div key={collection.id.toString()} className="flex flex-col">
                  <div className="flex flex-row justify-between items-end pr-10 mb-4 gap-2">
                    <div className="flex flex-col gap-3 min-w-0 flex-1">
                      <h2 className="text-2xl font-semibold leading-tight text-rose-500 line-clamp-3">
                        {collection.title}
                      </h2>
                      <span className="w-fit text-sm text-rose-800 border border-rose-800 rounded-full font-light px-1.5 py-0.5">
                        Collection
                      </span>
                    </div>

                    <Link
                      href={`/lists/${collection.id}`}
                      className="border rounded-xl px-2 py-1 border-rose-500 text-rose-500 hover:border-rose-500 hover:bg-rose-500 hover:text-white text-sm whitespace-nowrap flex-shrink-0"
                    >
                      Tout voir{" "}
                      <Icon
                        icon="mdi:chevron-right"
                        className="inline size-4"
                      />
                    </Link>
                  </div>

                  {"lists_movies" in collection && collection.lists_movies && (
                    <div className="flex flex-row-1 mb-3 gap-3 overflow-auto max-h-[400px]">
                      {collection.lists_movies.map((listMovie) => (
                        <HomeCard
                          key={`${listMovie.movies.title}-${listMovie.movies.id}`}
                          id={listMovie.movies.id}
                          title={listMovie.movies.title}
                          release_date={listMovie.movies.release_date || ""}
                          image_url={getImageUrl(
                            listMovie.movies.image_url || ""
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  } catch (error) {
    return (
      <p>Erreur lors du chargement des films : {(error as Error).message}</p>
    );
  }
}
