import { Image } from "@/app/components/image";
import { getImageUrl } from "@/utils/index";
import { getMovie } from "@/app/server-actions/movies/get-movie";
import Link from "next/link";
import { isAdmin } from "@/utils/is-user-admin";
import ClientMovieActions from "./client";
import { auth } from "@/utils/auth";
import BackButton from "@/app/components/back-button";
import { Metadata } from "next";
import { getCanonicalUrl } from "@/utils/index";
import { getMovieLinks } from "@/app/server-actions/movies/get-links";
import { Icon } from "@iconify/react/dist/iconify.js";

export const revalidate = 0;

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { movie } = await getMovie(params.slug);

  if (!movie) {
    return {
      title: "Film introuvable | Queer Cinema Database",
      description:
        "Le film demandé est introuvable dans notre base de données.",
    };
  }

  return {
    metadataBase: new URL(getCanonicalUrl()),
    title: `${movie.title} | Queer Cinema Database`,
    description:
      movie.description ||
      `Découvrez ${movie.title} sur Queer Cinema Database.`,
    alternates: {
      canonical: `/movies/${params.slug}`,
    },
    openGraph: {
      title: movie.title,
      description: movie.description || "",
      images: [
        {
          url: movie.image_url || "",
          alt: movie.title,
        },
      ],
    },
  };
}

export default async function MoviePage({ params }: Props) {
  const { movie, error } = await getMovie(params.slug);
  const userIsAdmin = await isAdmin();
  const session = await auth();

  if (error) {
    return <div>Erreur lors du chargement du film : {error}</div>;
  }

  if (!movie) {
    return <div>Film introuvable</div>;
  }

  const links = await getMovieLinks(movie.id.toString());

  // Determine if we display "min" or "saison(s)" depending on the type
  const durationText =
    movie.type === "Série" || movie.type === "Emission TV"
      ? " saison(s)"
      : "min";
  return (
    <div className="w-full text-white mx-auto min-h-screen">
      <div className="max-h-[75vh] min-h-[40vh] relative">
        <Image
          className="object-cover w-full max-h-[75vh] min-h-[40vh]"
          alt={movie.title}
          src={getImageUrl(movie.image_url)}
          title={movie.title}
        />
        <div className="absolute bottom-0 w-full h-full text-white p-10 flex justify-between items-end">
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
          {links.length > 0 && (
            <div className="w-full flex flex-col mt-4 r-0">
              <div className="flex flex-wrap gap-2 justify-end">
                {links.map((l: any, index: number) => (
                  <Link
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-row flex justify-between items-center gap-2 transition-colors duration-200 px-4 py-2 bg-rose-500 text-white hover:bg-rose-700 rounded-full hover:opacity-90"
                  >
                    Voir le film{links.length > 1 ? ` ${index + 1}` : ""}
                    <Icon icon="lsicon:play-outline" className="size-5" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-[clamp(1.25rem,5vw,2.5rem)] pt-5">
        <BackButton className="w-fit" />
      </div>

      <div className="px-[clamp(1.25rem,5vw,2.5rem)] pb-5 text-black flex flex-col font-light gap-3">
        <h1 className="text-4xl font-medium text-rose-500">{movie.title}</h1>
        {movie.original_title && (
          <h1 className="text-xl font-light text-gray-400">
            {movie.original_title}
          </h1>
        )}

        <h2 className="font-medium text-lg mb-2 flex flex-wrap gap-x-2">
          {movie.directors?.map((director, index) => (
            <Link
              key={director.id}
              href={`/movies?directorId=${encodeURIComponent(director.id.toString())}`}
            >
              <span className="text-lg hover:text-rose-500 hover:cursor-pointer hover:underline transition-transform duration-300">
                {director.name}
              </span>
            </Link>
          ))}
        </h2>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="min-w-[150px] bg-rose-50 rounded-xl p-3 grid sm:grid-cols-1 grid-cols-3 gap-4 font-light">
            <div className="text-sm ">
              <h3 className="mb-1 font-light text-gray-500">Pays</h3>
              <span>
                {movie.countries?.map((country) => country.name).join(", ")}
              </span>
            </div>
            <div className="text-sm">
              <h3 className="mb-1 font-light text-gray-500">Année</h3>
              <span>{movie.release_date}</span>
            </div>
            <div className="text-sm">
              <h3 className=" mb-1 font-light text-gray-500">Durée</h3>
              <span>
                {movie.runtime} {durationText}
              </span>
            </div>
            <div className="text-sm">
              <h3 className=" mb-1 font-light text-gray-500">Format</h3>
              <span>{movie.type}</span>
            </div>
            <div className="text-sm">
              <h3 className=" mb-1 font-light text-gray-500">Langue(s)</h3>
              <span>{movie.language}</span>
            </div>
            {movie.genres?.length > 0 && (
              <div className="text-sm">
                <h3 className="mb-1 font-light text-gray-500">Genre(s)</h3>
                <span>
                  {movie.genres.map((genre) => genre.name).join(", ")}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-light text-gray-500">Synopsis</h3>
            <p className="my-4 text-md">{movie.description}</p>
            <h3 className="font-light text-gray-500">Mots-clés</h3>
            <div className="font-bold flex items-center gap-y-3 flex-wrap py-3 my-1">
              {movie.keywords?.map((keyword) => (
                <Link
                  key={keyword.id}
                  href={`/movies?keywordIds=${encodeURIComponent(keyword.id.toString())}&searchMode=form`}
                >
                  <span className="font-light text-sm rounded-full border border-rose-500 text-rose-500 px-2 mr-1 py-1 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:cursor-pointer transition-colors duration-300 ">
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
