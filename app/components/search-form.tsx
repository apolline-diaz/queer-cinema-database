"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { searchMoviesPaginated } from "@/app/server-actions/movies/search-movies";
import Card from "./card";
import { getImageUrl } from "@/utils";
import Select from "./select";
import { Movie } from "../types/movie";
import MultiSelect from "./multi-select";
import { useRouter, useSearchParams } from "next/navigation";

interface FormValues {
  countryId: string;
  genreId: string;
  keywordIds: { value: string; label: string }[];
  directorId: string;
  startYear: string;
  endYear: string;
  type: string;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

// component for folding sections
function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="overflow-hidden">
      <button
        type="button"
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-black text-sm mb-2">{title}</span>
        {isOpen ? (
          <Icon icon="line-md:chevron-up" className="text-black size-5" />
        ) : (
          <Icon icon="line-md:chevron-down" className="size-5 text-black " />
        )}
      </button>
      {isOpen && <div className="pb-2">{children}</div>}
    </div>
  );
}

interface SearchFormProps {
  initialMovies: Movie[];
  initialTotalCount: number;
  initialHasMore: boolean;
  countries: { value: string; label: string }[];
  genres: { value: string; label: string }[];
  keywords: { value: string; label: string }[];
  directors: { value: string; label: string }[];
  releaseYears: { value: string; label: string }[];
  userIsAdmin: boolean;
  urlParams?: {
    countryId: string;
    genreId: string;
    keywordIds: string[];
    directorId: string;
    startYear: string;
    endYear: string;
    type: string;
  };
}

