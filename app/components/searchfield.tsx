"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { searchMoviesByWordPaginated } from "@/app/server-actions/movies/get-movies-by-word";

import Card from "./card";
import { getImageUrl } from "@/utils";
import { Movie } from "../types/movie";
import { useInfiniteScroll } from "@/app/hooks/use-infinite-scroll";

type FormValues = {
  search: string;
};

export default function Searchfield({
  initialMovies,
  initialSearch = "",
  initialTotalCount = 0,
  initialHasMore = false,
  userIsAdmin,
}: {
  initialMovies: Movie[];
  initialSearch?: string;
  initialTotalCount?: number;
  initialHasMore?: boolean;
  userIsAdmin: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer les valeurs depuis l'URL
  const urlSearch = searchParams.get("search") || initialSearch;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { search: urlSearch },
  });

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fonction pour effectuer une recherche (reset à page 1)
  const performSearch = async (searchTerm: string) => {
    try {
      setIsLoading(true);
      setCurrentPage(1);
      setMovies([]);

      const result = await searchMoviesByWordPaginated({
        search: searchTerm,
        page: 1,
        limit: 20,
      });

      setMovies(result.movies);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setMovies([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger plus de résultats (pagination infinie)
  const loadMoreMovies = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const searchTerm = searchParams.get("search") || "";

      const result = await searchMoviesByWordPaginated({
        search: searchTerm,
        page: currentPage + 1,
        limit: 20,
      });

      setMovies((prev) => [...prev, ...result.movies]);
      setHasMore(result.hasMore);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error("Erreur lors du chargement des films:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Hook infinite scroll
  const { loadingRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMoreMovies,
    threshold: 200,
  });

  // Gestion de la soumission du formulaire
  const onSubmit = (data: FormValues) => {
    const params = new URLSearchParams(searchParams.toString());

    if (data.search) {
      params.set("search", data.search);
    } else {
      params.delete("search");
    }

    params.set("searchMode", "field");
    router.push(`/search?${params.toString()}`);
  };

  // Charger automatiquement quand les params changent
  useEffect(() => {
    const term = searchParams.get("search") || "";
    performSearch(term);
  }, [searchParams]);

  // Réinitialiser
  const handleReset = () => {
    reset({ search: "" });

    const params = new URLSearchParams();
    params.set("searchMode", "field");
    router.push(`/search?${params.toString()}`);

    performSearch("");
  };

  return (
    <div className="w-full mb-4">
      {/* Formulaire */}
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
                  className="appearance-none text-md placeholder-gray-500 font-light block w-full bg-white rounded-xl border border-black text-black p-2 py-3 leading-tight"
                  placeholder="Rechercher un mot ou un titre..."
                />
              )}
            />
          </div>
        </div>
        <div className="flex flex-co pl-0 sm:pl-5 sm:flex-row flex-col gap-4 py-2">
          <button
            type="submit"
            className="w-full bg-black text-white px-4 py-2 rounded-xl hover:bg-rose-500"
          >
            Rechercher
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full border hover:border-rose-500 hover:text-rose-500 text-black px-4 py-2 border-black rounded-xl"
          >
            Réinitialiser
          </button>
        </div>
      </form>

      {/* Résultats */}
      <div className="flex-1 pt-4">
        <div className="border-l-4 text-sm border-rose-500 pl-4 py-2 mb-6">
          {isLoading ? (
            <div className="animate-pulse rounded-md h-6 bg-gray-300 w-32"></div>
          ) : (
            <div className="text-gray-800">
              <span className="text-rose-500 font-semibold">{totalCount}</span>
              <span className="text-gray-600 ml-2">titres trouvés</span>
              {movies.length > 0 && movies.length < totalCount && (
                <span className="text-gray-500 ml-2">
                  (affichage de {movies.length})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grille */}
        <div className="w-full grid xs:grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-300 h-[200px] rounded-xl w-full justify-end max-w-xs mx-auto"
              />
            ))
          ) : movies.length === 0 ? (
            <p>Aucun film trouvé</p>
          ) : (
            movies.map((movie) => (
              <Card
                key={`${movie.title}-${movie.id}`}
                {...movie}
                userIsAdmin={userIsAdmin}
                image_url={getImageUrl(movie.image_url || "")}
              />
            ))
          )}
        </div>

        {/* Infinite scroll loader */}
        {hasMore && (
          <div ref={loadingRef} className="py-8 flex justify-center">
            {isLoadingMore && (
              <div className="flex items-center gap-2 text-gray-600">
                <Icon icon="mdi:loading" className="animate-spin size-5" />
                <span>Chargement...</span>
              </div>
            )}
          </div>
        )}

        {!hasMore && movies.length > 0 && (
          <div className="py-8 text-center text-gray-500 border-t border-gray-200 mt-8">
            <Icon icon="mdi:check-circle" className="size-5 inline mr-2" />
            Tous les films ont été chargés
          </div>
        )}
      </div>
    </div>
  );
}
