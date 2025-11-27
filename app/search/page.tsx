import { isAdmin } from "@/utils/is-user-admin";
import BackButton from "../components/back-button";
import Searchfield from "@/app/components/searchfield";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const userIsAdmin = await isAdmin();
  const searchQuery = (searchParams?.q as string) || "";

  return (
    <div className="h-full w-full justify-center items-center text-white">
      <div className="px-[clamp(1.25rem,5vw,2.5rem)] py-20">
        <BackButton />
        <h1 className="text-2xl font-bold text-pink-500 mb-5">Recherche</h1>

        <div className="mb-4">
          <Searchfield initialSearch={searchQuery} userIsAdmin={userIsAdmin} />
        </div>
      </div>
    </div>
  );
}
