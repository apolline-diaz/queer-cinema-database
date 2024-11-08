import React, { useState, useEffect } from "react";
import { getMoviesByKeyword, getMoviesByTitle } from "@/utils/movies-search";

interface Movie {
  id: number;
  title: string;
  image_url: string;
  release_date: string;
}

export default function Searchbox({
  onResults,
}: {
  onResults: (movies: Movie[]) => void;
}) {
  const [titleSearch, setTitleSearch] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (titleSearch.trim()) {
        const results = await getMoviesByTitle(titleSearch);
        onResults(results); // Recherche par titre
      } else if (keywordSearch.trim()) {
        const results = await getMoviesByKeyword(keywordSearch);
        onResults(results); // Recherche par mot-clé
      } else {
        // Si aucun des champs n'est rempli, on retourne tous les films
        const results = await getMoviesByTitle(""); // Récupérer tous les films
        onResults(results);
      }
    }, 500); // Délai de 500ms après la dernière modification

    return () => clearTimeout(delayDebounceFn); // Nettoyage de la fonction lors du démontage
  }, [titleSearch, keywordSearch, onResults]);

  return (
    <div className="w-full">
      <form>
        <div className="w-full xs:w-1/2 flex flex-col gap-3">
          <input
            className="appearance-none text-lg font-light block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            id="title"
            type="text"
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            placeholder="Tapez un titre"
          />
          <input
            className="appearance-none text-lg font-light block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            id="keyword"
            type="text"
            value={keywordSearch}
            onChange={(e) => setKeywordSearch(e.target.value)}
            placeholder="Tapez un mot-clé"
          />
        </div>
      </form>
    </div>
  );
}
