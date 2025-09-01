"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { getMoviesByWord } from "@/app/server-actions/movies/get-movies-by-word";
import { Icon } from "@iconify/react/dist/iconify.js";
import Card from "./card";
import { getImageUrl } from "@/utils";
import { Movie } from "../types/movie";

type FormValues = {
  search: string;
};

const MOVIES_PER_PAGE = 50;

export default function Searchfield({
  initialSearch = "",
  userIsAdmin,
}: {
  initialSearch?: string;
  userIsAdmin: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || initialSearch;
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { search: urlSearch },
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(MOVIES_PER_PAGE);

  // Tri
  const [sortType, setSortType] = useState<"none" | "title" | "year">("none");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const performSearch = async (searchTerm: string) => {
    try {
      setIsLoading(true);
      if (searchTerm) {
        const results = await getMoviesByWord(searchTerm);
        setMovies(results);
        setVisibleCount(MOVIES_PER_PAGE);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    const params = new URLSearchParams(searchParams.toString());
    if (data.search) {
      params.set("word", data.search);
    }
    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    const term = searchParams.get("word") || "";
    reset({ search: term });
    if (term) {
      performSearch(term);
    } else {
      setMovies([]);
    }
  }, [searchParams, reset]);

  const handleReset = () => {
    reset({ search: "" });
    router.push(`/search`);
    setMovies([]);
  };

  // Tri
  const sortMovies = (type: "none" | "title" | "year") => {
    if (type === sortType) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortType(type);
      setSortDirection("asc");
    }
  };

  const sortedMovies = useMemo(() => {
    if (sortType === "none") return movies;
    const sorted = [...movies].sort((a, b) => {
      if (sortType === "title") {
        if (a.title < b.title) return sortDirection === "asc" ? -1 : 1;
        if (a.title > b.title) return sortDirection === "asc" ? 1 : -1;
        return 0;
      } else if (sortType === "year") {
        const yearA = a.release_date ? parseInt(a.release_date) : 0;
        const yearB = b.release_date ? parseInt(b.release_date) : 0;
        return sortDirection === "asc" ? yearA - yearB : yearB - yearA;
      }
      return 0;
    });
    return sorted;
  }, [movies, sortType, sortDirection]);

  const visibleMovies = sortedMovies.slice(0, visibleCount);

  return (
    <div className="w-full mb-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex sm:flex-row flex-col"
      >
        <div className="text-sm w-full xs:w-1/2 my-2 flex flex-col sm:flex-row gap-3">
          <div className="w-full">
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="appearance-none text-md placeholder-gray-500 font-light block w-full bg-white rounded-xl border  border-black text-black p-2 py-3 leading-tight focus:none focus:outline-none"
                  placeholder="Rechercher un titre, réalisateur-ice, mot-clé..."
                  data-testid="search-input"
                />
              )}
            />
          </div>
        </div>
        <div className="flex flex-co pl-0 sm:pl-5 sm:flex-row flex-col gap-4 py-2">
          <button
            type="submit"
            data-testid="search-button"
            className="w-full transition-colors duration-200 ease-in-out bg-black text-white px-4 py-2 rounded-xl hover:bg-rose-500"
          >
            Rechercher
          </button>
          <button
            type="button"
            onClick={handleReset}
            data-testid="reset-button"
            className="w-full border transition-colors duration-200 ease-in-out hover:border-rose-500 hover:text-rose-500 text-black px-4 py-2 border-black rounded-xl"
          >
            Réinitialiser
          </button>
        </div>
      </form>
      {/* Indication vers recherche avancée */}
      <div className="flex-wrap gap-3 mt-4 mb-6 p-4 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-between">
        <span className="text-gray-700 text-sm">
          Pour une recherche plus détaillée, utilisez la page{" "}
          <strong>Films</strong> avec filtres avancés.
        </span>
        <button
          onClick={() => router.push("/movies")}
          className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm hover:bg-rose-600 transition-colors"
        >
          Aller à la recherche avancée
        </button>
      </div>

      {/* Section de tri */}
      {visibleMovies.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-8 border border-gray-200/50 ">
          <div className="flex items-center gap-2 mb-3">
            <Icon icon="solar:sort-outline" className="text-rose-500 text-lg" />
            <h3 className="text-sm font-medium text-gray-800">Trier</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => sortMovies("title")}
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                sortType === "title"
                  ? "bg-rose-500 text-white"
                  : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 hover:border-rose-200"
              }`}
            >
              <Icon
                icon="solar:sort-from-top-to-bottom-outline"
                className={`text-lg transition-colors ${sortType === "title" ? "text-white" : "text-gray-500 group-hover:text-rose-500"}`}
              />
              <span>Alphabétique</span>
              {sortType === "title" && (
                <div className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {sortDirection === "asc" ? "A-Z" : "Z-A"}
                </div>
              )}
            </button>

            <button
              onClick={() => sortMovies("year")}
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                sortType === "year"
                  ? "bg-rose-500 text-white"
                  : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 hover:border-rose-200"
              }`}
            >
              <Icon
                icon="solar:calendar-outline"
                className={`text-lg transition-colors ${sortType === "year" ? "text-white" : "text-gray-500 group-hover:text-rose-500"}`}
              />
              <span>Année</span>
              {sortType === "year" && (
                <div className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {sortDirection === "asc" ? "1900→2025" : "2025→1900"}
                </div>
              )}
            </button>

            <button
              onClick={() => sortMovies("none")}
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                sortType === "none"
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon
                icon="solar:refresh-outline"
                className={`text-lg transition-colors ${sortType === "none" ? "text-white" : "text-gray-500 group-hover:text-gray-600"}`}
              />
              <span>Par défaut</span>
            </button>
          </div>
        </div>
      )}

      {/* Résultats */}
      <div className="flex-1 pt-4">
        <div className="border-l-4  text-sm border-rose-500 pl-4 py-2 mb-6">
          {isLoading ? (
            <div className="animate-pulse rounded-md h-6 bg-gray-300 w-32"></div>
          ) : (
            <div className="text-gray-800">
              <span
                className="text-rose-500 font-semibold"
                data-testid="results-count"
              >
                {movies.length}
              </span>
              <span className="text-gray-600 ml-2">titres trouvés</span>
            </div>
          )}
        </div>
        <div className="w-full grid xs:grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-300 h-[200px] rounded-xl w-full justify-end max-w-xs mx-auto group overflow-hidden flex flex-col transition-transform"
              >
                <div className="flex flex-col p-5 space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                </div>
              </div>
            ))
          ) : visibleMovies.length === 0 ? (
            searchParams.get("word") ? (
              <p data-testid="no-results">Aucun film trouvé</p>
            ) : (
              <p className="text-gray-400 font-light italic text-sm">
                Lancez une recherche pour voir des résultats
              </p>
            )
          ) : (
            visibleMovies.map((movie) => (
              <Card
                key={`${movie.title}-${movie.id}`}
                {...movie}
                userIsAdmin={userIsAdmin}
                image_url={getImageUrl(movie.image_url || "")}
              />
            ))
          )}
        </div>

        {/* Bouton Voir Plus */}
        {visibleCount < sortedMovies.length && !isLoading && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + MOVIES_PER_PAGE)}
              className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              Voir plus
              <Icon icon="mdi:chevron-down" className="text-lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
