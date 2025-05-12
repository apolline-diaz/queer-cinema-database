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
            <div className="flex flex-col">
              <h2 className="text-4xl mb-2 font-bold uppercase">
                {movie.title}
              </h2>
              <h2 className="text-lg font-light ">
                {movie.directors?.length > 0 && (
                  <span>
                    {movie.directors
                      .map((director) => director.name)
                      .join(", ")}
                  </span>
                )}
              </h2>
            </div>
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
      <div className="p-10 gap-3 flex flex-col">
        <div className="flex flex-col font-light">
          <span className="font-semibold  text-rose-500">
            {[
              movie.countries?.map((country) => country.name).join(", "),
              movie.release_date,
              movie.runtime ? `${movie.runtime}${durationText}` : null,
              movie.type,
              movie.language,
            ]
              .filter(Boolean)
              .join(" • ")}
          </span>
        </div>
        <div className="font-bold mb-2 ">
          {movie?.genres?.length > 0 && (
            <span className="font-light text-rose-500 pr-2">
              {movie.genres.map((genre) => genre.name).join(", ")}
            </span>
          )}
        </div>
        <p className="pt-6 pb-4 font-light text-black border-t border-black">
          {movie.description}
        </p>
        <div className="font-bold flex items-center flex-wrap gap-2">
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
  );
}
