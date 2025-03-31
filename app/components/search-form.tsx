"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { searchMovies } from "@/app/server-actions/movies/search-movies";
import Card from "./card";
import { getImageUrl } from "@/utils";
import Select from "./select";
import { Movie } from "../types/movie";
import MultiSelect from "./multi-select";

interface FormValues {
  countryId: string;
  genreId: string;
  keywordIds: { value: string; label: string }[]; // Changed to array of keywords
  directorId: string;
  releaseYear: string;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

// component for folding sections
function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className=" overflow-hidden border-b border-white">
      <button
        type="button"
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-sm mb-2">{title}</span>
        {isOpen ? (
          <Icon icon="line-md:chevron-up" className="size-5" />
        ) : (
          <Icon icon="line-md:chevron-down" className="size-5" />
        )}
      </button>
      {isOpen && <div className="mb-2">{children}</div>}
    </div>
  );
}

export default function SearchForm({
  initialMovies,
  countries,
  genres,
  keywords,
  directors,
  releaseYears,
  userIsAdmin,
}: {
  initialMovies: Movie[];
  countries: { value: string; label: string }[];
  genres: { value: string; label: string }[];
  keywords: { value: string; label: string }[];
  directors: { value: string; label: string }[];
  releaseYears: { value: string; label: string }[];
  userIsAdmin: boolean;
}) {
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      countryId: "",
      genreId: "",
      keywordIds: [], // Initialize as empty array
      directorId: "",
      releaseYear: "",
    },
  });

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize search parameters to prevent unnecessary re-renders
  const searchParams = watch();

  // handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true); // Show loading indicator

    try {
      const results = await searchMovies({
        countryId: data.countryId,
        genreId: data.genreId,
        keywordIds: data.keywordIds.map((keyword) => keyword.value), // Convert to array of keyword IDs
        directorId: data.directorId,
        releaseYear: data.releaseYear,
      });

      setMovies(results); // Update the movie list with search results
      setIsLoading(false);
    } catch (error) {
      console.error("Error searching movies:", error);
      setMovies([]); // Reset the movie list on error
      setIsLoading(false);
    }
  };

  // Reset form and fetch all movies
  const handleReset = async () => {
    reset(); // Reset all form values
    setIsLoading(true);

    try {
      const results = await searchMovies({
        countryId: "",
        genreId: "",
        keywordIds: [], // Pass empty array for keywords
        directorId: "",
        releaseYear: "",
      }); // Trigger search with no filters
      setMovies(results);
      setIsLoading(false);
    } catch (error) {
      console.error("Error resetting search:", error);
      setMovies([]); // Reset the movie list on error
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 p-4 border rounded-xl mb-4"
      >
        <div className="flex flex-col w-full mb-5">
          <div className="grid  grid-cols-1 sm:grid-cols-2 w-full gap-4 justify-between">
            <CollapsibleSection title="Pays">
              <Controller
                name="countryId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Pays"
                    options={countries}
                    {...field}
                    placeholder="Tous les pays"
                  />
                )}
              />
            </CollapsibleSection>
            <CollapsibleSection title="Genre">
              <Controller
                name="genreId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Genre"
                    options={genres}
                    {...field}
                    placeholder="Tous les genres"
                  />
                )}
              />
            </CollapsibleSection>
            <CollapsibleSection title="Année">
              <Controller
                name="releaseYear"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Année de sortie"
                    options={releaseYears}
                    {...field}
                    placeholder="Toutes les années"
                  />
                )}
              />
            </CollapsibleSection>
            <CollapsibleSection title="Réalisateur-ice">
              <Controller
                name="directorId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Réalisateur-ice"
                    options={directors}
                    {...field}
                    placeholder="Toutes les réalisateur-ices"
                  />
                )}
              />
            </CollapsibleSection>
          </div>
          <div className="py-2 mt-2 z-10">
            <CollapsibleSection title="Mots-clé">
              <Controller
                name="keywordIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    name="keywordIds"
                    control={control}
                    options={keywords}
                    label="Mots-clés"
                    placeholder="Rechercher des mots-clé"
                    onChange={field.onChange}
                  />
                )}
              />
            </CollapsibleSection>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:w-full gap-4">
          <button
            type="submit"
            className="xs:w-full sm:w-[200px] bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-md hover:from-rose-600 hover:to-red-600"
            disabled={isLoading}
          >
            Rechercher
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="xs:w-full sm:w-[200px] border hover:border-rose-500 hover:text-rose-500 text-white px-4 py-2 rounded-md"
            disabled={isLoading}
          >
            Réinitialiser
          </button>
        </div>
      </form>
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
          movies.map((movie) => (
            <Card
              key={`${movie.title}-${movie.id}`}
              {...movie}
              userIsAdmin={userIsAdmin}
              image_url={getImageUrl(movie.image_url || "")}
            />
          ))
        )}
      </div>
    </>
  );
}
