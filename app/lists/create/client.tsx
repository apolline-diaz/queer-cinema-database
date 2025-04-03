"use client";

import { useState, useEffect } from "react";
import { createList } from "@/app/server-actions/lists/create-list";
import { SubmitButton } from "@/app/components/submit-button";
import { getMovies } from "@/app/server-actions/movies/get-movies";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

// Updated Types to match your actual data
interface Movie {
  id: string;
  title: string;
  release_date: string;
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
      const moviesData = await getMovies({
        title: "",
        keyword: "",
        director: "",
        country: "",
        genre: "",
        year: "",
      });
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

  const filteredMovies = movies
    .filter(
      (movie) =>
        movie.title.toLowerCase().includes(movieInput.toLowerCase()) &&
        !selectedMovies.includes(movie.id)
    )
    .slice(0, 5);

  const onSubmit = async (data: FormData) => {
    const response = await createList(new FormData());
    if (response?.type === "success" && response.id) {
      router.push(`/lists/${response.id}`);
    }
  };

  return (
    <div className="px-10 py-5">
      <div className="tracking-wide text-2xl text-rose-500 mb-5">
        Créer une liste de films
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="py-5">
        {/* Title of the list */}
        <div className="w-full md:w-1/2 mb-6">
          <label className="block text-sm mb-2" htmlFor="title">
            Titre de la liste
          </label>
          <input
            {...register("title", { required: "Le titre est requis" })}
            className="block w-full text-sm bg-neutral-950 border-b py-3 focus:outline-none"
            placeholder="Mon top 2025"
          />
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title.message}</span>
          )}
        </div>

        {/* Description of the list */}
        <div className="w-full md:w-1/2 mt-3 mb-6">
          <label className="block text-sm mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            {...register("description")}
            className="block w-full text-sm bg-neutral-950 border py-3 px-4 rounded focus:outline-none"
            placeholder="Liste des films préférés sortis en 2025"
          />
        </div>

        {/* Movies Selection */}
        <div className="w-full md:w-1/2 mt-3 mb-6">
          <label className="block text-sm mb-2" htmlFor="movie_search">
            Films
          </label>
          <input
            value={movieInput}
            onChange={handleMovieInputChange}
            placeholder="Rechercher des films"
            className="block w-full text-sm bg-neutral-950 border py-2 px-3 rounded focus:outline-none"
          />

          {/* Suggestions de films */}
          {isSearching && filteredMovies.length > 0 && (
            <ul className="absolute border bg-neutral-950 rounded-lg text-sm border-gray-300 mt-1 z-10">
              {filteredMovies.map((movie) => (
                <li
                  key={movie.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-800"
                  onClick={() => handleAddMovie(movie)}
                >
                  {movie.title}{" "}
                  <span className="text-gray-400">{movie.release_date}</span>
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
        <div className="mt-3 mb-6">
          {selectedMovies.map((movieId) => {
            const movie = movies.find((m) => m.id === movieId);
            return movie ? (
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
