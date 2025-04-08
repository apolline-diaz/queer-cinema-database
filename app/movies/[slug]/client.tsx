"use client";

import { useState, useEffect } from "react";
import { getLists } from "@/app/server-actions/lists/get-lists";
import { addMovieToList } from "@/app/server-actions/lists/add-movie-to-list";
import { removeMovieFromList } from "@/app/server-actions/lists/remove-movie-from-list";
import { checkMovieInLists } from "@/app/server-actions/lists/check-movie-in-lists";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lists, setLists] = useState<ListWithStatus[]>([]);
  const router = useRouter();

  const toggleMenu = async () => {
    if (!isMenuOpen) {
      await fetchListsWithStatus();
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const fetchListsWithStatus = async () => {
    const fetchedLists = await getLists();
    const movieInLists = await checkMovieInLists(movieId);

    const listsWithStatus = fetchedLists.map((list) => ({
      ...list,
      hasMovie: movieInLists.includes(list.id),
    }));

    setLists(listsWithStatus);
  };

  const toggleMovieInList = async (listId: string, hasMovie: boolean) => {
    if (hasMovie) {
      await removeMovieFromList(listId, movieId);
    } else {
      await addMovieToList(listId, movieId);
    }

    // Mettre à jour l'état local pour refléter le changement
    setLists(
      lists.map((list) =>
        list.id === listId ? { ...list, hasMovie: !hasMovie } : list
      )
    );

    router.refresh();
  };

  return (
    <div className="z-20 absolute flex flex-row pt-20 items-center rounded-xl px-10 top-0 justify-between w-full">
      <div className="relative">
        <button
          onClick={toggleMenu}
          aria-label="Gérer les listes"
          className="z-10 p-2 bg-gray-800 rounded-full transition-all duration-300 ease-in-out hover:bg-gray-700"
        >
          <Icon icon="lucide:list" />
        </button>

        {isMenuOpen && (
          <div className="absolute top-full mt-2 w-48 rounded-lg text-white bg-black shadow-lg">
            {lists.length === 0 ? (
              <p className="text-sm text-gray-500 px-3 py-2">
                Aucune liste trouvée
              </p>
            ) : (
              lists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => toggleMovieInList(list.id, list.hasMovie)}
                  className="px-3 py-2 gap-2 text-sm font-light flex justify-between items-center hover:rounded-xl hover:text-rose-500 cursor-pointer"
                >
                  <span>{list.title}</span>
                  <span className="text-rose-500">
                    {list.hasMovie ? (
                      <Icon
                        icon="tdesign:circle-filled"
                        style={{ fontSize: 15 }}
                      />
                    ) : (
                      <Icon icon="lucide:circle" style={{ fontSize: 15 }} />
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {userIsAdmin && (
        <div className="absolute top-20 right-4">
          <Link href={`/movies/edit/${movieId}`}>
            <button className="right-2 bg-black bg-opacity-60 p-2 mx-3 rounded-full text-rose-500 transition-all duration-300 ease-in-out opacity-100 visible hover:bg-rose-500 hover:text-white">
              <Icon icon="lucide:edit" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
