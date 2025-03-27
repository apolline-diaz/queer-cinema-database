"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/components/card";
import { getList } from "@/app/server-actions/lists/get-list";

export default function ListPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [listData, setListData] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getList(id);
        if (list) {
          setListData(list);
          setMovies(list.lists_movies.map((item: any) => item.movie)); // Extraction des films
        } else {
          console.error("List not found");
        }
      } catch (error) {
        console.error("Failed to fetch list data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!listData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-xl text-rose-500 font-semibold">{listData.title}</h1>
      <p className="text-white mt-2 mb-6">{listData.description}</p>
      <button
        onClick={() => router.push(`/lists/edit/${id}`)}
        className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-md hover:from-rose-600  hover:to-red-600"
      >
        Modifier la liste
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {movies.map((movie) => (
          <Card
            key={movie.id}
            id={movie.id}
            title={movie.title}
            release_date={movie.release_date}
            image_url={movie.image_url}
          />
        ))}
      </div>
    </div>
  );
}
