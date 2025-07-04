import HomeCard from "@/app/components/home-card";
import { getImageUrl } from "@/utils";
import Hero from "./components/hero";
import { getLatestMovies, getTopMovies } from "@/app/server-actions/movies";
import { getCollections } from "@/app/server-actions/lists/get-collections";

import Link from "next/link";
import { Icon } from "@iconify/react";

export const revalidate = 3600; // revalidate every hour (Incremental Static Regeneration)

export default async function HomePage() {
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
        <div className="w-full py-10 pl-10">
          <div className="flex justify-between items-center mb-3 text-white">
            <h2 className="text-2xl font-semibold bg-gradient-to-r leading-tight from-rose-900 to-rose-500 bg-clip-text text-transparent line-clamp-3">
              Nouveautés
            </h2>
            <Link
              href="/movies"
              className="border rounded-xl px-2 mr-10 py-1 border-rose-900 text-rose-900 hover:border-rose-500 hover:bg-rose-500 hover:text-white text-sm whitespace-nowrap flex-shrink-0"
            >
              Voir plus{" "}
              <Icon icon="mdi:chevron-right" className="inline size-4" />
            </Link>
          </div>
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
        </div>
        {/* First movie highlight */}
        {featuredLatestMovie && (
          <div className="relative w-full h-[500px] mb-10">
            <Link
              href={`/movies/${featuredLatestMovie.id}`}
              className="h-full w-full overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(featuredLatestMovie.image_url || "")}
                alt={featuredLatestMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="bg-black/10 backdrop-blur-sm absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/100 z-10" />
              <div className="absolute bottom-10 px-10 flex flex-col gap-1 text-left z-20">
                <h3 className="text-2xl font-medium">
                  {featuredLatestMovie.title}
                </h3>
                <p className="text-md font-medium">
                  {featuredLatestMovie?.movies_directors
                    ?.map((item) => item.directors.name)
                    .join(", ") || ""}
                </p>
                <p className="text-md font-medium">
                  {featuredLatestMovie.release_date || ""}
                </p>

                <p className="line-clamp-5 w-3/4 overflow-hidden text-md font-extralight">
                  {featuredLatestMovie.description || ""}
                </p>
              </div>
            </Link>
          </div>
        )}

        <div className="pl-10">
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
