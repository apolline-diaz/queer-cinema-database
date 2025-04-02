import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import {
  getMoviesByKeyword,
  getMoviesByTitle,
} from "@/app/server-actions/movies/get-movies-by-title-and-keyword";
import {
  getTmdbMoviesByTitle,
  getTmdbMoviesByKeyword,
} from "@/app/server-actions/movies/get-tmdb-movies";
import Card from "./card";
import { getImageUrl } from "@/utils";
import { Movie } from "../types/movie";

interface FormValues {
  title: string;
  keyword: string;
}

const MOVIES_PER_PAGE = 20;

export default function Searchfield({
  initialMovies,
  initialKeyword = "",
  userIsAdmin,
}: {
  initialMovies: Movie[];
  initialKeyword?: string;
  userIsAdmin: boolean;
}) {
  const { control, watch, setValue } = useForm<FormValues>({
    defaultValues: { title: "", keyword: initialKeyword },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(MOVIES_PER_PAGE);
  const [hasMorePages, setHasMorePages] = useState(true);

  const titleSearch = watch("title");
  const keywordSearch = watch("keyword");

  useEffect(() => {
    const updateURL = (title: string, keyword: string) => {
      const params = new URLSearchParams(searchParams);
      title ? params.set("title", title) : params.delete("title");
      keyword ? params.set("keyword", keyword) : params.delete("keyword");
      router.push(`/movies?${params.toString()}`, { scroll: false });
    };

    const delayDebounceFn = setTimeout(() => {
      updateURL(titleSearch, keywordSearch);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [titleSearch, keywordSearch, router, searchParams]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setCurrentPage(1);
      setVisibleCount(MOVIES_PER_PAGE);

      try {
        let dbMovies: Movie[] = [];
        let tmdbMovies: Movie[] = [];

        if (titleSearch) {
          // Fetch both from your DB and TMDB
          dbMovies = await getMoviesByTitle(titleSearch);
          tmdbMovies = await getTmdbMoviesByTitle(titleSearch);
        } else if (keywordSearch) {
          dbMovies = await getMoviesByKeyword(keywordSearch);
          tmdbMovies = await getTmdbMoviesByKeyword(keywordSearch);
        } else {
          dbMovies = initialMovies;
          setHasMorePages(false);
        }

        // Mark the source
        dbMovies = dbMovies.map((movie) => ({
          ...movie,
          source: "db" as const,
        }));

        // Combine results and remove duplicates (assuming title+year is enough to identify duplicates)
        const allMovies = [...dbMovies, ...tmdbMovies];
        const uniqueMovies = Array.from(
          new Map(
            allMovies.map((movie) => [
              `${movie.title}-${movie.release_date || "unknown"}`,
              movie,
            ])
          ).values()
        );

        setMovies(uniqueMovies);
        setHasMorePages(tmdbMovies.length >= 20); // TMDB returns 20 results per page by default
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(fetchMovies, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [titleSearch, keywordSearch, initialMovies]);

  const handleReset = () => {
    setValue("title", "");
    setValue("keyword", "");
    setMovies(initialMovies);
    setVisibleCount(MOVIES_PER_PAGE);
    setCurrentPage(1);
    setHasMorePages(false);
    router.push("/movies", { scroll: false });
  };

  const loadMore = () => {
    if (currentPage === 1) {
      // If we're still showing the first page, just show more items from current results
      setVisibleCount((prevCount) => prevCount + MOVIES_PER_PAGE);

      // If we've shown all movies from the current set, try fetching the next page
      if (visibleCount + MOVIES_PER_PAGE >= movies.length) {
        setCurrentPage(2);
      }
    } else {
      // We need to fetch more from TMDB
      fetchNextPage();
    }
  };

  const fetchNextPage = async () => {
    if (!hasMorePages) return;

    setIsLoading(true);
    try {
      let newMovies: Movie[] = [];

      if (titleSearch) {
        // For title search, we need to implement pagination in the TMDB API
        const nextPage = currentPage + 1;
        // You'll need to implement a paginated version of getTmdbMoviesByTitle
        // This is pseudo-code:
        // const tmdbMovies = await getTmdbMoviesByTitlePaginated(titleSearch, nextPage);
        // newMovies = tmdbMovies;
      } else if (keywordSearch) {
        // Same for keyword search
        // const tmdbMovies = await getTmdbMoviesByKeywordPaginated(keywordSearch, nextPage);
        // newMovies = tmdbMovies;
      }

      if (newMovies.length > 0) {
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
        setCurrentPage((nextPage) => nextPage + 1);
        setHasMorePages(newMovies.length >= 20);
      } else {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error("Error fetching next page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full my-4">
      <div className="px-4 py-2 border rounded-xl mb-4">
        <form>
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
        </form>
        <button
          type="button"
          onClick={handleReset}
          className="my-2 xs:w-full w-full sm:w-[200px] border hover:border-rose-500 hover:text-rose-500 text-white px-4 py-2 rounded-md"
        >
          Réinitialiser
        </button>
      </div>
      <div className="text-rose-500 border-b border-rose-500 text-md font-light mb-5">
        {isLoading && movies.length === 0 ? (
          <div className="animate-pulse rounded-xl h-6 bg-gray-400 w-3/4 mb-2"></div>
        ) : (
          `${movies.length} films trouvés`
        )}
      </div>
      <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading && movies.length === 0 ? (
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
          movies.slice(0, visibleCount).map((movie) => (
            <Card
              key={`${movie.title}-${movie.id}`}
              {...movie}
              userIsAdmin={userIsAdmin && movie.source !== "tmdb"} // Only allow admin actions on your own DB movies
              image_url={getImageUrl(movie.image_url || "")}
            />
          ))
        )}
      </div>
      {(visibleCount < movies.length || hasMorePages) && !isLoading && (
        <button
          onClick={loadMore}
          className="w-full flex flex-row justify-center items-center border-b border-t mt-4 px-4 py-2 hover:border-rose-500 text-white hover:text-rose-600"
        >
          Voir plus <Icon icon="mdi:chevron-down" className="size-5" />
        </button>
      )}
      {isLoading && visibleCount > 0 && (
        <div className="w-full flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      )}
    </div>
  );
}
