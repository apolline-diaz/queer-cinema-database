import HomeCard from "@/app/components/home-card";
import { getImageUrl } from "@/utils";
import Hero from "./components/hero";
import { getLatestMovies, getTopMovies } from "@/app/server-actions/movies";
import Link from "next/link";
import { Icon } from "@iconify/react";

export const revalidate = 0;

export default async function Home() {
  try {
    const topMovies = await getTopMovies();
    const latestMovies = await getLatestMovies();

    const [featuredLatestMovie, ...otherLatestMovies] = latestMovies;

    return (
      <main className="w-full bg-red-100">
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
          <div className="w-full mb-5 relative overflow-hidden">
            <Link href={`/movies/${featuredLatestMovie.id}`}>
              <div className="relative h-[100vh] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(featuredLatestMovie.image_url || "")}
                  alt={featuredLatestMovie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                  <div className="w-3/4 p-10 text-white">
                    <h3 className="text-5xl uppercase font-bold">
                      {featuredLatestMovie.title}
                    </h3>
                    <div className="flex flex-col font-light">
                      <span className="inline-block mb-1 text-lg">
                        {featuredLatestMovie?.movies_directors
                          ?.map((item) => item.directors.name)
                          .join(", ") || "Réalisateur inconnu"}
                      </span>
                      <span className="inline-block mb-1 text-md">
                        {featuredLatestMovie.release_date || ""}
                      </span>
                      <p className="line-clamp-5 text-md">
                        {featuredLatestMovie.description ||
                          "Pas de description disponible"}
                      </p>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
        <div className="">
          <div className="flex flex-col mb-5">
            <div className="flex justify-between items-center px-10 mb-4">
              <h2 className="text-lg font-semibold  text-rose-500">
                Derniers ajouts{" "}
              </h2>
              <Link
                href="/movies"
                className="border rounded-xl px-2 py-1 border-rose-500 text-rose-500 hover:border-rose-500 hover:bg-rose-500 hover:text-white text-sm"
              >
                Voir plus{" "}
                <Icon icon="mdi:chevron-right" className="inline size-4" />
              </Link>
            </div>
            <div className="flex flex-row-1 mb-5 overflow-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
        </div>
      </main>
    );
  } catch (error) {
    return (
      <p>Erreur lors du chargement des films : {(error as Error).message}</p>
    );
  }
}
