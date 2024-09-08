import Card from "@/app/components/card";
import { supabase } from "@/lib/supabase";
import { getImageUrl } from "@/utils";
import Hero from "./components/hero";

export const revalidate = 0;

export default async function Home() {
  const { data: topMovies, error: topMoviesError } = await supabase
    .from("movies")
    .select(`id, title, image_url,description, release_date`)
    .eq("boost", true)
    .range(0, 2);

  const { data: movies, error } = await supabase
    .from("movies")
    .select(`id, title, image_url, release_date`)
    .range(0, 27);

  if (!movies) {
    return <p>Not found</p>;
  }

  if (!topMovies) {
    return <p>Not found</p>;
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
      <div className="px-10 pb-5 ">
        <h2 className="text-xl my-5">Teen Movies</h2>
        <div className="flex flex-row-1 overflow-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {movies.map((movie) => (
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
