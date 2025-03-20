import Image from "next/image";
import { getImageUrl, getCanonicalUrl } from "@/utils/index";
import { getMovie } from "@/app/server-actions/movies/get-movie";

import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

export const revalidate = 0;

// MetaData for accessibility (missing types for movie and others data : to update)

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const id = params.slug;

//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
//   const { data: movie } = await supabase
//     .from("movies")
//     .select(
//       `id,
//        title,
//        description,
//        image_url,
//        release_date,
//        runtime,
//        directors(id, name),
//        countries(id, name),
//        movie_genres(genre_id, genres(name))
//        movie_keywords(keyword_id, keywords(name))`
//     )
//     .eq("id", params.slug)
//     .single();

//   if (!movie) {
//     return { title: "", description: "" };
//   }

//   return {
//     title: movie.title,
//     description: movie.description,
//     openGraph: {
//       images: [getImageUrl(movie.image_url)],
//     },
//     alternates: {
//       canonical: `/movies/${id}`,
//     },
//   };
// }

export default async function Page({ params }: { params: { id: string } }) {
  const { movie, error } = await getMovie(params.id);

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Erreur lors du chargement du film : {error}
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-gray-500 text-center mt-10">Film introuvable</div>
    );
  }

  return (
    <div className="w-full text-white mx-auto min-h-screen">
      {/* Image du film */}
      <div className="h-96 relative">
        <Image
          fill
          alt={movie.title}
          style={{ objectFit: "cover" }}
          src={getImageUrl(movie.image_url || "/assets/no_image_found.png")}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 w-full h-full text-white p-10 flex justify-between items-end">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold uppercase">{movie.title}</h2>
            {movie.directors && movie.directors.length > 0 ? (
              <h2 className="text-lg font-light">
                {movie.directors.map((director) => director.name).join(", ")}
              </h2>
            ) : (
              <h2 className="text-lg font-light text-gray-300">
                Réalisateur inconnu
              </h2>
            )}
          </div>
        </div>
      </div>

      {/* Infos du film */}
      <div className="p-10 gap-3 flex flex-col">
        <div className="flex flex-col font-light">
          <span className="font-semibold text-rose-500">
            {movie.countries && movie.countries.length > 0
              ? movie.countries.map((country) => country.name).join(", ")
              : "Pays inconnu"}
            , {movie.release_date || "Date inconnue"},{" "}
            {movie.runtime ? `${movie.runtime} min` : "Durée inconnue"}
          </span>
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="font-bold">
            <span className="font-light text-rose-500 pr-2">
              {movie.genres.map((genre) => genre.name).join(", ")}
            </span>
          </div>
        )}

        {/* Description */}
        <p className="py-2 font-light">
          {movie.description || "Aucune description disponible."}
        </p>

        {/* Mots-clés */}
        {movie.keywords && movie.keywords.length > 0 && (
          <div className="font-bold flex items-center flex-wrap gap-2">
            <p className="flex flex-wrap gap-2">
              {movie.keywords.map((keyword) => (
                <Link
                  key={keyword.id}
                  href={`/movies?keyword=${encodeURIComponent(
                    keyword.name || ""
                  )}`}
                >
                  <span
                    className="font-light text-sm rounded-full border border-rose-500 text-rose-500 shadow-md px-2 mr-1 py-1
                  hover:bg-rose-500 hover:text-white hover:border-none hover:cursor-pointer"
                  >
                    {keyword.name}
                  </span>
                </Link>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
