"use client";

import React, { useState } from "react";
import SearchForm from "@/app/components/search-form";
import Searchfield from "@/app/components/searchfield";
import { Movie } from "../types/movie";
import { useRouter, useSearchParams } from "next/navigation";

interface ClientSearchComponentProps {
  initialMovies: Movie[];
  countries: { value: string; label: string }[];
  genres: { value: string; label: string }[];
  keywords: { value: string; label: string }[];
  directors: { value: string; label: string }[];
  releaseYears: { value: string; label: string }[];
  initialSearch?: string;
  userIsAdmin: boolean;
}

export default function ClientSearchComponent({
  initialMovies,
  countries,
  genres,
  keywords,
  directors,
  releaseYears,
  initialSearch = "",
  userIsAdmin,
}: ClientSearchComponentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Vérifier tous les paramètres pertinents
  const urlSearchMode = searchParams.get("searchMode") || "";
  const hasSearch = searchParams.has("search") || initialSearch !== "";

  // Définir le mode initial en fonction des paramètres d'URL
  // Priorité: 1. Mode explicite dans l'URL, 2. Présence de title/keyword, 3. Mode par défaut
  const initialMode =
    urlSearchMode === "field"
      ? "field"
      : urlSearchMode === "form"
        ? "form"
        : hasSearch
          ? "field"
          : "form";

  const [searchMode, setSearchMode] = useState<"field" | "form">(initialMode);

  // Mettre à jour l'URL quand le mode change
  const toggleSearchMode = (newMode: "field" | "form") => {
    const params = new URLSearchParams(searchParams.toString());
    // Définir le nouveau mode de recherche
    params.set("searchMode", newMode);

    // Si on passe en mode simple, effacer les paramètres avancés
    if (newMode === "field") {
      params.delete("countryId");
      params.delete("genreId");
      params.delete("keywordIds");
      params.delete("directorId");
      params.delete("startYear");
      params.delete("endYear");
      params.delete("type");
    }

    router.push(`/movies?${params.toString()}`, { scroll: false });
    setSearchMode(newMode);
  };
  return (
    <div className="">
      <div className="flex flex-wrap gap-2 w-full my-2">
        <button
          onClick={() => toggleSearchMode("field")}
          className={`w-full sm:w-auto text-sm font-light px-4 py-1 border rounded-full transition-colors ${
            searchMode === "field"
              ? "bg-rose-900 text-white border-rose-900 "
              : "bg-transparent text-rose-900 border-rose-900 hover:bg-rose-900 hover:text-white"
          }`}
        >
          Recherche simple
        </button>

        <button
          onClick={() => toggleSearchMode("form")}
          className={`w-full sm:w-auto text-sm font-light px-4 py-1 border rounded-full transition-colors ${
            searchMode === "form"
              ? "bg-rose-900 text-white border-rose-900 "
              : "bg-transparent text-rose-900 border-rose-900 hover:bg-rose-900 hover:text-white"
          }`}
        >
          Recherche avancée
        </button>
      </div>
      {searchMode === "field" ? (
        <Searchfield
          initialMovies={initialMovies}
          initialSearch={initialSearch}
          userIsAdmin={userIsAdmin}
        />
      ) : (
        <SearchForm
          userIsAdmin={userIsAdmin}
          initialMovies={initialMovies}
          countries={countries}
          genres={genres}
          keywords={keywords}
          directors={directors}
          releaseYears={releaseYears}
        />
      )}
    </div>
  );
}
