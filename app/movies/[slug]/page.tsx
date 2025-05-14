import { Image } from "@/app/components/image";
import { getImageUrl } from "@/utils/index";
import { getMovie } from "@/app/server-actions/movies/get-movie";
import Link from "next/link";
import { isAdmin } from "@/utils/is-user-admin";
import ClientMovieActions from "./client";
import { auth } from "@/utils/auth";

export const revalidate = 0;

type Props = {
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const { movie, error } = await getMovie(params.slug);
  const userIsAdmin = await isAdmin();
  const session = await auth();

  if (error) {
    return <div>Erreur lors du chargement du film : {error}</div>;
  }

  if (!movie) {
    return <div>Film introuvable</div>;
  }

  // Determine if we display "min" or "saison(s)" depending on the type
  const durationText =
    movie.type === "Série" || movie.type === "Emission TV"
      ? " saison(s)"
      : "min";
  return (
    <div className="w-full text-white mx-auto min-h-screen">
      <div className="h-[75vh] relative">
        <Image
          className="object-cover w-full h-full"
          alt={movie.title}
          src={getImageUrl(movie.image_url)}
          title={movie.title}
        />
        <div className="absolute bottom-0 bg-black bg-opacity-30 w-full h-full text-white p-10 flex justify-between items-end">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="">
              {session && (
                <ClientMovieActions
                  movieId={movie.id.toString()}
                  userIsAdmin={userIsAdmin}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-10 text-black flex flex-col font-light gap-3">
        <h2 className="text-4xl font-light uppercase text-rose-500">
          {movie.title}
        </h2>
        <h2 className="font-light text-lg">
          {movie.directors?.length > 0 && (
            <span>
              {movie.directors.map((director) => director.name).join(", ")}
            </span>
          )}
        </h2>
        <div className="flex flex-col sm:flex-row">
          <div className="min-w-[150px] uppercase grid sm:grid-cols-1 grid-cols-3 gap-4 font-light mt-4">
            <div className="text-sm ">
              <h3 className="mb-1 text-rose-500">Pays</h3>
              <span>
                {movie.countries?.map((country) => country.name).join(", ")}
              </span>
            </div>
            <div className="text-sm">
              <h3 className="mb-1 text-rose-500">Année</h3>
              <span>{movie.release_date}</span>
            </div>
            <div className="text-sm">
              <h3 className=" mb-1 text-rose-500">Durée</h3>
              <span>{movie.runtime} min</span>
            </div>
            <div className="text-sm">
              <h3 className=" mb-1 text-rose-500">Format</h3>
              <span>{movie.type}</span>
            </div>
            <div className="text-sm">
              <h3 className=" mb-1 text-rose-500">Langue(s)</h3>
              <span>{movie.language}</span>
            </div>
            {movie.genres?.length > 0 && (
              <div className="text-sm">
                <h3 className="mb-1 text-rose-500">Genre(s)</h3>
                <span>
                  {movie.genres.map((genre) => genre.name).join(", ")}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="mt-4 text-md mb-2">{movie.description}</p>
            <div className="font-bold flex items-center gap-y-3 flex-wrap py-3">
              {movie.keywords?.map((keyword) => (
                <Link
                  key={keyword.id}
                  href={`/movies?keywordIds=${encodeURIComponent(keyword.id.toString())}&searchMode=form`}
                >
                  <span className="font-light text-sm rounded-full border border-rose-500 text-rose-500 px-2 mr-1 py-1 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:cursor-pointer">
                    {keyword.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
