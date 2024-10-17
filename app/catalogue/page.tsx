"use client";

import { useState } from "react";
import Card from "@/app/components/card";
import Searchbox from "@/app/components/searchbox";
import { getImageUrl } from "@/utils";

interface Movie {
  id: number;
  title: string;
  image_url: string;
  release_date: string;
}

export default function Catalogue() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSearchResults = (newMovies: Movie[]) => {
    setMovies(newMovies);
  };

  return (
    <div className="h-full w-full justify-center items-center">
      <div className="border-b border-black p-10">
        <div className="tracking-wide text-xl mb-5">Recherche par mot-clé</div>
        <Searchbox onResults={handleSearchResults} />
      </div>

      <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 p-10">

        {movies.length === 0 ? (
          <p className="">Chargement ...</p>
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
