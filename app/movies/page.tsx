import { searchMoviesPaginated } from "@/app/server-actions/movies/search-movies";
import { getCountriesOnlyAssociatedToMovies } from "@/app/server-actions/countries/get-countries-only-associated-movies";
import { getGenres } from "@/app/server-actions/genres/get-genres";
import { getKeywords } from "@/app/server-actions/keywords/get-keywords";
import { getDirectors } from "@/app/server-actions/directors/get-directors";
import { getReleaseYears } from "../server-actions/movies/get-release-years";
import { isAdmin } from "@/utils/is-user-admin";
import { getMoviesByWord } from "../server-actions/movies/get-movies-by-word";
import BackButton from "../components/back-button";
import SearchForm from "../components/search-form";

export default async function MoviesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
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

  // ADAPTATION: Utiliser searchMoviesPaginated au lieu de searchMovies
  let initialResult;

  if (searchModeParam === "field" || (!searchModeParam && searchParam)) {
    // Si vous avez une version paginée de getMoviesByWord, utilisez-la
    // Sinon, adaptez cette partie selon votre logique
    const movies = await getMoviesByWord(searchParam);
    initialResult = {
      movies: movies || [],
      totalCount: movies?.length || 0,
      hasMore: false, // Pas de pagination pour la recherche par mot pour l'instant
      currentPage: 1,
    };
  } else {
    // Utiliser la fonction paginée
    initialResult = await searchMoviesPaginated({
      countryId,
      genreId,
      keywordIds,
      directorId,
      startYear,
      endYear,
      type,
      page: 1,
      limit: 100,
    });
  }

  // Récupérer les données pour les filtres
  const [
    countriesData,
    genresData,
    keywordsData,
    directorsData,
    releaseYearsData,
  ] = await Promise.all([
    getCountriesOnlyAssociatedToMovies(),
    getGenres(),
    getKeywords(),
    getDirectors(),
    getReleaseYears(),
  ]);

  // Transformation des données pour le format attendu par SearchForm
  const countries = countriesData.map((country) => ({
    value: country.id.toString(),
    label: country.name,
  }));

  const genres = genresData.map((genre) => ({
    value: genre.id.toString(),
    label: genre.name || "",
  }));

  const keywords = keywordsData.map((keyword) => ({
    value: keyword.value,
    label: keyword.label,
  }));

  const directors = directorsData.map((director) => ({
    value: director.id.toString(),
    label: director.name || "",
  }));

  const releaseYears = releaseYearsData.map((year) => ({
    value: year,
    label: year,
  }));

  return (
    <div className="h-full w-full justify-center items-center text-white">
      <div className="px-[clamp(1.25rem,5vw,2.5rem)] py-20">
        <BackButton />
        <h1 className="text-2xl font-bold text-pink-500 mb-5">Films</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex flex-col gap-5 w-full">
            <SearchForm
              userIsAdmin={userIsAdmin}
              initialMovies={initialResult.movies}
              initialTotalCount={initialResult.totalCount}
              initialHasMore={initialResult.hasMore}
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
