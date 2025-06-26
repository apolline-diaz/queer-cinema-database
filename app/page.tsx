import HomeCard from "@/app/components/home-card";
import { getImageUrl } from "@/utils";
import Hero from "./components/hero";
import { Metadata } from "next";
import { getLatestMovies } from "@/app/server-actions/movies";
import { getCollections } from "@/app/server-actions/lists/get-collections";

import Link from "next/link";
import { Icon } from "@iconify/react";

export const revalidate = 0;

export const metadata: Metadata = {
  other: {
    preload: "/assets/1749767151774-chocolate_babies.webp",
  },
};

export default async function Home() {
  try {
    const latestMovies = await getLatestMovies();
    const collections = await getCollections();

    const [featuredLatestMovie, ...otherLatestMovies] = latestMovies;

    return (
      <main className="w-full bg-white">
        <div className="w-full ">
          <Hero />
        </div>

        {/* First movie highlight */}
        {featuredLatestMovie && (
          <div className="w-full p-10 overflow-hidden">
            <div className="top-5 right-5 text-white"></div>
            <div className="flex sm:flex-row flex-col w-full h-full sm:h-[400px] gap-4">
              <Link
                href={`/movies/${featuredLatestMovie.id}`}
                className="relative h-[400px] w-full overflow-hidden rounded-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(featuredLatestMovie.image_url || "")}
                  alt={featuredLatestMovie.title}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="flex items-between ">
                  <span className="absolute top-0 right-0 m-5 text-white bg-rose-500 border-rose-500 text-sm rounded-full border px-2 py-1 mb-4">
                    Nouveauté
                  </span>
                  <div className="absolute bottom-0 left-0 w-full">
                    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent rounded-b-xl z-0"></div>
                    <div className="p-6 relative sm:w-2/3 z-10">
                      <h3 className="text-2xl font-medium">
                        {featuredLatestMovie.title}
                      </h3>
                      <span className="inline-block text-md font-light">
                        {featuredLatestMovie?.movies_directors
                          ?.map((item) => item.directors.name)
                          .join(", ") || "Réalisateur inconnu"}
                      </span>{" "}
                      •{" "}
                      <span className="inline-block mb-1 text-md font-light">
                        {featuredLatestMovie.release_date || ""}
                      </span>
                      <p className="line-clamp-3 text-md font-extralight">
                        {featuredLatestMovie.description ||
                          "Pas de description disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
        <div className="pl-10">
          <div className="flex flex-col mb-5">
            <div className="flex justify-between items-center pr-10 mb-4">
              <h2 className="text-2xl font-semibold  text-rose-900">
                Catalogue
              </h2>
              <Link
                href="/movies"
                className="border rounded-xl px-2 py-1 border-rose-900 text-rose-900 hover:border-rose-500 hover:bg-rose-500 hover:text-white text-sm"
              >
                Voir plus{" "}
                <Icon icon="mdi:chevron-right" className="inline size-4" />
              </Link>
            </div>
            <div className="flex flex-row-1 mb-5 gap-3 overflow-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {otherLatestMovies.map((movie) => (
                <HomeCard
                  key={`${movie.title}-${movie.id}`}
                  {...movie}
                  release_date={movie.release_date || ""}
                  image_url={getImageUrl(movie.image_url || "")}
                />
              ))}
            </div>
          </div>

          {collections.length > 0 && (
            <div className="flex flex-col space-y-5 mb-10">
              {collections.map((collection) => (
                <div key={collection.id.toString()} className="flex flex-col">
                  <div className="flex flex-row justify-between items-end pr-10 mb-4 gap-2">
                    <div className="flex flex-col gap-3 min-w-0 flex-1">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r leading-tight from-rose-900 to-rose-500 bg-clip-text text-transparent line-clamp-3">
                        {collection.title}
                      </h2>
                      <span className="w-fit text-sm text-rose-500 border border-rose-500 rounded-full font-light px-1.5 py-0.5">
                        Collection
                      </span>
                    </div>

                    <Link
                      href={`/lists/${collection.id}`}
                      className="border rounded-xl px-2 py-1 border-rose-900 text-rose-900 hover:border-rose-500 hover:bg-rose-500 hover:text-white text-sm whitespace-nowrap flex-shrink-0"
                    >
                      Voir plus{" "}
                      <Icon
                        icon="mdi:chevron-right"
                        className="inline size-4"
                      />
                    </Link>
                  </div>

                  {"lists_movies" in collection && collection.lists_movies && (
                    <div className="flex flex-row-1 mb-3 gap-3 overflow-auto max-h-[200px]">
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
