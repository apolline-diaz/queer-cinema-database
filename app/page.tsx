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
                <div className="absolute bottom-0 sm:w-1/3 left-0 m-4 bg-rose-50 rounded-xl">
                  <div className="p-6 text-black">
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
                Découvrir
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
        </div>
      </main>
    );
  } catch (error) {
    return (
      <p>Erreur lors du chargement des films : {(error as Error).message}</p>
    );
  }
}
