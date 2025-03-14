"use client";

import React, { useState } from "react";
import SearchForm from "@/app/components/search-form";
import Searchfield from "@/app/components/searchfield";
import { getImageUrl } from "@/utils";
import Card from "../components/card";

interface Movie {
  id: string;
  title: string;
  image_url: string;
  release_date: string;
}

interface ClientSearchComponentProps {
  initialMovies: Movie[];
  countries: { value: string; label: string }[];
  genres: { value: string; label: string }[];
  keywords: { value: string; label: string }[];
  releaseYears: { value: string; label: string }[];
}

export default function ClientSearchComponent({
  initialMovies,
  countries,
  genres,
  keywords,
  releaseYears,
}: ClientSearchComponentProps) {
  const [searchMode, setSearchMode] = useState<"form" | "field">("form");

  const toggleSearchMode = () => {
    setSearchMode(searchMode === "form" ? "field" : "form");
  };

  return (
    <div>
      <button
        onClick={toggleSearchMode}
        className="xs:w-full w-auto my-2 font-light hover:bg-rose-500 hover:text-white bg-transparent text-rose-500 border p-2 border-rose-500 rounded-md"
      >
        {searchMode === "form"
          ? "Rechercher par titre ou mot-clé? "
          : "Rechercher des films par filtres?"}
      </button>

      {searchMode === "form" ? (
        <SearchForm
          initialMovies={initialMovies}
          countries={countries}
          genres={genres}
          keywords={keywords}
          releaseYears={releaseYears}
        />
      ) : (
        <Searchfield initialMovies={initialMovies} />
      )}
    </div>
  );
}
