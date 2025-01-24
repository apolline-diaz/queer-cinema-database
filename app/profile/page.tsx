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
    .select("id, title, image_url")
    .eq("user_id", userId);

  // error handler
  if (listsError) {
    console.error("Error fetching data", listsError);
    redirect("/error");
  }

  return (
    <div className="flex flex-col gap-5 p-10">
      <h1 className="text-3xl font-bold mb-5">Profil</h1>

      <h1>Hello {data.user.email}</h1>
      <div className="">
        <Link
          href="/upload"
          className="hover:bg-pink-200 border border-black rounded-full p-2"
        >
          Ajouter un film
        </Link>
      </div>

      {/* Mes listes */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Mes listes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link
            href="/lists/create"
            className="flex flex-col justify-center items-center bg-gray-500 text-white text-center p-4  hover:bg-gray-600 cursor-pointer"
          >
            Créer une nouvelle liste
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
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
              image_url={list.image_url}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
