import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-5 p-10">
      <h1>Hello {data.user.email}</h1>
      <div className="">
        <Link
          href="/upload"
          className="hover:bg-pink-200  border border-black rounded-full p-2"
        >
          Ajouter un film
        </Link>
      </div>
    </div>
  );
}
