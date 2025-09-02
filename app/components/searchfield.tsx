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

const MOVIES_PER_PAGE = 20;

export default function Searchfield({
  initialSearch = "",
  userIsAdmin,
}: {
  initialSearch?: string;
  userIsAdmin: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { search: initialSearch },
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const performSearch = async (
    searchTerm: string,
    preservePage: boolean = false
  ) => {
    try {
      setIsLoading(true);
      if (searchTerm) {
        const results = await getMoviesByWord(searchTerm);
        setMovies(results);
        // Ne reset la page que si ce n'est pas une restauration d'état
        if (!preservePage) {
          setCurrentPage(1);
        }
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    const params = new URLSearchParams();
    if (data.search) {
      params.set("word", data.search);
      params.set("page", "1"); // Reset à la page 1 lors d'une nouvelle recherche
    }
    router.push(`/search?${params.toString()}`);
  };

  // useEffect pour gérer les changements de terme de recherche
  useEffect(() => {
    const term = searchParams.get("word") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    // D'abord on set la page depuis l'URL
    setCurrentPage(page);
    reset({ search: term });

    if (term) {
      // On préserve la page si elle existe dans l'URL
      performSearch(term, page > 1);
    } else {
      setMovies([]);
    }
  }, [searchParams.get("word"), reset]);

  // useEffect séparé pour gérer les changements de page seulement
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const currentWord = searchParams.get("word") || "";

    // Ne mettre à jour currentPage que si on a déjà des résultats
    // ou si on est sur la même recherche
    if (movies.length > 0 || !currentWord) {
      setCurrentPage(page);
    }
  }, [searchParams.get("page")]);

  const handleReset = () => {
    reset({ search: "" });
    router.push(`/search`);
    setMovies([]);
    setCurrentPage(1);
  };

  // Fonction pour changer de page
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/search?${params.toString()}`, { scroll: false });

    // Scroll vers le début des résultats après un court délai
    setTimeout(() => {
      const resultsSection = document.querySelector(
        '[data-testid="results-section"]'
      );
      if (resultsSection) {
        const offset = 100; // Décalage pour éviter que ce soit collé en haut
        const elementPosition = resultsSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 150);
  };

  // Calculs pour la pagination
  const totalMovies = movies.length;
  const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);
  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const endIndex = startIndex + MOVIES_PER_PAGE;
  const currentMovies = movies.slice(startIndex, endIndex);

  // Génération des numéros de pages à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
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
                  className="appearance-none text-md placeholder-gray-500 font-light block w-full bg-white rounded-xl border border-black text-black p-2 py-3 leading-tight focus:none focus:outline-none"
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

      {/* Indication vers recherche avancée */}
      <div className="flex-wrap gap-3 mt-4 mb-6 p-4 bg-gray-100 rounded-xl border border-gray-200 flex">
        <span className="text-gray-700 text-sm">
          Pour une recherche plus détaillée, utilisez la page{" "}
          <strong>Films</strong> avec filtres avancés.
        </span>
        <button
          onClick={() => router.push("/movies")}
          className="text-rose-500 rounded-xl text-sm hover:text-rose-800 transition-colors"
        >
          Aller à la recherche avancée
        </button>
      </div>

      {/* Section des résultats */}
      <div className="flex-1 pt-4" data-testid="results-section">
        {/* Compteur de résultats et info pagination */}
        <div className="border-l-4 text-sm border-rose-500 pl-4 py-2 mb-6">
          {isLoading ? (
            <div className="animate-pulse rounded-md h-6 bg-gray-300 w-32"></div>
          ) : (
            <div className="text-gray-800">
              <span
                className="text-rose-500 font-semibold"
                data-testid="results-count"
              >
                {totalMovies}
              </span>
              <span className="text-gray-600 ml-2">titres trouvés</span>
              {totalMovies > 0 && (
                <span className="text-gray-500 ml-4 text-xs">
                  Page {currentPage} sur {totalPages} • Affichage de{" "}
                  {startIndex + 1} à {Math.min(endIndex, totalMovies)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grille des films */}
        <div className="w-full grid xs:grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-300 h-[200px] rounded-xl w-full justify-end max-w-xs mx-auto"
              />
            ))
          ) : currentMovies.length === 0 ? (
            searchParams.get("word") ? (
              <p data-testid="no-results">Aucun film trouvé</p>
            ) : (
              <p className="text-gray-400 font-light italic text-sm">
                Lancez une recherche pour voir des résultats
              </p>
            )
          ) : (
            currentMovies.map((movie) => (
              <Card
                key={`${movie.title}-${movie.id}`}
                {...movie}
                userIsAdmin={userIsAdmin}
                image_url={getImageUrl(movie.image_url || "")}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="mt-8 flex flex-col items-center space-y-4">
            {/* Navigation avec flèches */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center p-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 hover:border-rose-200"
                }`}
              >
                <Icon icon="mdi:chevron-left" className="text-lg" />
              </button>

              {/* Numéros de pages */}
              <div className="flex space-x-1">
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <button
                        onClick={() => changePage(page as number)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? "bg-rose-500 text-white"
                            : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 hover:border-rose-200"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center p-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 hover:border-rose-200"
                }`}
              >
                <Icon icon="mdi:chevron-right" className="text-lg" />
              </button>
            </div>

            {/* Info pagination compacte */}
            <p className="text-xs text-gray-500">
              {currentMovies.length} films affichés sur cette page
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