export default function SearchForm({
  initialMovies = [],
  initialTotalCount = 0,
  initialHasMore = false,
  countries = [],
  genres = [],
  keywords = [],
  directors = [],
  releaseYears = [],
  userIsAdmin = false,
}: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer les paramètres de l'URL
  const urlCountryId = searchParams.get("countryId") || "";
  const urlGenreId = searchParams.get("genreId") || "";
  const urlDirectorId = searchParams.get("directorId") || "";
  const urlStartYear = searchParams.get("startYear") || "";
  const urlEndYear = searchParams.get("endYear") || "";
  const urlType = searchParams.get("type") || "";

  const urlKeywordIds = searchParams.get("keywordIds")
    ? searchParams
        .get("keywordIds")
        ?.split(",")
        .map((id) => {
          const keyword = keywords.find((k) => k.value === id);
          return keyword ? { value: id, label: keyword.label } : null;
        })
        .filter(Boolean) || []
    : [];

  const { control, setValue, handleSubmit, reset, watch } = useForm<FormValues>(
    {
      defaultValues: {
        countryId: urlCountryId,
        genreId: urlGenreId,
        keywordIds: urlKeywordIds as any,
        directorId: urlDirectorId,
        startYear: urlStartYear,
        endYear: urlEndYear,
        type: urlType,
      },
    }
  );

  // États pour la pagination infinie au lieu du simple "visibleCount"
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Get the currently selected years to enforce validation
  const startYear = watch("startYear");
  const endYear = watch("endYear");

  // Validate year selection
  useEffect(() => {
    if (startYear && endYear && parseInt(startYear) > parseInt(endYear)) {
      setValue("endYear", startYear);
    }
  }, [startYear, endYear, setValue]);

  // Fonction pour charger plus de films (pagination infinie)
  const loadMoreMovies = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    try {
      const formData = watch();
      const result = await searchMoviesPaginated({
        countryId: formData.countryId,
        genreId: formData.genreId,
        keywordIds: formData.keywordIds.map((k) => k.value),
        directorId: formData.directorId,
        startYear: formData.startYear,
        endYear: formData.endYear,
        type: formData.type,
        page: currentPage + 1,
        limit: 50,
      });

      setMovies((prev) => [...(prev || []), ...(result.movies || [])]);
      setHasMore(result.hasMore);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // handle form submission avec searchMoviesPaginated
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    // Reset pagination
    setCurrentPage(1);
    setMovies([]);

    // Construire les paramètres de recherche pour l'URL
    const params = new URLSearchParams();
    if (data.countryId) params.set("countryId", data.countryId);
    if (data.genreId) params.set("genreId", data.genreId);
    if (data.keywordIds && data.keywordIds.length > 0) {
      const keywordIdsString = data.keywordIds.map((k) => k.value).join(",");
      params.set("keywordIds", keywordIdsString);
    }
    if (data.directorId) params.set("directorId", data.directorId);
    if (data.startYear) params.set("startYear", data.startYear);
    if (data.endYear) params.set("endYear", data.endYear);
    if (data.type) params.set("type", data.type);

    router.replace(`/movies?${params.toString()}`);

    try {
      const result = await searchMoviesPaginated({
        countryId: data.countryId,
        genreId: data.genreId,
        keywordIds: data.keywordIds?.map((keyword) => keyword.value) || [],
        directorId: data.directorId,
        startYear: data.startYear,
        endYear: data.endYear,
        type: data.type,
        page: 1,
        limit: 50,
      });

      setMovies(result.movies || []);
      setTotalCount(result.totalCount || 0);
      setHasMore(result.hasMore || false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching movies:", error);
      setMovies([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form avec searchMoviesPaginated
  const handleReset = async () => {
    reset({
      countryId: "",
      genreId: "",
      keywordIds: [],
      directorId: "",
      startYear: "",
      endYear: "",
      type: "",
    });

    setIsLoading(true);
    setCurrentPage(1);
    setMovies([]);

    router.replace("/movies");

    try {
      const result = await searchMoviesPaginated({
        countryId: "",
        genreId: "",
        keywordIds: [],
        directorId: "",
        startYear: "",
        endYear: "",
        type: "",
        page: 1,
        limit: 50,
      });

      setMovies(result.movies || []);
      setTotalCount(result.totalCount || 0);
      setHasMore(result.hasMore || false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error resetting search:", error);
      setMovies([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 mb-4 sm:w-1/4">
          <p className="mb-3 font-semibold flex flex-row gap-2 text-gray-500 justify-left items-center rounded-xl bg-gray-100 border border-gray-200 p-2">
            <Icon icon="gridicons:filter" className="size-5 " />
            <span>Recherche par filtres</span>
          </p>
          <div className="grid grid-cols-1 w-full gap-3 justify-between mb-5">
            <CollapsibleSection title="Période">
              <div className="grid grid-cols-2 gap-2">
                <Controller
                  name="startYear"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="De l'année"
                      options={releaseYears}
                      {...field}
                      placeholder="Année min"
                    />
                  )}
                />
                <Controller
                  name="endYear"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="À l'année"
                      options={releaseYears}
                      {...field}
                      placeholder="Année max"
                    />
                  )}
                />
              </div>
            </CollapsibleSection>

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

            <CollapsibleSection title="Format">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Type"
                    options={[
                      { value: "Long-métrage", label: "Long-métrage" },
                      { value: "Moyen-métrage", label: "Moyen-métrage" },
                      { value: "Court-métrage", label: "Court-métrage" },
                      { value: "Emission TV", label: "Emission TV" },
                      { value: "Série", label: "Série" },
                    ]}
                    {...field}
                    placeholder="Tous les formats"
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

            <CollapsibleSection title="Mots-clés">
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

          <div className="flex flex-col sm:flex-wrap gap-4">
            <button
              type="submit"
              className="w-full transition-colors duration-200 ease-in-out bg-black text-white px-4 py-2 rounded-xl hover:bg-pink-500"
              disabled={isLoading}
            >
              {isLoading ? "Recherche..." : "Rechercher"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full border transition-colors duration-200 ease-in-out hover:border-pink-500 hover:text-pink-500 text-black px-4 py-2 border-black rounded-xl"
              disabled={isLoading}
            >
              Réinitialiser
            </button>
          </div>
        </form>

        <div className="p-0 sm:pl-10 pt-2">
          <div className="border-l-4 text-sm border-pink-500 pl-4 py-2 pt-2 mb-6">
            {isLoading ? (
              <div className="animate-pulse rounded-md h-6 bg-gray-300 w-32"></div>
            ) : (
              <div className="text-gray-800">
                <span
                  className="text-pink-500 font-semibold"
                  data-testid="results-count"
                >
                  {totalCount}
                </span>
                <span className="text-gray-600 ml-2">titres trouvés</span>
                {movies && movies.length > 0 && movies.length < totalCount && (
                  <span className="text-gray-500 ml-2">
                    (affichage de {movies.length})
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="w-full grid gap-3 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-gray-300 h-[200px] w-full rounded-xl justify-end max-w-xs mx-auto group overflow-hidden flex flex-col transition-transform"
                >
                  <div className="flex flex-col p-5 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  </div>
                </div>
              ))
            ) : !movies || movies.length === 0 ? (
              <p>Aucun film trouvé</p>
            ) : (
              movies.map((movie, index) => (
                <Card
                  key={`${movie.title}-${movie.id}-${index}`}
                  {...movie}
                  userIsAdmin={userIsAdmin}
                  image_url={getImageUrl(movie.image_url || "")}
                />
              ))
            )}
          </div>
          {hasMore && !isLoading && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreMovies}
                disabled={isLoadingMore}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                {isLoadingMore ? (
                  "Chargement..."
                ) : (
                  <>
                    Voir plus{" "}
                    <Icon icon="mdi:chevron-down" className="size-5" />
                  </>
                )}{" "}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
