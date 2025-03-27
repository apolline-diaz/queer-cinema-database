"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { updateList } from "@/app/server-actions/lists/update-list";
import { getList } from "@/app/server-actions/lists/get-list";
import { getMovies } from "@/app/server-actions/movies/get-movies";
import { SubmitButton } from "@/app/components/submit-button";

// Types
interface Movie {
  id: string;
  title: string;
  release_date: string;
  genres: { name: string }[];
  countries: { name: string }[];
  keywords: { name: string }[];
}

// Validation Schema
const ListUpdateSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  movie_id: z.string().optional(),
});

type ListUpdateFormData = z.infer<typeof ListUpdateSchema>;

export default function EditListPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [movieInput, setMovieInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ListUpdateFormData>({
    defaultValues: {
      title: "",
      description: "",
      movie_id: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch list details
        const list = await getList(id);

        // Set form values
        setValue("title", list.title);
        setValue("description", list.description || "");

        // Set selected movies
        const listMovies = list.lists_movies.map((item: any) => item.movies);
        setSelectedMovies(listMovies);

        // Fetch all movies for search
        const moviesData = await getMovies({
          title: "",
          keyword: "",
          director: "",
          country: "",
          genre: "",
          year: "",
        });
        setMovies(moviesData);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch list data:", error);
        router.push("/lists");
      }
    };

    fetchData();
  }, [id, router, setValue]);

  const handleMovieInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovieInput(e.target.value);
    setIsSearching(e.target.value.length > 0);
  };

  const handleAddMovie = (movie: Movie) => {
    if (!selectedMovies.find((m) => m.id === movie.id)) {
      setSelectedMovies((prev) => [...prev, movie]);
      setValue(
        "movie_id",
        [...selectedMovies, movie].map((m) => m.id).join(",")
      );
    }
    setMovieInput("");
    setIsSearching(false);
  };

  const handleRemoveMovie = (id: string) => {
    const updatedMovies = selectedMovies.filter((m) => m.id !== id);
    setSelectedMovies(updatedMovies);
    setValue("movie_id", updatedMovies.map((m) => m.id).join(","));
  };

  const filteredMovies = movies
    .filter(
      (movie) =>
        movie.title.toLowerCase().includes(movieInput.toLowerCase()) &&
        !selectedMovies.find((m) => m.id === movie.id)
    )
    .slice(0, 5);

  const onSubmit = async (data: ListUpdateFormData) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("movie_id", data.movie_id || "");

    await updateList(id, formData);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-10">
      <div className="tracking-wide text-xl text-rose-500 mb-5">
        Modifier la liste
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="py-5">
        {/* Hidden input for list ID */}
        <input type="hidden" {...register("movie_id")} />

        {/* Title of the list */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <label className="block tracking-wide text-sm mb-2" htmlFor="title">
            Titre de la liste
          </label>
          <input
            className="appearance-none block w-full text-sm font-light bg-neutral-950 border-b py-3 mb-3 leading-tight focus:outline-none"
            id="title"
            type="text"
            {...register("title")}
            placeholder="Mon top 2025"
          />
          {errors.title && (
            <span className="text-red-500 text-xs italic">
              {errors.title.message}
            </span>
          )}
        </div>

        {/* Description of the list */}
        <div className="w-full md:w-1/2 mt-3 mb-6">
          <label
            className="block tracking-wide text-sm mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="appearance-none block w-full text-sm font-light bg-neutral-950 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
            id="description"
            {...register("description")}
            placeholder="Liste des films préférés sortis en 2025"
          ></textarea>
          {errors.description && (
            <span className="text-red-500 text-xs italic">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Movies Selection */}
        <div className="w-full md:w-1/2 mt-3 mb-6 md:mb-0">
          <label
            className="block tracking-wide text-sm mb-2"
            htmlFor="movie_search"
          >
            Films
          </label>
          <div className="relative">
            <input
              className="block appearance-none w-full text-sm font-light bg-neutral-950 border py-2 px-3 pr-8 rounded leading-tight focus:outline-none"
              id="movie_search"
              value={movieInput}
              onChange={handleMovieInputChange}
              placeholder="Tapez pour rechercher des films"
            />

            {/* Display movie options */}
            {isSearching && filteredMovies.length > 0 && (
              <ul className="absolute left-0 right-0 border bg-neutral-950 rounded-lg text-sm font-light border-gray-300 mt-1 z-10">
                {filteredMovies.map((movie) => (
                  <li
                    key={movie.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-800"
                    onClick={() => handleAddMovie(movie)}
                  >
                    <div className="font-medium flex gap-2 items-center">
                      {movie.title}
                      <span className="font-light text-gray-400">
                        {movie.release_date}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Display selected movies as tags */}
          <div className="mt-3 mb-6">
            {selectedMovies.map((movie) => (
              <span
                key={movie.id}
                className="inline-flex items-center bg-rose-100 text-rose-500 text-xs font-medium mr-2 px-3 py-1 rounded"
              >
                {movie.title}
                <button
                  type="button"
                  onClick={() => handleRemoveMovie(movie.id)}
                  className="ml-2 text-rose-500 hover:text-rose-700"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}
