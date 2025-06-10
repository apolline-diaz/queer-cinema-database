"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/components/card";
import { getList } from "@/app/server-actions/lists/get-list";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function ListClientPage({
  params,
}: {
  params: { id: string; userIsAdmin: boolean };
}) {
  const { id, userIsAdmin } = params;
  const [listData, setListData] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getList(id);
        if (list) {
          setListData(list);
          const extractedMovies = list.lists_movies.map(
            (item: any) => item.movies
          );
          setMovies(extractedMovies.flat()); // Flatten array if necessary
          setIsLoading(false);
        } else {
          console.error("List not found");
        }
      } catch (error) {
        console.error("Failed to fetch list data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="p-10 py-20">
      <button
        onClick={() => router.back()}
        className="flex items-center border border-rose-900 mb-4 text-sm text-rose-900 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-full px-2 pr-3"
      >
        <Icon icon="mdi:chevron-left" className="inline size-4" />
        Retour
      </button>
      {isLoading ? (
        <div>
          {/* Skeleton for the title */}
          <div className="animate-pulse bg-gray-300 border h-8 w-1/4 mb-4 rounded-md"></div>

          {/* Skeleton for the description */}
          <div className="animate-pulse bg-gray-300 border h-7 w-3/4 mb-6 rounded-md"></div>

          {/* Skeleton button */}
          <div className="animate-pulse bg-gray-300 border h-10 w-48 mb-6 rounded-md"></div>

          {/* Skeleton grid for movie cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse border bg-gray-300 h-[200px] rounded-xl w-full justify-end max-w-xs mx-auto group overflow-hidden flex flex-col transition-transform"
              >
                <div className="flex flex-col p-5 space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Title and description */}
          <h1 className="text-2xl font-medium text-rose-900">
            {listData.title}
          </h1>
          <p className="text-black font-light mt-2 mb-6">
            {listData.description}
          </p>

          {/* Button to edit list */}
          <button
            onClick={() => router.push(`/lists/edit/${id}`)}
            className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-xl hover:from-rose-600 hover:to-red-600"
          >
            Modifier la liste
          </button>

          {/* Movie grid */}
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
            {movies.length === 0 ? (
              <p>Aucun film trouvé</p>
            ) : (
              movies.map((movie) => (
                <Card
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  userIsAdmin={userIsAdmin}
                  release_date={movie.release_date}
                  image_url={movie.image_url}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
