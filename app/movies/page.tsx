"use client";

import { useState, useEffect } from "react";
import Card from "@/app/components/card";
import SearchForm from "@/app/components/search-form";
import { getImageUrl } from "@/utils";
import { searchMovies } from "@/app/server-actions/movies/search-movies";

interface Movie {
  id: string;
  title: string;
  image_url: string;
  release_date: string;
}

export default function Catalogue() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all movies on initial page load
  useEffect(() => {
    const loadInitialMovies = async () => {
      setIsLoading(true);
      try {
        const initialMovies = await searchMovies({});
        setMovies(initialMovies);
      } catch (error) {
        console.error("Error loading initial movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialMovies();
  }, []);

  const handleSearchResults = (newMovies: Movie[]) => {
    setMovies(newMovies);
  };

  return (
    <div className="h-full w-full justify-center items-center text-white">
      <div className="px-10">
        <div className="tracking-wide text-xl pt-10 py-5 text-rose-500">
          Recherche
        </div>
        <SearchForm onSearchResults={handleSearchResults} />
      </div>

      <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-10">
        {isLoading ? (
          <p className="">Chargement ...</p>
        ) : movies.length === 0 ? (
          <p className="">Aucun film trouvé</p>
        ) : (
          movies.map((movie) => (
            <Card
              directors={null}
              key={`${movie.title}-${movie.id}`}
              {...movie}
              image_url={getImageUrl(movie.image_url)}
              description={""}
            />
          ))
        )}
      </div>
    </div>
  );
}
