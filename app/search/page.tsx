import { isAdmin } from "@/utils/is-user-admin";
import { getMoviesByWord } from "../server-actions/movies/get-movies-by-word";
import BackButton from "../components/back-button";
import Searchfield from "@/app/components/searchfield";
import { Movie } from "../types/movie";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const userIsAdmin = await isAdmin();

  // Récupérer le terme de recherche depuis l'URL (q pour query)
  const searchQuery = (searchParams?.q as string) || "";

  // Rechercher les films si un terme est fourni
  let initialMovies: Movie[] = [];
  if (searchQuery) {
    initialMovies = await getMoviesByWord(searchQuery);
  }

  return (
    <div className="h-full w-full justify-center items-center text-white">
      <div className="px-10 py-20">
        <BackButton />
        <h1 className="text-2xl font-bold text-rose-500 mb-5">Recherche</h1>

        <div className="mb-4">
          <Searchfield
            initialMovies={initialMovies}
            initialSearch={searchQuery}
            userIsAdmin={userIsAdmin}
          />
        </div>
      </div>
    </div>
  );
}
