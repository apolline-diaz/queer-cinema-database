"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateList } from "@/app/server-actions/lists/update-list";
import { getList } from "@/app/server-actions/lists/get-list";
import { getMovies } from "@/app/server-actions/movies/get-movies";
import MoviesMultiSelect from "@/app/components/movies-multi-select";
import { SubmitButton } from "@/app/components/submit-button";
import { Icon } from "@iconify/react/dist/iconify.js";
import BackButton from "@/app/components/back-button";

export default function EditListForm({
  params,
  isAdmin,
}: {
  params: { id: string };
  isAdmin: boolean;
}) {
  const { id } = params;
  const router = useRouter();
  const [movies, setMovies] = useState<{ value: string; label: string }[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      movie_id: "",
      is_collection: false,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getList(id);
        const moviesData = await getMovies();

        setValue("title", list.title);
        setValue("description", list.description || "");
        setValue("is_collection", list.is_collection ?? false);
        setSelectedMovies(
          list.lists_movies.map((item: any) => ({
            value: item.movies.id,
            label: item.movies.title,
            release_date: item.movies.release_date,
          }))
        );
        setMovies(
          moviesData.map((movie: any) => ({
            value: movie.id,
            label: movie.title,
            release_date: movie.release_date,
          }))
        );

        setIsLoading(false);
      } catch (error) {
        console.error("Impossible de récupérer les données:", error);
        router.push(`/lists/${id}`);
      }
    };

    fetchData();
  }, [id, router, setValue]);

  const onMovieChange = (selected: { value: string; label: string }[]) => {
    setSelectedMovies(selected);
    setValue("movie_id", selected.map((s) => s.value).join(","));
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("movie_id", data.movie_id || "");
      formData.append(
        "is_collection",
        isAdmin ? String(data.is_collection) : "false"
      );

      const result = await updateList(id, formData);

      if (result.type === "success") {
        router.push(`/lists/${id}`);
      } else {
        setError(result.message || "Une erreur s'est produite");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setError("Une erreur inattendue s'est produite");
    }
  };

  return (
    <div className="px-10 py-20">
      <BackButton />

      <h1 className="text-2xl text-rose-900 font-medium mb-5">
        Modifier la liste
      </h1>
      {isLoading ? (
        <div className="space-y-4 w-full sm:w-1/2">
          <div className={"animate-pulse bg-neutral-300 rounded h-10 w-full"} />
          <div className={"animate-pulse bg-neutral-300 rounded h-20 w-full"} />
          <div className={"animate-pulse bg-neutral-300 rounded h-10 w-full"} />
          <div className={"animate-pulse bg-neutral-300 rounded h-10 w-32"} />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-rose-900 py-5 w-full sm:w-1/2"
        >
          <input type="hidden" {...register("movie_id")} />

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Titre</label>
            <input
              className="w-full border-b text-sm placeholder-gray-500 text-black font-light py-2 bg-transparent border-rose-900"
              {...register("title")}
              placeholder="Mon top 2025"
            />
            {errors.title && (
              <span className="text-red-500 text-xs">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              className="w-full rounded-md text-sm text-black placeholder-gray-500 font-light border py-3 px-4  bg-white border-rose-900"
              {...register("description")}
              placeholder="Entrez une description..."
            />
          </div>

          <div className="mb-6">
            <MoviesMultiSelect
              name="movie_id"
              options={movies}
              defaultValues={selectedMovies}
              onChange={onMovieChange}
              label="Sélection de films"
              placeholder="Chercher des films..."
              control={control}
            />
          </div>
          {isAdmin && (
            <div className="mb-6">
              <label className="inline-flex items-center space-x-2 text-black">
                <input
                  type="checkbox"
                  {...register("is_collection")}
                  className="rounded border-rose-900 text-rose-900 focus:ring-rose-500"
                />
                <span>Marquer comme collection</span>
              </label>
            </div>
          )}

          <SubmitButton
            defaultText="Enregistrer les modifications"
            loadingText="Chargement..."
            isSubmitting={isSubmitting}
          />
        </form>
      )}
    </div>
  );
}
