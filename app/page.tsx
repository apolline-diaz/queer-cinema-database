import HomeCard from "@/app/components/home-card";
import { getImageUrl } from "@/utils";
import Hero from "./components/hero";
import {
  getMoviesByGenre,
  getMoviesByYearRange,
  getTopMovies,
} from "@/app/server-actions/movies";
import Link from "next/link";
import { Icon } from "@iconify/react";

export const revalidate = 0;

export default async function Home() {
  try {
    const topMovies = await getTopMovies();
    const comedyMovies = await getMoviesByGenre(15);
    const documentaryMovies = await getMoviesByGenre(9);
    const ninetiesMovies = await getMoviesByYearRange("1990", "1999");

    return (
      <main className="w-full bg-red-100">
        <div className="w-full border border-rose-500">
          {topMovies.map((movie) => (
            <Hero
              key={`${movie.title}-${movie.id}`}
              {...movie}
              image_url={getImageUrl(movie.image_url)}
            />
          ))}
        </div>

        <div className="px-10 py-5">
          {/* Comedy Movies */}
          <div className="flex flex-col mb-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg text-rose-500">Comédie</h2>
              <Link
                href="/movies?genreId=15"
                className="border rounded-xl px-2 py-1 border-rose-500 text-rose-500 hover:text-rose-400 hover:border-rose-400 text-sm"
              >
                Voir plus{" "}
                <Icon icon="mdi:chevron-right" className="inline size-4" />
              </Link>
            </div>
            <div className="flex flex-row-1 mb-5 overflow-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
              {comedyMovies.map((movie) => (
                <HomeCard
                  key={`${movie.title}-${movie.id}`}
                  {...movie}
                  release_date={movie.release_date || ""}
                  image_url={getImageUrl(movie.image_url || "")}
                />
              ))}
            </div>
          </div>
          {/* Documentary Movies */}
          <div className="flex flex-col mb-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg text-rose-500">Documentaire</h2>
              <Link
                href="/movies?genreId=9"
                className="border rounded-xl px-2 py-1 border-rose-500 text-rose-500 hover:text-rose-400 hover:border-rose-400 text-sm"
              >
                Voir plus{" "}
                <Icon icon="mdi:chevron-right" className="inline size-4" />
              </Link>
            </div>
            <div className="flex flex-row-1 mb-5 overflow-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
              {documentaryMovies.map((movie) => (
                <HomeCard
                  key={`${movie.title}-${movie.id}`}
                  {...movie}
                  release_date={movie.release_date || ""}
                  image_url={getImageUrl(movie.image_url || "")}
                />
              ))}
            </div>
          </div>
          {/* Nineties Movies */}
          <div className="flex flex-col mb-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg text-rose-500">Années 90</h2>
              <Link
                href="/movies?startYear=1990&endYear=1999"
                className="border rounded-xl px-2 py-1 border-rose-500 text-rose-500 hover:text-rose-400 hover:border-rose-400 text-sm"
              >
                Voir plus{" "}
                <Icon icon="mdi:chevron-right" className="inline size-4" />
              </Link>
            </div>
            <div className="flex flex-row-1 mb-5 overflow-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
              {ninetiesMovies.map((movie) => (
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
