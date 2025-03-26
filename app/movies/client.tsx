"use client";

import React, { useState } from "react";
import SearchForm from "@/app/components/search-form";
import Searchfield from "@/app/components/searchfield";
import { Movie } from "../types/movie";

interface ClientSearchComponentProps {
  initialMovies: Movie[];
  countries: { value: string; label: string }[];
  genres: { value: string; label: string }[];
  keywords: { value: string; label: string }[];
  releaseYears: { value: string; label: string }[];
  initialKeyword?: string;
}

export default function ClientSearchComponent({
  initialMovies,
  countries,
  genres,
  keywords,
  releaseYears,
  initialKeyword = "",
}: ClientSearchComponentProps) {
  const [searchMode, setSearchMode] = useState<"field" | "form">(
    initialKeyword ? "field" : "form"
  );

  const toggleSearchMode = () => {
    setSearchMode(searchMode === "field" ? "form" : "field");
  };

  return (
    <div>
      <div className="flex space-x-2 w-full my-2">
        <button
          onClick={() => setSearchMode("field")}
          className={`w-auto text-sm font-light px-4 py-1 border rounded-full transition-colors ${
            searchMode === "field"
              ? "bg-rose-500 text-white border-rose-500 "
              : "bg-transparent text-rose-500 border-rose-500 hover:bg-rose-600 hover:text-white"
          }`}
        >
          Recherche simple
        </button>

        <button
          onClick={() => setSearchMode("form")}
          className={`w-auto text-sm font-light px-4 py-1 border rounded-full transition-colors ${
            searchMode === "form"
              ? "bg-rose-500 text-white border-rose-500 "
              : "bg-transparent text-rose-500 border-rose-500 hover:bg-rose-600 hover:text-white"
          }`}
        >
          Recherche avancée
        </button>
      </div>
      {searchMode === "field" ? (
        <Searchfield
          initialMovies={initialMovies}
          initialKeyword={initialKeyword}
        />
      ) : (
        <SearchForm
          initialMovies={initialMovies}
          countries={countries}
          genres={genres}
          keywords={keywords}
          releaseYears={releaseYears}
        />
      )}
    </div>
  );
}
