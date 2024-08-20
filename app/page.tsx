import Card from "@/app/components/card";
import { supabase } from "@/lib/supabase";
import { getImageUrl } from "@/utils";

export const revalidate = 0;

export default async function Home() {
  const { data: topMovies, error: topMoviesError } = await supabase
    .from("movies")
    .select("id, title, image_url, description, release_date")
    .eq("boost", true)
    .range(0, 2);

  const { data: movies, error } = await supabase
    .from("movies")
    .select("id, title, image_url, description,release_date")
    .range(0, 27);

  if (!movies) {
    return <p>"Not found"</p>;
  }

  if (!topMovies) {
    return <p>"Not found"</p>;
  }

  return (
    <main className="min-h-screen mx-auto max-w-[100rem]">
      <div className="px-12 pt-12 pb-20">
        <div className="flex flex-col xl:flex-row gap-2 xl:gap-30">
          <div className="pt-3">
            <h2 className="text-4xl mb-5">TOP FILMS</h2>
            <p className="text-xl mb-5">
              Découvrez le meilleur des teen movies des années 2000
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {topMovies.map((movie) => (
              <Card
                key={`${movie.title}-${movie.id}`}
                {...movie}
                image_url={getImageUrl(movie.image_url)}
              />
            ))}
          </div>
        </div>
        <h2 className="text-4xl mt-20 mb-16">TOUS LES FILMS</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {movies.map((movie) => (
            <Card
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
