"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { addMovie } from "@/app/server-actions";
import { SubmitButton } from "@/app/components/submit-button";
import { supabase } from "@/lib/supabase";

const initialState = {
  type: "",
  message: "",
  errors: null,
};

const UploadFormPage: React.FC = () => {
  const [state, formAction] = useFormState<any>(addMovie as any, initialState);
  const [genres, setGenres] = useState<any[]>([]); // State pour les genres
  const [keywords, setKeywords] = useState<any[]>([]); // Liste de tous les mots-clés
  const [selectedKeywords, setSelectedKeywords] = useState<any[]>([]); // Liste des mots-clés sélectionnés
  const [keywordInput, setKeywordInput] = useState(""); // Saisie dans le champ des mots-clés

  // Récupérer les genres au chargement de la page
  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase.from("genres").select("id, name");
      if (error) {
        console.error("Erreur lors de la récupération des genres :", error);
      } else {
        setGenres(data);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchKeywords = async () => {
      const { data, error } = await supabase
        .from("keywords")
        .select("id, name");
      if (error) {
        console.error("Erreur lors de la récupération des mots-clés :", error);
      } else {
        setKeywords(data);
      }
    };

    fetchKeywords();
  }, []);

  // Gestion de la saisie dans le champ des mots-clés avec auto-complétion
  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value);
  };

  // Ajouter un mot-clé à la sélection
  const handleAddKeyword = (keyword: any) => {
    if (!selectedKeywords.find((k) => k.id === keyword.id)) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
    setKeywordInput(""); // Réinitialiser le champ de saisie
  };

  // Supprimer un mot-clé sélectionné
  const handleRemoveKeyword = (id: number) => {
    setSelectedKeywords(selectedKeywords.filter((k) => k.id !== id));
  };

  // Filtrer les suggestions de mots-clés basées sur la saisie de l'utilisateur
  const filteredKeywords = keywords.filter(
    (keyword) =>
      keyword.name.toLowerCase().includes(keywordInput.toLowerCase()) &&
      !selectedKeywords.find((k) => k.id === keyword.id) // Éviter de suggérer les mots-clés déjà sélectionnés
  );

  return (
    <div className="p-10">
      {state?.type === "error" && (
        <p id="title-error" className="text-red-500 text-xs italic">
          {state.message}
        </p>
      )}
      <form action={formAction} className="py-5 flex flex-col gap-5">
        {/* title */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="title"
          >
            Titre
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="title"
            type="text"
            name="title"
          />
          {state?.errors?.title && (
            <span
              id="description-error"
              className="text-red-500 text-xs italic"
            >
              {state.errors.title.join(",")}
            </span>
          )}
        </div>
        {/* director */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="director"
          >
            Réalisateur-ice
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="director"
            type="text"
            name="director"
          />
          {state?.errors?.director && (
            <span
              id="description-error"
              className="text-red-500 text-xs italic"
            >
              {state.errors.director.join(",")}
            </span>
          )}
        </div>
        {/* synopsis */}
        <div className="w-full md:w-1/2">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="description"
          >
            Synopsis
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
        {/* release date */}
        <div className="w-full md:w-1/5 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="release_date"
          >
            Année de sortie
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="release_date"
            type="text"
            name="release_date"
          />
          {state?.errors?.release_date && (
            <span
              id="release_date-error"
              className="text-red-500 text-xs italic"
            >
              {state.errors.release_date.join(",")}
            </span>
          )}
        </div>
        {/* genre */}
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="genre_id"
          >
            Genre
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-genre"
              name="genre_id"
            >
              <option value="">Sélectionnez un genre</option>
              {genres?.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        {/* keywords */}
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="keyword_id"
          >
            Mots-clés
          </label>

          <div className="relative">
            <input
              className="block appearance-none w-full bg-gray-200 text-gray-700 border py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
              type="text"
              value={keywordInput}
              onChange={handleKeywordInputChange}
              placeholder="Tapez pour rechercher des mots-clés"
            />

            {/* display keywords options*/}
            {keywordInput && filteredKeywords.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 z-10">
                {filteredKeywords.map((keyword) => (
                  <li
                    key={keyword.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleAddKeyword(keyword)}
                  >
                    {keyword.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* display selected keywords as tags*/}
          <div className="mt-3">
            {selectedKeywords.map((keyword) => (
              <span
                key={keyword.id}
                className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
              >
                {keyword.name}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(keyword.id)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        {/* image */}
        <div className="w-full md:w-1/2">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="image_url"
          >
            Image
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
      </form>
      <SubmitButton />
    </div>
  );
};

export default UploadFormPage;
