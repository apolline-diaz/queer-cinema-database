import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import {
  getMoviesByKeyword,
  getMoviesByTitle,
} from "@/app/server-actions/movies/get-movies-by-title-and-keyword";
import Card from "./card";
import { getImageUrl } from "@/utils";
import { Movie } from "../types/movie";

interface FormValues {
  title: string;
  keyword: string;
}

const MOVIES_PER_PAGE = 50;

export default function Searchfield({
  initialMovies,
  initialKeyword = "",
  userIsAdmin,
}: {
  initialMovies: Movie[];
  initialKeyword?: string;
  userIsAdmin: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer les valeurs depuis l'URL
  const urlTitle = searchParams.get("title") || "";
  const urlKeyword = searchParams.get("keyword") || initialKeyword;

  const { control, watch, handleSubmit, setValue, reset } = useForm<FormValues>(
    {
      defaultValues: { title: urlTitle, keyword: urlKeyword },
    }
  );

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(MOVIES_PER_PAGE);

  // Fonction pour effectuer la recherche
  const performSearch = async (title: string, keyword: string) => {
    try {
      setIsLoading(true);
      setVisibleCount(MOVIES_PER_PAGE);

      if (title) {
        const results = await getMoviesByTitle(title);
        setMovies(results);
      } else if (keyword) {
        const results = await getMoviesByKeyword(keyword);
        setMovies(results);
      } else {
        setMovies(initialMovies);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour l'URL et effectuer la recherche lors du changement d'URL
  useEffect(() => {
    performSearch(urlTitle, urlKeyword);
  }, [urlTitle, urlKeyword, initialMovies]);

  // Gestion de la soumission du formulaire de recherche simple
  const onSubmit = (data: FormValues) => {
    const params = new URLSearchParams(searchParams.toString());

    // Mettre à jour les paramètres
    if (data.title) {
      params.set("title", data.title);
      params.delete("keyword");
    } else if (data.keyword) {
      params.set("keyword", data.keyword);
      params.delete("title");
    } else {
      params.delete("title");
      params.delete("keyword");
    }

    // Toujours définir le mode de recherche sur "field" pour la recherche simple
    params.set("searchMode", "field");

    // Navigation avec les nouveaux paramètres
    router.push(`/movies?${params.toString()}`);
  };

  // Fonction pour réinitialiser la recherche
  const handleReset = () => {
    reset({ title: "", keyword: "" });

    const params = new URLSearchParams();
    params.set("searchMode", "field");
    router.push(`/movies?${params.toString()}`);
  };

  // Fonction pour charger plus de résultats
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + MOVIES_PER_PAGE);
  };

  return (
    <div className="w-full my-4">
      <div className="px-4 py-2 border rounded-xl mb-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-sm w-full xs:w-1/2 my-2 flex flex-col sm:flex-row gap-3">
            <div className="w-full">
              Titre
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="appearance-none text-md font-light block w-full bg-neutral-950 border-b border-b-white text-gray-200 py-2 leading-tight focus:none focus:outline-none"
                    placeholder="Entrez un titre de film"
                  />
                )}
              />
            </div>
            <div className="w-full">
              Mot-clé
              <Controller
                name="keyword"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="appearance-none text-md font-light block w-full bg-neutral-950 border-b border-b-white text-gray-200 py-2 leading-tight focus:none focus:outline-none"
                    placeholder="Entrez un mot-clé"
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:w-full gap-4 py-2">
            <button
              type="submit"
              className="xs:w-full sm:w-[200px] bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-md hover:from-rose-600 hover:to-red-600"
            >
              Rechercher
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="xs:w-full sm:w-[200px] border hover:border-rose-500 hover:text-rose-500 text-white px-4 py-2 rounded-md"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
      <div className="text-rose-500 border-b border-rose-500 text-md font-light mb-5">
        {isLoading ? (
          <div className="animate-pulse rounded-xl h-6 bg-gray-400 w-3/4 mb-2"></div>
        ) : (
          `${movies.length} films trouvés`
        )}
      </div>
      <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl bg-gray-500 h-48 w-full justify-end max-w-xs mx-auto group overflow-hidden flex flex-col transition-transform"
            >
              <div className="flex flex-col p-5 space-y-2">
                <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-400 rounded w-1/3 mb-2"></div>
              </div>
            </div>
          ))
        ) : movies.length === 0 ? (
          <p>Aucun film trouvé</p>
        ) : (
          movies
            .slice(0, visibleCount)
            .map((movie) => (
              <Card
                key={`${movie.title}-${movie.id}`}
                {...movie}
                userIsAdmin={userIsAdmin}
                image_url={getImageUrl(movie.image_url || "")}
              />
            ))
        )}
      </div>
      {visibleCount < movies.length && !isLoading && (
        <button
          onClick={loadMore}
          className="w-full flex flex-row justify-center items-center border-b border-t mt-4 px-4 py-2 hover:border-rose-500 text-white hover:text-rose-600"
        >
          Voir plus <Icon icon="mdi:chevron-down" className="size-5" />
        </button>
      )}
    </div>
  );
}
