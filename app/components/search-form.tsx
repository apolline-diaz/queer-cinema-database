"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { searchMovies } from "@/app/server-actions/movies/search-movies";
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

const MOVIES_PER_PAGE = 20;

function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="overflow-hidden border-b border-rose-900">
      <button
        type="button"
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-rose-900 text-sm mb-2">{title}</span>
        {isOpen ? (
          <Icon icon="line-md:chevron-up" className="text-rose-900 size-5" />
        ) : (
          <Icon icon="line-md:chevron-down" className="size-5 text-rose-900" />
        )}
      </button>
      {isOpen && <div className="pb-2">{children}</div>}
    </div>
  );
}

interface SearchFormProps {
  initialMovies: Movie[];
  countries: { value: string; label: string }[];
  genres: { value: string; label: string }[];
  keywords: { value: string; label: string }[];
  directors: { value: string; label: string }[];
  releaseYears: { value: string; label: string }[];
  userIsAdmin: boolean;
}

export default function SearchForm({
  initialMovies,
  countries,
  genres,
  keywords,
  directors,
  releaseYears,
  userIsAdmin,
}: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Refs pour l'IntersectionObserver
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // États
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentSearchParams, setCurrentSearchParams] = useState<FormValues>({
    countryId: "",
    genreId: "",
    keywordIds: [],
    directorId: "",
    startYear: "",
    endYear: "",
    type: "",
  });

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

  const startYear = watch("startYear");
  const endYear = watch("endYear");

  // Validation des années
  useEffect(() => {
    if (startYear && endYear && parseInt(startYear) > parseInt(endYear)) {
      setValue("endYear", startYear);
    }
  }, [startYear, endYear, setValue]);

  // Fonction pour charger plus de films (lazy loading)
  const loadMoreMovies = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const result = await searchMovies({
        countryId: currentSearchParams.countryId,
        genreId: currentSearchParams.genreId,
        keywordIds: currentSearchParams.keywordIds.map((k) => k.value),
        directorId: currentSearchParams.directorId,
        startYear: currentSearchParams.startYear,
        endYear: currentSearchParams.endYear,
        type: currentSearchParams.type,
        page: nextPage,
        limit: MOVIES_PER_PAGE,
      });

      setMovies((prev) => [...prev, ...result.movies]);
      setCurrentPage(nextPage);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, currentSearchParams, hasMore, isLoadingMore]);

  // IntersectionObserver pour le lazy loading automatique
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoadingMore && hasMore) {
        loadMoreMovies();
      }
    },
    [isLoadingMore, hasMore, loadMoreMovies]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observerRef.current = new IntersectionObserver(handleObserver, option);
    const currentLoader = loaderRef.current;

    if (currentLoader && hasMore) {
      observerRef.current.observe(currentLoader);
    }

    return () => {
      if (currentLoader && observerRef.current) {
        observerRef.current.unobserve(currentLoader);
      }
    };
  }, [handleObserver, hasMore]);

  // Fonction pour rechercher (première page)
  const searchMoviesFirstPage = async (searchParams: FormValues) => {
    try {
      const result = await searchMovies({
        countryId: searchParams.countryId,
        genreId: searchParams.genreId,
        keywordIds: searchParams.keywordIds.map((k) => k.value),
        directorId: searchParams.directorId,
        startYear: searchParams.startYear,
        endYear: searchParams.endYear,
        type: searchParams.type,
        page: 1,
        limit: MOVIES_PER_PAGE,
      });

      setMovies(result.movies);
      setTotalCount(result.totalCount);
      setCurrentPage(1);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error searching movies:", error);
      setMovies([]);
      setTotalCount(0);
      setHasMore(false);
    }
  };

  // Soumission du formulaire
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setCurrentSearchParams(data);

    // Mise à jour de l'URL
    const params = new URLSearchParams();
    if (data.countryId) params.set("countryId", data.countryId);
    if (data.genreId) params.set("genreId", data.genreId);
    if (data.keywordIds.length > 0) {
      const keywordIdsString = data.keywordIds.map((k) => k.value).join(",");
      params.set("keywordIds", keywordIdsString);
    }
    if (data.directorId) params.set("directorId", data.directorId);
    if (data.startYear) params.set("startYear", data.startYear);
    if (data.endYear) params.set("endYear", data.endYear);
    if (data.type) params.set("type", data.type);

    router.replace(`/movies?${params.toString()}`);

    await searchMoviesFirstPage(data);
    setIsLoading(false);
  };

  // Reset du formulaire
  const handleReset = async () => {
    const emptyParams = {
      countryId: "",
      genreId: "",
      keywordIds: [],
      directorId: "",
      startYear: "",
      endYear: "",
      type: "",
    };

    reset(emptyParams);
    setCurrentSearchParams(emptyParams as FormValues);
    setIsLoading(true);

    router.replace("/movies");

    await searchMoviesFirstPage(emptyParams as FormValues);
    setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4 justify-between mb-5">
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

        <div className="flex flex-col sm:flex-row sm:w-full gap-4">
          <button
            type="submit"
            className="xs:w-full sm:w-[200px] transition-colors duration-200 ease-in-out bg-rose-900 text-white px-4 py-2 rounded-xl hover:bg-rose-500"
            disabled={isLoading}
          >
            {isLoading ? "Recherche..." : "Rechercher"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="xs:w-full sm:w-[200px] border transition-colors duration-200 ease-in-out hover:border-rose-500 hover:text-rose-500 text-rose-900 px-4 py-2 border-rose-900 rounded-xl"
            disabled={isLoading}
          >
            Réinitialiser
          </button>
        </div>
      </form>

      <div className="text-rose-900 border-b border-rose-900 text-md font-light mb-5">
        {isLoading ? (
          <div className="animate-pulse rounded-md h-6 bg-gray-300 w-1/4 mb-2"></div>
        ) : (
          `${totalCount} titres trouvés${movies.length < totalCount ? ` (${movies.length} affichés)` : ""}`
        )}
      </div>

      <div className="w-full grid gap-3 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {isLoading ? (
          // Skeleton loader (6 cards)
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
        ) : Array.isArray(movies) && movies.length === 0 ? (
          // Aucun film
          <p className="col-span-full text-center text-gray-500">
            Aucun film trouvé
          </p>
        ) : (
          // Liste de films
          Array.isArray(movies) &&
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

      {/* Loader de fin de scroll */}
      {hasMore && !isLoading && (
        <div
          ref={loaderRef}
          className="w-full flex justify-center items-center mt-4"
        >
          {isLoadingMore ? (
            <div className="flex items-center text-rose-900 text-sm">
              <Icon icon="line-md:loading-loop" className="size-5 mr-2" />
              Chargement…
            </div>
          ) : (
            <div className="animate-pulse text-rose-900 text-sm">
              Faites défiler pour charger plus
            </div>
          )}
        </div>
      )}
    </>
  );
}
