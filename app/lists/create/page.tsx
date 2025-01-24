"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { createList } from "@/app/server-actions/lists";
import { SubmitButton } from "@/app/components/submit-button";
import { getMovies } from "@/utils/get-data-to-create-list";

const initialState = {
  type: "",
  message: "",
  errors: null,
};

const CreateListPage: React.FC = () => {
  const [state, formAction] = useFormState<any>(
    createList as any,
    initialState
  );
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<any[]>([]);
  const [movieInput, setMovieInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const moviesData = await getMovies();
      setMovies(moviesData);
    };
    fetchData();
  }, []);

  // Movie field input management with auto-completion
  const handleMovieInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovieInput(e.target.value);
  };

  // add movie to selection
  const handleAddMovie = (movie: any) => {
    if (!selectedMovies.find((m) => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, movie]);
    }
    setMovieInput("");
  };

  // remove a selected movie
  const handleRemoveMovie = (id: number) => {
    setSelectedMovies(selectedMovies.filter((m) => m.id !== id));
  };

  // movies suggested depending on the input of user
  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(movieInput.toLowerCase()) &&
      !selectedMovies.find((m) => m.id === movie.id) // avoid proposing movies that have already been integrated
  );

  return (
    <div className="p-10">
      <div className="tracking-wide text-xl mb-5">Créez une liste de films</div>
      {state?.type === "error" && (
        <p id="title-error" className="text-red-500 text-xs italic">
          {state.message}
        </p>
      )}
      <form action={formAction} className="py-5">
        {/* Title of the list */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="title"
          >
            Titre de la liste
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="title"
            type="text"
            name="title"
          />
          {state?.errors?.title && (
            <span id="title-error" className="text-red-500 text-xs italic">
              {state.errors.title.join(",")}
            </span>
          )}
        </div>

        {/* Description of the list */}
        <div className="w-full md:w-1/2 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="description"
            name="description"
          ></textarea>
          {state?.errors?.description && (
            <span
              id="description-error"
              className="text-red-500 text-xs italic"
            >
              {state.errors.description.join(",")}
            </span>
          )}
        </div>

        {/* Movies Selection */}
        <div className="w-full md:w-1/2 mt-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="movie_id"
          >
            Films
          </label>
          <div className="relative">
            <input
              className="block appearance-none w-full bg-gray-200 text-gray-700 border py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
              name="movie_input" // Change the name to something clearer
              value={movieInput}
              onChange={handleMovieInputChange}
              placeholder="Tapez pour rechercher des films"
            />
            {/* display movie options*/}
            {movieInput && filteredMovies.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 z-10">
                {filteredMovies.map((movie) => (
                  <li
                    key={movie.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleAddMovie(movie)}
                  >
                    {movie.title}
                  </li>
                ))}
              </ul>
            )}
            <input
              type="hidden"
              name="movie_id"
              value={selectedMovies.map((movie) => movie.id).join(",")}
            />
          </div>

          {/* display selected movies as tags*/}
          <div className="mt-3">
            {selectedMovies.map((movie) => (
              <span
                key={movie.id}
                className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
              >
                {movie.title}
                <button
                  type="button"
                  name="movie_id"
                  onClick={() => handleRemoveMovie(movie.id)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="w-full md:w-1/2 mt-3 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="image_url"
          >
            Image de la Liste
          </label>
          <input
            className="appearance-none block w-full hover:cursor"
            id="image_url"
            name="image_url"
            accept="image/*"
            type="file"
          />
          {state?.errors?.image_url && (
            <span id="image_url-error" className="text-red-500 text-xs italic">
              {state.errors.image_url.join(",")}
            </span>
          )}
        </div>

        <SubmitButton />
      </form>
    </div>
  );
};

export default CreateListPage;
