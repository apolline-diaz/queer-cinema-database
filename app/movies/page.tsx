import {
  searchMovies,
  getCountries,
  getGenres,
  getKeywords,
  getReleaseYears,
  getDirectors,
} from "@/app/server-actions/movies/search-movies";
import { isAdmin } from "@/utils/is-user-admin";
import { getMoviesByWord } from "../server-actions/movies/get-movies-by-word";
import BackButton from "../components/back-button";
import SearchForm from "../components/search-form";

export default async function MoviesPage({
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
  let initialMovies;

  if (searchModeParam === "field" || (!searchModeParam && searchParam)) {
    initialMovies = await getMoviesByWord(searchParam);
  } else {
    // Sinon récupérer tous les films
    initialMovies = await searchMovies({
      countryId,
      genreId,
      keywordIds,
      directorId,
      startYear,
      endYear,
      type,
    });
  }

  const countries = await getCountries();
  const genres = await getGenres();
  const keywords = await getKeywords();
  const directors = await getDirectors();
  const releaseYears = await getReleaseYears();

  return (
    <div className="h-full w-full justify-center items-center text-white">
      <div className="px-10 py-20">
        <BackButton />
        <h1 className="text-2xl font-bold text-rose-500 mb-5">Films</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex flex-col gap-5 w-full">
            <SearchForm
              userIsAdmin={userIsAdmin}
              initialMovies={initialMovies}
              countries={countries}
              genres={genres}
              keywords={keywords}
              directors={directors}
              releaseYears={releaseYears}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
