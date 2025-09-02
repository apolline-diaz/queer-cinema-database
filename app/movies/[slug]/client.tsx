"use client";

import { useState, useEffect, useCallback } from "react";
import { getLists } from "@/app/server-actions/lists/get-lists";
import { addMovieToList } from "@/app/server-actions/lists/add-movie-to-list";
import { removeMovieFromList } from "@/app/server-actions/lists/remove-movie-from-list";
import { checkMovieInLists } from "@/app/server-actions/lists/check-movie-in-lists";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Props = {
  movieId: string;
  userIsAdmin: boolean;
};

type ListWithStatus = {
  id: string;
  title: string;
  hasMovie: boolean;
};

export default function ClientMovieActions({ movieId, userIsAdmin }: Props) {
  const [lists, setLists] = useState<ListWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const router = useRouter();

  // Mémoriser la fonction avec useCallback
  const fetchListsWithStatus = useCallback(async () => {
    // Cette correction utilise useCallback pour mémoriser la fonction fetchListsWithStatus, ce qui garantit qu'elle ne sera recréée que lorsque movieId change.
    setIsLoading(true);
    try {
      // Exécuter ces requêtes en parallèle pour gagner du temps
      const [fetchedLists, movieInLists] = await Promise.all([
        getLists(),
        checkMovieInLists(movieId),
      ]);

      const listsWithStatus = fetchedLists.map((list) => ({
        ...list,
        hasMovie: movieInLists.includes(list.id),
      }));

      setLists(listsWithStatus);
      setIsDataFetched(true);
    } catch (error) {
      console.error("Erreur lors du chargement des listes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [movieId]); // movieId est la seule dépendance externe

  // Pré-charger les données dès le montage du composant
  useEffect(() => {
    const preloadData = async () => {
      if (!isDataFetched && !isLoading) {
        await fetchListsWithStatus();
      }
    };

    preloadData();
  }, [isDataFetched, isLoading, fetchListsWithStatus]); // Maintenant fetchListsWithStatus est inclus

  const toggleMovieInList = async (listId: string, hasMovie: boolean) => {
    setLists(
      lists.map((list) =>
        list.id === listId ? { ...list, hasMovie: !hasMovie } : list
      )
    );

    // Exécuter l'action en arrière-plan
    try {
      if (hasMovie) {
        await removeMovieFromList(listId, movieId);
      } else {
        await addMovieToList(listId, movieId);
      }
    } catch (error) {
      // En cas d'erreur, revenir à l'état précédent
      console.error("Erreur lors de la mise à jour de la liste:", error);
      setLists(
        lists.map((list) =>
          list.id === listId ? { ...list, hasMovie: hasMovie } : list
        )
      );
    }
  };

  return (
    <div className="flex flex-col gap-3 right-0 items-center rounded-xl w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Gérer les listes"
            className="z-10 p-2 bg-black text-rose-500 rounded-full border bg-opacity-50 border-rose-500 transition-all duration-300 ease-in-out hover:bg-rose-500 hover:text-white"
          >
            <Icon
              icon={
                isLoading && !isDataFetched ? "lucide:loader" : "lucide:plus"
              }
              className={isLoading && !isDataFetched ? "animate-spin" : ""}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="max-w-[75vw] max-h-[75vh] rounded-lg border border-rose-500 bg-white"
          align="start"
          sideOffset={4}
        >
          {/* Label du menu */}
          <DropdownMenuLabel className="text-rose-500 flex flex-row px-3 py-2 items-center gap-2 text-sm font-medium border-b border-rose-300">
            Ajouter à une liste
          </DropdownMenuLabel>

          {/* Bouton "Créer une liste" */}
          <DropdownMenuItem
            asChild
            className="px-2 py-2 text-sm font-medium rounded-none text-black hover:text-rose-500 hover:bg-rose-50 cursor-pointer flex items-center gap-2 border-b border-gray-400"
          >
            <Link href="/lists/create">
              <span className="flex flex-row gap-2 items-center justify-between">
                <Icon icon="mynaui:plus-solid" className="size-4" />
                Créer une liste
              </span>
            </Link>
          </DropdownMenuItem>

          {/* Liste des listes */}
          <div className="overflow-y-auto max-h-[50vh]">
            {lists.length === 0 ? (
              <p className="text-sm  text-gray-500 px-3 py-2">
                {isLoading
                  ? "Chargement des listes..."
                  : "Aucune liste trouvée"}
              </p>
            ) : (
              lists.map((list) => (
                <DropdownMenuCheckboxItem
                  key={list.id}
                  checked={list.hasMovie}
                  onCheckedChange={() =>
                    toggleMovieInList(list.id, list.hasMovie)
                  }
                  className={cn(
                    "px-3 py-2 gap-2 items-center rounded-none text-sm border-b border-gray-200 font-light flex justify-between cursor-pointer hover:text-rose-500",
                    {
                      "text-rose-500": list.hasMovie,
                      "text-black": !list.hasMovie,
                    }
                  )}
                >
                  <span className="pl-5">{list.title}</span>
                </DropdownMenuCheckboxItem>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {userIsAdmin && (
        <div className="">
          <Link href={`/movies/edit/${movieId}`}>
            <button className="right-2 bg-black bg-opacity-60 p-2 border border-rose-500 rounded-full text-rose-500 transition-all duration-300 ease-in-out opacity-100 visible hover:bg-rose-500 hover:text-white">
              <Icon icon="lucide:edit" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
