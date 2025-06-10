import HomeCard from "@/app/components/home-card";
import { getImageUrl } from "@/utils";
import Hero from "./components/hero";
import { getLatestMovies, getTopMovies } from "@/app/server-actions/movies";
import { getCollections } from "@/app/server-actions/lists/get-collections";

import Link from "next/link";
import { Icon } from "@iconify/react";

export const revalidate = 0;

export default async function Home() {
  try {
    const topMovies = await getTopMovies();
    const latestMovies = await getLatestMovies();
    const collections = await getCollections();

    const [featuredLatestMovie, ...otherLatestMovies] = latestMovies;

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

        {/* First movie highlight */}
        {featuredLatestMovie && (
          <div className="w-full p-10 overflow-hidden">
            <div className="top-5 right-5 text-white">
              <h2 className="text-rose-900 text-2xl mb-4 font-extrabold font-raleway">
                Dernier ajout
              </h2>
            </div>
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
                <div className="absolute bottom-0 sm:w-2/3 left-0 m-4">
                  <div className="p-6 ">
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
                  <div className="flex sm:flex-row flex-col justify-between sm:items-center items-start pr-10 mb-4 gap-2">
                    <div className="flex flex-col sm:items-center gap-3">
                      <h2 className="text-2xl font-semibold text-rose-900">
                        {collection.title}
                      </h2>
                      <span className="inline-block text-sm text-rose-500 border-rose-500 rounded-full font-light px-2 py-1 border mt-1 sm:mt-0">
                        Collection
                      </span>
                    </div>

                    {/* {collection.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {collection.description}
                        </p>
                      )} */}
                    <Link
                      href={`/lists/${collection.id}`}
                      className="border rounded-xl px-2 py-1 border-rose-900 text-rose-900 hover:border-rose-500 hover:bg-rose-500 hover:text-white text-sm"
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
