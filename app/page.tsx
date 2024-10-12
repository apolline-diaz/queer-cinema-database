import Card from "@/app/components/card";
import { supabase } from "@/lib/supabase";
import { getImageUrl } from "@/utils";
import Hero from "./components/hero";
import Searchbar from "./components/searchbar";

export const revalidate = 0;

export default async function Home() {
  const { data: topMovies, error: topMoviesError } = await supabase
    .from("movies")
    .select(`id, title, image_url, description, release_date`)
    .eq("boost", true)
    .range(0, 2);

  // Récupérer les films de genre "drame"
  const { data: dramaMovies, error: dramaError } = await supabase
    .from("movies")
    .select(
      `
        id, 
        title, 
        image_url, 
        release_date,
        movie_genres!inner(genre_id),
        genres:movie_genres!inner(genres(name))
      `
    )
    .eq("movie_genres.genre_id", 13) // ID du genre "drame"
    .range(0, 10);

  // Récupérer les films de genre "comédie"
  const { data: comedyMovies, error: comedyError } = await supabase
    .from("movies")
    .select(
      `
        id, 
        title, 
        image_url, 
        release_date,
        movie_genres!inner(genre_id),
        genres:movie_genres!inner(genres(name))
      `
    )
    .eq("movie_genres.genre_id", 15) // ID du genre "comédie"
    .range(0, 10);

  if (dramaError || comedyError) {
    return (
      <p>
        Erreur lors du chargement des films :{" "}
        {dramaError?.message || comedyError?.message}
      </p>
    );
  }

  if (!dramaMovies || !comedyMovies) {
    return <p>Films introuvables</p>;
  }

  if (!topMovies) {
    return <p>Films boostés introuvables</p>;
  }

  return (
    <main className="min-h-screen mx-auto max-w-[100rem]">
      <div className="">
        <div className="w-full cover">
          {topMovies.map((movie) => (
            <Hero
              key={`${movie.title}-${movie.id}`}
              {...movie}
              image_url={getImageUrl(movie.image_url)}
            />
          ))}
        </div>
      </div>

      <div className="px-10 pb-5">
        {/* Rangée de films de genre Drame */}
        <h2 className="text-xl my-5">drame</h2>
        <div className="flex flex-row-1 overflow-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {dramaMovies.map((movie) => (
            <Card
              directors={null}
              description={""}
              key={`${movie.title}-${movie.id}`}
              {...movie}
              image_url={getImageUrl(movie.image_url)}
            />
          ))}
        </div>

        {/* Rangée de films de genre Comédie */}
        <h2 className="text-xl my-5">comédie</h2>
        <div className="flex flex-row-1 overflow-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {comedyMovies.map((movie) => (
            <Card
              directors={null}
              description={""}
              key={`${movie.title}-${movie.id}`}
              {...movie}
              image_url={getImageUrl(movie.image_url)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
