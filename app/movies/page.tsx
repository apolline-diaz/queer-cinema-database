import {
  searchMovies,
  getCountries,
  getGenres,
  getKeywords,
  getReleaseYears,
} from "@/app/server-actions/movies/search-movies";
import ClientSearchComponent from "./client";

interface Movie {
  id: string;
  title: string;
  image_url: string;
  release_date: string;
}

export default async function Catalogue() {
  // get filter data and all movies (initial movies)
  const initialMovies = await searchMovies({});
  const countries = await getCountries();
  const genres = await getGenres();
  const keywords = await getKeywords();
  const releaseYears = await getReleaseYears();

  return (
    <div className="h-full w-full justify-center items-center text-white">
      <div className="px-10 pt-10">
        <h1 className="text-2xl text-rose-500 font-medium mb-5">Recherche</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex flex-col gap-5 w-full">
            <ClientSearchComponent
              initialMovies={initialMovies}
              countries={countries}
              genres={genres}
              keywords={keywords}
              releaseYears={releaseYears}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
