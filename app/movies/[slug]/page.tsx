import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { getImageUrl, getCanonicalUrl } from "@/utils/index";
import { Metadata, ResolvingMetadata } from "next";

export const revalidate = 0;

type Props = {
  params: { slug: string };
  searchParams: {
    director_first_name: string;
    director_last_name: string;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.slug;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: movie } = await supabase
    .from("movies")
    .select()
    .match({ id })
    .single();

  if (!movie) {
    return { title: "", description: "" };
  }

  return {
    title: movie.title,
    description: movie.description,
    openGraph: {
      images: [getImageUrl(movie.image_url)],
    },
    alternates: {
      canonical: `/movies/${id}`,
    },
  };
}

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: movies } = await supabase.from("movies").select("id");

  if (!movies) {
    return [];
  }

  return movies.map((movie) => ({
    slug: movie.id.toString(),
  }));
}

export default async function Page({ params, searchParams }: Props) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: movie, error } = await supabase
    .from("movies")
    .select(
      "id, title, description, image_url, release_date, runtime, directors(id, first_name, last_name), genres(id, name), keywords(id, name)"
    )
    .eq("id", params.slug)
    .single();

  if (error) {
    return <div>Erreur lors du chargement du film : {error.message}</div>;
  }

  if (!movie) {
    return <div>Film introuvable</div>;
  }

  const director =
    movie.directors && movie.directors.length > 0 ? movie.directors[0] : null;

  return (
    <>
      <div className="px-12 py-12 max-w-7xl mx-auto min-h-screen">
        <div className="flex justify-between mb-6 lg:mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl items-start uppercase pb-2">
              {movie.title}
            </h2>
            <h2 className="text-lg">
              {movie.directors?.first_name} {movie.directors?.last_name}
            </h2>
          </div>
          <div className="flex flex-col">
            <span>{movie.release_date}</span>
            <span>{movie.runtime}&#x27;</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-4">
          <div className="flex items-center justify-center">
            <Image
              className=""
              width={1000}
              height={1000}
              alt={movie.title}
              src={getImageUrl(movie.image_url)}
            ></Image>
          </div>
        </div>
        <div className="gap-2 flex flex-col">
          <div className="font-bold ">Synopsis</div>
          <p className="py-2">{movie.description}</p>
          <div className="font-bold">
            Genre :<span className="font-light p-2">{movie.genres?.name}</span>
          </div>
          <div className="font-bold flex flex-wrap gap-2">
            Mots-clé :
            <p className="">
              <span className="font-light text-sm rounded-full border border-black p-1.5">
                {movie.keywords?.name}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
