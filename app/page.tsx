import HomeCard from "@/app/components/home-card";
import { getImageUrl } from "@/utils";
import Hero from "./components/hero";
import {
  getMoviesByGenre,
  getMoviesByYearRange,
  getTopMovies,
} from "@/utils/movies-queries";

export const revalidate = 0;

export default async function Home() {
  try {
    const { data: topMovies, error: topMoviesError } = await getTopMovies();
    if (topMoviesError) throw new Error(topMoviesError.message);

    const { data: dramaMovies, error: dramaError } = await getMoviesByGenre(13);
    if (dramaError) throw new Error(dramaError.message);

    const { data: comedyMovies, error: comedyError } = await getMoviesByGenre(
      15
    );
    if (comedyError) throw new Error(comedyError.message);

    const { data: documentaryMovies, error: documentaryError } =
      await getMoviesByGenre(9);
    if (documentaryError) throw new Error(documentaryError.message);

    const { data: ninetiesMovies, error: ninetiesError } =
      await getMoviesByYearRange("1990", "1999");
    if (ninetiesError) throw new Error(ninetiesError.message);

    if (
      !topMovies ||
      !dramaMovies ||
      !comedyMovies ||
      !documentaryMovies ||
      !ninetiesMovies
    ) {
      return <p>Films introuvables</p>;
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
              <HomeCard
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
              <HomeCard
                directors={null}
                description={""}
                key={`${movie.title}-${movie.id}`}
                {...movie}
                image_url={getImageUrl(movie.image_url)}
              />
            ))}
          </div>

          {/* documentary movies */}
          <h2 className="text-xl my-5">Documentaire</h2>
          <div className="flex flex-row-1 overflow-auto gap-5">
            {documentaryMovies.map((movie) => (
              <HomeCard
                directors={null}
                description={""}
                key={`${movie.title}-${movie.id}`}
                {...movie}
                image_url={getImageUrl(movie.image_url)}
              />
            ))}
          </div>

          {/* nineties movies */}
          <h2 className="text-xl my-5">Années 90</h2>
          <div className="flex flex-row-1 overflow-auto gap-5">
            {ninetiesMovies.map((movie) => (
              <HomeCard
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
  } catch (error) {
    // handler centralized for errors centralisée des erreurs
    return (
      <p>Erreur lors du chargement des films : {(error as Error).message}</p>
    );
  }
}
