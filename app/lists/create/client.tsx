"use client";

import { useState, useEffect } from "react";
import { createList } from "@/app/server-actions/lists/create-list";
import { SubmitButton } from "@/app/components/submit-button";
import { getMovies } from "@/app/server-actions/movies/get-movies";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Icon } from "@iconify/react/dist/iconify.js";

// Updated Types to match your actual data
interface Movie {
  id: string;
  title: string;
  release_date: string | null;
}

interface FormData {
  title: string;
  description?: string;
  movie_ids: string[];
}

const CreateListPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { title: "", description: "", movie_ids: [] },
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieInput, setMovieInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const selectedMovies = watch("movie_ids");

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesData = await getMovies();
      setMovies(moviesData);
    };
    fetchMovies();
  }, []);

  const handleMovieInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovieInput(e.target.value);
    setIsSearching(e.target.value.length > 0);
  };

  const handleAddMovie = (movie: Movie) => {
    if (!selectedMovies.includes(movie.id)) {
      setValue("movie_ids", [...selectedMovies, movie.id]);
    }
    setMovieInput("");
    setIsSearching(false);
  };

  const handleRemoveMovie = (id: string) => {
    setValue(
      "movie_ids",
      selectedMovies.filter((movieId) => movieId !== id)
    );
  };

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(movieInput.toLowerCase()) &&
      !selectedMovies.includes(movie.id)
  );

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.movie_ids.length > 0) {
      formData.append("movie_id", data.movie_ids.join(","));
    }

    const response = await createList(formData);
    if (response?.type === "success" && response.id) {
      router.push(`/lists/${response.id}`);
    }
  };

  return (
    <div className="px-10 py-20">
      {" "}
      <button
        onClick={() => router.back()}
        className="flex items-center border border-rose-900 mb-4 text-sm text-rose-900 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-full px-2 pr-3"
      >
        <Icon icon="mdi:chevron-left" className="inline size-4" />
        Retour
      </button>
      <div className="tracking-wide font-medium text-2xl text-rose-900 mb-5">
        Créer une liste de films
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="py-5 text-rose-900">
        {/* Title of the list */}
        <div className="w-full md:w-1/2 mb-6">
          <label className="block font-medium text-sm mb-2" htmlFor="title">
            Titre
          </label>
          <input
            {...register("title", { required: "Le titre est requis" })}
            className="block w-full text-sm text-black border-rose-900 placeholder-gray-500 font-light bg-transparent border-b py-2 focus:outline-none"
            placeholder="Entrez un titre..."
          />
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title.message}</span>
          )}
        </div>

        {/* Description of the list */}
        <div className="w-full md:w-1/2 mt-3 mb-6">
          <label
            className="block font-medium text-sm mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            {...register("description")}
            className="block w-full text-sm text-black bg-white placeholder-gray-500 font-light border-rose-900 border py-3 px-4 rounded focus:outline-none"
            placeholder="Entrez une description..."
          />
        </div>

        {/* Movies Selection */}
        <div className="w-full md:w-1/2 mt-3 mb-6">
          <label
            className="block font-medium text-sm mb-2"
            htmlFor="movie_search"
          >
            Sélection des films
          </label>
          <input
            value={movieInput}
            onChange={handleMovieInputChange}
            placeholder="Cherchez des films..."
            className="block w-full text-sm bg-white text-black placeholder-gray-500 font-light border-rose-900 border py-2 px-3 rounded focus:outline-none"
          />

          {/* Suggestions de films */}
          {isSearching && filteredMovies.length > 0 && (
            <ul className="absolute border max-h-40 max-w-80 overflow-y-auto bg-rose-50 rounded-lg text-sm border-rose-900 mt-1 z-10">
              {filteredMovies.map((movie) => (
                <li
                  key={movie.id}
                  className="px-4 py-2 font-light hover:bg-rose-950 cursor-pointer uppercase  hover:text-white"
                  onClick={() => handleAddMovie(movie)}
                >
                  {movie.title}{" "}
                  <span className="font-semibold ">{movie.release_date}</span>
                </li>
              ))}
            </ul>
          )}

          <Controller
            name="movie_ids"
            control={control}
            render={({ field }) => (
              <input
                type="hidden"
                {...field}
                value={selectedMovies.join(",")}
              />
            )}
          />
        </div>

        {/* Display selected movies as tags */}
        <div className="mt-3 mb-6 -full sm:w-1/2">
          {selectedMovies.map((movieId) => {
            const movie = movies.find((m) => m.id === movieId);
            return movie ? (
              <span
                key={movie.id}
                className="items-center my-2 border flex justify-between border-rose-900 w-full bg-rose-50 text-rose-900 text-sm font-light mr-2 px-3 py-1 rounded"
              >
                <div>
                  {movie.title}{" "}
                  <span className="font-semibold">{movie.release_date}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMovie(movie.id)}
                  className="ml-2 text-rose-900 hover:text-rose-900"
                >
                  &times;
                </button>
              </span>
            ) : null;
          })}
        </div>

        <SubmitButton
          defaultText="Créer la liste"
          loadingText="Chargement..."
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};

export default CreateListPage;
