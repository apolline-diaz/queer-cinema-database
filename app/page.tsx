import Card from "@/app/components/card";
import { supabase } from "@/lib/supabase";
import { getImageUrl } from "@/utils";
import Hero from "./components/hero";

export const revalidate = 0;

export default async function Home() {
  const { data: topMovies, error: topMoviesError } = await supabase
    .from("movies")
    .select(`id, title, image_url, description, release_date`)
    .eq("boost", true)
    .range(0, 1);

  // get movies by drama genre
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
    .eq("movie_genres.genre_id", 13) // id for drama genre
    .range(0, 10);

  // get movies by comedy genre
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
    .eq("movie_genres.genre_id", 15) // id for comedy genre
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
    <main className="w-full">
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
        {/* drama movies */}
        <h2 className="text-xl my-5">Drame</h2>
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

        {/* comedy movies */}
        <h2 className="text-xl my-5">Comédie</h2>
        <div className="flex flex-row-1 overflow-auto gap-5">
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
