"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/components/card";
import { getList } from "@/app/server-actions/lists/get-list";
import { Icon } from "@iconify/react/dist/iconify.js";
import BackButton from "@/app/components/back-button";

type SortType = "title" | "year" | "none";
type SortDirection = "asc" | "desc";

export default function ListClientPage({
  params,
}: {
  params: { id: string; userIsAdmin: boolean; userIsOwner: boolean };
}) {
  const { id, userIsAdmin, userIsOwner } = params;
  const [listData, setListData] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [sortedMovies, setSortedMovies] = useState<any[]>([]);
  const [sortType, setSortType] = useState<SortType>("none");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
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
          const flatMovies = extractedMovies.flat();
          setMovies(flatMovies);
          setSortedMovies(flatMovies);
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

  // Fonction de tri avec gestion asc/desc
  const sortMovies = (type: SortType) => {
    let nextDirection: SortDirection = "asc";

    if (sortType === type) {
      // si on reclique sur le même type, on inverse la direction
      nextDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    let sorted = [...movies];

    if (type === "title") {
      sorted.sort((a, b) =>
        a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
      );
      if (nextDirection === "desc") sorted.reverse();
    } else if (type === "year") {
      sorted.sort((a, b) => {
        const yearA = a.release_date
          ? new Date(a.release_date).getFullYear()
          : 0;
        const yearB = b.release_date
          ? new Date(b.release_date).getFullYear()
          : 0;
        return yearA - yearB;
      });
      if (nextDirection === "desc") sorted.reverse();
    } else {
      sorted = [...movies];
    }

    setSortedMovies(sorted);
    setSortType(type);
    setSortDirection(nextDirection);
  };

  return (
    <div className="p-10 py-20">
      <BackButton />
      {isLoading ? (
        <div>
          {/* Skeletons*/}
          <div className="animate-pulse bg-gray-300 border h-8 w-1/4 mb-4 rounded-md"></div>
          <div className="animate-pulse bg-gray-300 border h-7 w-3/4 mb-6 rounded-md"></div>
          <div className="animate-pulse bg-gray-300 border h-10 w-48 mb-6 rounded-md"></div>
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
          <h1 className="text-2xl font-bold text-rose-500">{listData.title}</h1>
          <p className="text-black font-light mt-2 mb-6">
            {listData.description}
          </p>

          {/* Section de tri */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-8 border border-gray-200/50 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                icon="solar:sort-outline"
                className="text-rose-500 text-lg"
              />
              <h3 className="text-sm font-medium text-gray-800">Filtres</h3>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => sortMovies("title")}
                className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  sortType === "title"
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-105"
                    : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 hover:border-rose-200 hover:shadow-md"
                }`}
              >
                <Icon
                  icon="solar:sort-from-top-to-bottom-outline"
                  className={`text-lg transition-colors ${
                    sortType === "title"
                      ? "text-white"
                      : "text-gray-500 group-hover:text-rose-500"
                  }`}
                />
                <span>Alphabétique</span>
                {sortType === "title" && (
                  <div className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                    {sortDirection === "asc" ? "A-Z" : "Z-A"}
                  </div>
                )}
              </button>

              <button
                onClick={() => sortMovies("year")}
                className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  sortType === "year"
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-105"
                    : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 hover:border-rose-200 hover:shadow-md"
                }`}
              >
                <Icon
                  icon="solar:calendar-outline"
                  className={`text-lg transition-colors ${
                    sortType === "year"
                      ? "text-white"
                      : "text-gray-500 group-hover:text-rose-500"
                  }`}
                />
                <span>Année</span>
                {sortType === "year" && (
                  <div className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                    {sortDirection === "asc" ? "1900→2025" : "2025→1900"}
                  </div>
                )}
              </button>

              <button
                onClick={() => sortMovies("none")}
                className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  sortType === "none"
                    ? "bg-gray-700 text-white shadow-lg shadow-gray-700/25"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <Icon
                  icon="solar:refresh-outline"
                  className={`text-lg transition-colors ${
                    sortType === "none"
                      ? "text-white"
                      : "text-gray-500 group-hover:text-gray-600"
                  }`}
                />
                <span>Par défaut</span>
              </button>
            </div>
          </div>

          {userIsOwner && (
            <button
              onClick={() => router.push(`/lists/edit/${id}`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-medium 
               bg-gradient-to-r from-rose-500 to-red-500 bg-[length:200%_200%] 
               hover:bg-[position:100%_0%] transition-all duration-500 mb-4"
            >
              <Icon icon="solar:edit-bold" className="text-lg" />
              Modifier la liste
            </button>
          )}

          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-5">
            {sortedMovies.length === 0 ? (
              <p>Aucun film trouvé</p>
            ) : (
              sortedMovies.map((movie) => (
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
