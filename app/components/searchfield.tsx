import React, { useState, useEffect } from "react";
import {
  getMoviesByKeyword,
  getMoviesByTitle,
} from "@/app/server-actions/movies/get-movies-by-title-and-keyword";
import Card from "./card";
import { getImageUrl } from "@/utils";

interface Movie {
  id: string;
  title: string;
  image_url: string | null;
  release_date: string | null;
}

export default function Searchfield({
  initialMovies,
}: {
  initialMovies: Movie[];
}) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [titleSearch, setTitleSearch] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (titleSearch.trim()) {
        const results = await getMoviesByTitle(titleSearch);
        setMovies(results); // Mise à jour des films avec la recherche par titre
      } else if (keywordSearch.trim()) {
        const results = await getMoviesByKeyword(keywordSearch);
        setMovies(results); // Mise à jour des films avec la recherche par mot-clé
      } else {
        setMovies(initialMovies);
        setIsLoading(false); // Récupérer tous les films
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [titleSearch, keywordSearch, initialMovies]);

  return (
    <div className="w-full ">
      <form>
        <div className="w-full xs:w-1/2 my-5 flex flex-col sm:flex-row gap-3">
          <input
            className="appearance-none text-md font-light block w-full bg-neutral-950 border-b border-b-white text-gray-200 py-3 leading-tight focus:none focus:outline-none "
            id="title"
            type="text"
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            placeholder="Entrez un titre"
          />
          <input
            className="appearance-none text-md font-light block w-full bg-neutral-950 border-b border-b-white text-gray-200 py-3 leading-tight focus:none focus:outline-none"
            id="keyword"
            type="text"
            value={keywordSearch}
            onChange={(e) => setKeywordSearch(e.target.value)}
            placeholder="Entrez un mot-clé"
          />
        </div>
      </form>
      <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-500 h-48 w-full justify-end max-w-xs mx-auto group overflow-hidden flex flex-col transition-transform"
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
          movies.map((movie) => (
            <Card
              directors={null}
              key={`${movie.title}-${movie.id}`}
              {...movie}
              image_url={getImageUrl(
                movie.image_url || "public/assets/missing_image.png"
              )}
              description={""}
            />
          ))
        )}
      </div>
    </div>
  );
}
