"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { addMovie } from "@/app/server-actions/movies/add-movie";
import { SubmitButton } from "@/app/components/submit-button";
import { useRouter } from "next/navigation";
import MultiSelect from "@/app/components/multi-select"; // Importez le composant MultiSelect
import { getGenres } from "@/app/server-actions/genres/get-genres";
import { getCountries } from "@/app/server-actions/countries/get-countries";
import { getKeywords } from "@/app/server-actions/keywords/get-keywords";
import { Icon } from "@iconify/react/dist/iconify.js";

const CreateMoviePage: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      original_title: "",
      director_name: "",
      description: "",
      release_date: "",
      country_id: "",
      runtime: "",
      genre_id: "",
      type: "",
      keyword_id: "",
      image_url: null,
    },
  });
  const router = useRouter();
  const [countries, setCountries] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [genresData, countriesData, keywordsData] = await Promise.all([
        getGenres(),
        getCountries(),
        getKeywords(),
      ]);
      setGenres(genresData);
      setCountries(countriesData);
      setKeywords(keywordsData);
    };
    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("original_title", data.original_title);
      formData.append("director_name", data.director_name);
      formData.append("description", data.description);
      formData.append("release_date", data.release_date);
      formData.append("country_id", data.country_id);
      formData.append("runtime", data.runtime);
      formData.append("genre_id", data.genre_id);
      formData.append("type", data.type);
      if (selectedKeywords && selectedKeywords.length > 0) {
        const keywordIds = selectedKeywords.map((k) => k.value).join(",");
        formData.append("keyword_id", keywordIds);
      } else {
        formData.append("keyword_id", ""); // Valeur par défaut vide
      }
      if (data.image_url[0]) {
        formData.append("image_url", data.image_url[0]);
      }

      const result = await addMovie(formData);

      if (result.type === "success") {
        router.push("/movies");
      } else {
        console.error("Erreur:", result.message);
      }
    } catch (err) {
      console.error("Erreur inattendue:", err);
    }
  };

  return (
    <div className="px-10 py-20 text-sm w-full sm:w-1/2">
      <button
        onClick={() => router.back()}
        className="flex items-center border border-rose-900 mb-4 text-sm text-rose-900 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-full px-2 pr-3"
      >
        <Icon icon="mdi:chevron-left" className="inline size-4" />
        Retour
      </button>
      <h1 className="tracking-wide text-rose-900 text-2xl mb-5 font-medium">
        Ajouter un film
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="py-5 text-rose-900">
        {/* Title */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Titre</label>
          <input
            className="w-full text-black font-light bg-transparent border-b p-2 placeholder-gray-500 border-rose-900"
            {...register("title", { required: "Le titre est obligatoire" })}
            placeholder="Tapez le titre..."
          />
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title.message}</span>
          )}
        </div>
        {/* Original Title */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Titre original</label>
          <input
            className="w-full text-black font-light bg-transparent border-b p-2 placeholder-gray-500 border-rose-900"
            {...register("original_title")}
            placeholder="Tapez le titre original..."
          />
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title.message}</span>
          )}
        </div>
        {/* Director */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Réalisateur-ice</label>
          <input
            className="w-full text-black font-light placeholder-gray-500 bg-transparent border-b p-2 border-rose-900"
            {...register("director_name", {
              required: "Le nom du réalisateur est obligatoire",
            })}
            placeholder="Tapez le nom du/de la réalisateur-ice..."
          />
          {errors.director_name && (
            <span className="text-red-500 text-xs">
              {errors.director_name.message}
            </span>
          )}
        </div>

        {/* Synopsis */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Synopsis</label>
          <textarea
            className="w-full text-black font-light border p-2 placeholder-gray-500 rounded-md border-rose-900"
            {...register("description")}
            placeholder="Résumé de l'oeuvre..."
          ></textarea>
        </div>

        {/* Release date */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Année de sortie</label>
          <select
            className="w-full text-black font-light border p-2 placeholder-gray-500 rounded-md border-rose-900"
            {...register("release_date")}
          >
            <option value="">Sélectionnez une année</option>
            {Array.from(
              { length: 130 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Country */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Pays</label>
          <select
            className="w-full border font-light p-2 text-black rounded-md border-rose-900"
            {...register("country_id")}
          >
            <option value="">Sélectionnez un pays</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Runtime */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Durée (minutes)</label>
          <input
            type="number"
            className="w-full font-light border p-2 text-black rounded-md border-rose-900"
            {...register("runtime")}
            placeholder="00"
            min="0"
          />
        </div>

        {/* Type */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Type</label>
          <select
            className="w-full font-light text-black border p-2 rounded-md border-rose-900"
            {...register("type")}
          >
            <option value="">Sélectionnez un type</option>
            <option value="Long-métrage">Long-métrage</option>
            <option value="Moyen-métrage">Moyen-métrage</option>
            <option value="Court-métrage">Court-métrage</option>
            <option value="Série">Série</option>
            <option value="Emission TV">Emission TV</option>
          </select>
        </div>

        {/* Genre */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Genre</label>
          <select
            className="w-full border font-light text-black p-2 rounded-md border-rose-900"
            {...register("genre_id")}
          >
            <option value="">Sélectionnez un genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* keywords */}
        <div className="w-full md:w-1/2 mt-2 mb-4">
          <label
            className="block font-medium tracking-wide text-rose-900 mb-2"
            htmlFor="keywords"
          >
            Mots-clés
          </label>
          <Controller
            name="keyword_id"
            control={control}
            render={({ field }) => (
              <MultiSelect
                name="keywords"
                control={control}
                options={keywords}
                label="Mots-clé"
                placeholder="Chercher et ajouter des mot-clés..."
                onChange={(selected) => {
                  setSelectedKeywords(selected);
                  const keywordIds = selected.map((k) => k.value).join(",");
                  setValue("keyword_id", keywordIds);
                }}
                defaultValues={selectedKeywords}
              />
            )}
          />
          {errors?.keyword_id && (
            <span id="keywords-error" className="text-red-500 text-xs italic">
              {errors.keyword_id.message}
            </span>
          )}
        </div>

        {/* Image */}
        <div className="mb-8">
          <label className="block font-medium mb-2">Image</label>
          <input
            className="rounded-md"
            type="file"
            {...register("image_url")}
            accept="image/*"
          />
        </div>
        <div className="mt-8 flex flex-col gap-3 xs:flex-col sm:flex-row justify-between">
          <button
            type="button"
            onClick={() => router.push("/movies")}
            className="xs:w-full sm:w-[200px] border hover:border-red-500 hover:text-red-500 text-rose-900 px-4 py-2 border-rose-900 rounded-md"
          >
            Annuler
          </button>
          <SubmitButton
            defaultText="Ajouter"
            loadingText="Chargement..."
            isSubmitting={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateMoviePage;
