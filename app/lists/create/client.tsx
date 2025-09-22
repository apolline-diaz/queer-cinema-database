"use client";

import { useState, useEffect } from "react";
import { createList } from "@/app/server-actions/lists/create-list";
import { SubmitButton } from "@/app/components/submit-button";
import { getMovies } from "@/app/server-actions/movies/get-movies";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import BackButton from "@/app/components/back-button";

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
  is_collection?: boolean;
}

interface CreateListFormProps {
  isAdmin: boolean;
}

const CreateListForm: React.FC<CreateListFormProps> = ({ isAdmin }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      movie_ids: [],
      is_collection: false,
    },
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
    const payload = {
      title: data.title,
      description: data.description?.trim() || undefined,
      movie_id:
        data.movie_ids.length > 0 ? data.movie_ids.join(",") : undefined,
      is_collection: isAdmin ? !!data.is_collection : false,
    };

    const response = await createList({
      title: data.title,
      description: data.description?.trim() || undefined,
      movie_id:
        data.movie_ids.length > 0 ? data.movie_ids.join(",") : undefined,
      is_collection: isAdmin ? !!data.is_collection : false, // forcer un booléen
    });

    if (response?.type === "success" && response.id) {
      router.push(`/lists/${response.id}`);
    } else {
      console.error("Erreur création liste :", response);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md sm:max-w-md md:max-w-lg px-[clamp(1.25rem,5vw,2.5rem)] py-20">
      <BackButton />
      <div className="tracking-wide font-bold text-2xl text-rose-500 mb-5">
        Créer une liste de films
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="py-5 text-black ">
        {/* Title of the list */}
        <div className="w-full mb-6">
          <label className="block font-medium text-sm mb-2" htmlFor="title">
            Titre
          </label>
          <input
            {...register("title", { required: "Le titre est requis" })}
            className="block w-full text-sm text-black border-black placeholder-gray-500 font-light bg-transparent border-b py-2 focus:outline-none"
            placeholder="Entrez un titre..."
            data-testid="title-input"
          />
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title.message}</span>
          )}
        </div>

        {/* Description of the list */}
        <div className="w-full mt-3 mb-6">
          <label
            className="block font-medium text-sm mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            {...register("description")}
            className="block w-full text-sm text-black bg-white placeholder-gray-500 font-light border-black border py-3 px-4 rounded-xl focus:outline-none"
            placeholder="Entrez une description..."
            data-testid="description-input"
          />
          {errors.description && (
            <span className="text-rose-500 text-xs my-2">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Movies Selection */}
        <div className="w-full mt-3 mb-6 relative">
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
            className="block w-full text-sm bg-white text-black placeholder-gray-500 font-light border-black border py-2 px-3 rounded-xl focus:outline-none"
            data-testid="movie-search-input"
          />

          {/* Suggestions de films */}
          {isSearching && filteredMovies.length > 0 && (
            <ul
              className="absolute border max-h-40 w-full overflow-y-auto bg-rose-50 rounded-xl text-sm border-rose-500 mt-1 z-10"
              data-testid="movie-suggestions-list"
            >
              {filteredMovies.map((movie) => (
                <li
                  key={movie.id}
                  className="px-4 py-2 capitalize font-bold hover:bg-rose-500 cursor-pointer hover:text-white"
                  onClick={() => handleAddMovie(movie)}
                  data-testid={`movie-suggestion-${movie.id}`}
                >
                  {movie.title}{" "}
                  <span className="font-light">({movie.release_date})</span>
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
          {errors.movie_ids && (
            <span className="text-rose-500 text-xs my-2">
              {errors.movie_ids.message}
            </span>
          )}
        </div>

        {/* Display selected movies as tags */}
        <div className="mt-3 mb-6 w-full">
          {selectedMovies.map((movieId) => {
            const movie = movies.find((m) => m.id === movieId);
            return movie ? (
              <span
                key={movie.id}
                className="items-center my-2 border capitalize flex justify-between border-rose-500 w-full bg-rose-50 text-black text-sm font-light mr-2 px-3 py-1 rounded-xl"
                data-testid={`selected-movie-${movie.id}`}
              >
                <div className="font-bold">
                  {movie.title}{" "}
                  <span className="font-light">({movie.release_date})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMovie(movie.id)}
                  className="ml-2 text-rose-500 hover:text-rose-500"
                  data-testid={`remove-movie-${movie.id}`}
                >
                  &times;
                </button>
              </span>
            ) : null;
          })}
        </div>
        {isAdmin && (
          <div className="mb-6 text-black">
            <label className="inline-flex items-center text-sm">
              <input
                type="checkbox"
                {...register("is_collection")}
                className="form-checkbox"
                data-testid="is-collection-checkbox"
              />
              <span className="ml-2">Marquer comme collection</span>
            </label>
          </div>
        )}

        <SubmitButton
          defaultText="Créer la liste"
          loadingText="Chargement..."
          isSubmitting={isSubmitting}
          data-testid="create-list-submit-button"
        />
      </form>
    </div>
  );
};

export default CreateListForm;
