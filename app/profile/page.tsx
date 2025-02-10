import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ListCard from "../components/list-card";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = createClient();

  // get user
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  // get movies user's lists
  const userId = data.user.id;

  const { data: lists, error: listsError } = await supabase
    .from("lists")
    .select(`id, title, lists_movies(movie_id), movies(image_url) `)
    .eq("user_id", userId);

  // error handler
  if (listsError) {
    console.error("Error fetching data", listsError);
    redirect("/error");
  }

  return (
    <div className="flex flex-col  gap-5 p-10">
      {/* <h1>Bienvenue {data.user.email} !</h1> */}
      <div className="">
        <p className="text-xl text-rose-500 font-semibold mb-4">Contribuer</p>

        <Link
          href="/movies/contribute"
          className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-md hover:from-rose-600  hover:to-red-600"
        >
          Ajouter un film
        </Link>
      </div>

      {/* Mes listes */}
      <section className="mt-8">
        <h2 className="text-xl text-rose-500 font-semibold mb-4">Mes listes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link
            href="/lists/create"
            className="flex flex-col justify-center rounded-lg border border-xl text-red-100 border-red-100 items-center  text-center p-4 cursor-pointer hover:text-rose-500 hover:border-rose-500"
          >
            Créer une nouvelle liste
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              color=""
              viewBox="0 0 50 50"
            >
              <path
                fill="currentColor"
                d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"
              />
              <path fill="currentColor" d="M16 24h18v2H16z" />
              <path fill="currentColor" d="M24 16h2v18h-2z" />
            </svg>
          </Link>

          {lists?.map((list) => (
            <ListCard
              key={list.id}
              id={list.id}
              title={list.title}
              image_url={list.movies[0]?.image_url || "/placeholder-image.png"} // Utiliser l'image du premier film ou une image par défaut
            />
          ))}
        </div>
      </section>
    </div>
  );
}
