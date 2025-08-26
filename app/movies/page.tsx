import { searchMoviesPaginated } from "@/app/server-actions/movies/search-movies";
import ClientSearchComponent from "./client";
import { isAdmin } from "@/utils/is-user-admin";
import { searchMoviesByWordPaginated } from "../server-actions/movies/get-movies-by-word";
import BackButton from "../components/back-button";
import { getCountries } from "@/app/server-actions/countries/get-countries";
import { getGenres } from "@/app/server-actions/genres/get-genres";
import { getKeywords } from "@/app/server-actions/keywords/get-keywords";
import { getDirectors } from "@/app/server-actions/directors/get-directors";
import { getReleaseYears } from "../server-actions/movies/get-release-years";

export default async function CataloguePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Get keyword from URL parameters if it exists
  const userIsAdmin = await isAdmin();

  // Extraire tous les paramètres d'URL pour le searchform
  const countryId = (searchParams?.countryId as string) || "";
  const genreId = (searchParams?.genreId as string) || "";
  const keywordIds = searchParams?.keywordIds
    ? (searchParams.keywordIds as string).split(",")
    : [];
  const directorId = (searchParams?.directorId as string) || "";
  const startYear = (searchParams?.startYear as string) || "";
  const endYear = (searchParams?.endYear as string) || "";
  const type = (searchParams?.type as string) || "";

  // Extraire tous les paramètres d'URL pour le searchfield
  const searchParam = (searchParams?.search as string) || "";
  const searchModeParam = (searchParams?.searchMode as string) || "";

  // Récupérer les films selon le mode de recherche
  let initialResult;

  if (searchModeParam === "field" || (!searchModeParam && searchParam)) {
    initialResult = await searchMoviesByWordPaginated({
      search: searchParam,
      page: 1,
      limit: 20,
    });
  } else {
    // Sinon récupérer tous les films
    initialResult = await searchMoviesPaginated({
      countryId,
      genreId,
      keywordIds,
      directorId,
      startYear,
      endYear,
      type,
      page: 1,
      limit: 20,
    });
  }
  const [countries, genres, keywords, directors, releaseYears] =
    await Promise.all([
      getCountries(),
      getGenres(),
      getKeywords(),
      getDirectors(),
      getReleaseYears(),
    ]);

  return (
    <div className="h-full w-full justify-center items-center text-white">
      <div className="px-10 py-20">
        <BackButton />
        <h1 className="text-2xl font-bold text-rose-500 mb-5">Catalogue</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex flex-col gap-5 w-full">
            <ClientSearchComponent
              initialMovies={initialResult.movies}
              initialTotalCount={initialResult.totalCount}
              initialHasMore={initialResult.hasMore}
              countries={countries}
              genres={genres}
              keywords={keywords}
              directors={directors}
              releaseYears={releaseYears}
              initialSearch={searchParam}
              userIsAdmin={userIsAdmin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
