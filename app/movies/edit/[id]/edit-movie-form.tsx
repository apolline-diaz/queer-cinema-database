"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { updateMovie } from "@/app/server-actions/movies/update-movie";
import Image from "next/image";
import { getImageUrl } from "@/utils/index";
import { Movie } from "@/app/types/movie";
import { Keyword } from "@/app/types/keyword";
import { getKeywords } from "@/app/server-actions/keywords.ts/get-keywords";

type KeywordOption = {
  value: string;
  label: string;
};

type FormData = {
  title: string;
  description: string;
  release_date: string;
  language: string;
  runtime: number | null;
  image_url: string;
  image: FileList | null;
  director: string;
  country: string;
  genres: string;
  keywords: string[];
};

export default function EditMovieForm({ movie }: { movie: Movie }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableKeywords, setAvailableKeywords] = useState<KeywordOption[]>(
    []
  );
  const [keywordInput, setKeywordInput] = useState("");
  const [filteredKeywords, setFilteredKeywords] = useState<KeywordOption[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<KeywordOption[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(
    movie.image_url || null
  );

  // Prepare initial form values from movie data
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: movie.title,
      description: movie.description || "",
      release_date: movie.release_date || "",
      language: movie.language || "",
      runtime: movie.runtime || undefined,
      image_url: movie.image_url || "",
      image: null,
      director: movie.director || "",
      country: movie.country || "",
      genres: movie.genres?.map((genre) => genre.name).join(", ") || "",
      keywords:
        movie.keywords?.map((keyword) => keyword.name || "").filter(Boolean) ||
        [],
    },
  });

  // Watch for image changes to update preview
  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);

      // Clean up the object URL when the component unmounts or the file changes
      return () => URL.revokeObjectURL(fileUrl);
    }
  }, [imageFile]);

  // Fetch keywords on component mount
  useEffect(() => {
    const fetchKeywords = async () => {
      const keywords = await getKeywords();
      setAvailableKeywords(keywords);

      // Set initially selected keywords
      if (movie && movie.keywords) {
        const associatedKeywords = movie.keywords
          .filter((keyword) => keyword.name) // Filter out keywords without names
          .map((keyword) => ({
            value: keyword.id.toString(),
            label: keyword.name || "",
          }));
        setSelectedKeywords(associatedKeywords);
      }
    };

    fetchKeywords();
  }, [movie]);

  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywordInput(value);

    // Filter available keywords based on input
    const filtered = availableKeywords.filter((keyword) =>
      keyword.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredKeywords(filtered);
  };

  // Function to add a selected keyword
  const handleAddKeyword = (keyword: KeywordOption) => {
    if (!selectedKeywords.find((k) => k.value === keyword.value)) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
    setKeywordInput(""); // Reset search input after adding
    setFilteredKeywords([]);
  };

  // Function to remove a selected keyword
  const handleRemoveKeyword = (keywordValue: string) => {
    setSelectedKeywords(
      selectedKeywords.filter((k) => k.value !== keywordValue)
    );
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Parse genres
      const genresArray = data.genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);

      // Get keyword names from selected keywords
      const keywordNames = selectedKeywords.map((k) => k.label);

      // Prepare movie data for update
      const movieData = {
        id: movie.id,
        title: data.title,
        description: data.description,
        release_date: data.release_date,
        language: data.language,
        runtime: data.runtime,
        image_url: data.image_url,
        image: data.image && data.image.length > 0 ? data.image[0] : null,
        director: data.director,
        country: data.country,
        genres: genresArray,
        keywords: keywordNames,
      };

      const { success, error } = await updateMovie(movieData);

      if (success) {
        // Navigate back to movie page
        router.push(`/movies/${movie.id}`);
        router.refresh();
      } else {
        setError(error || "Something went wrong");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" rounded-lg shadow-lg justify-start text-white mx-auto"
    >
      {error && (
        <div className="mb-4 p-4 bg-red-500 text-white rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Image Preview */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">
            Image actuelle
          </label>
          <div className="relative h-64 bg-gray-700 rounded-md overflow-hidden">
            {imagePreview ? (
              <Image
                src={getImageUrl(imagePreview)}
                alt={movie.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Pas dimage disponible
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">
            Télécharger une nouvelle image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full py-2 hover:cursor-pointer focus:outline-none"
          />
          <p className="text-gray-400 text-xs mt-1">
            Laisser vide pour garder l&apos;image actuelle
          </p>
        </div>

        {/* Image URL */}
        {/* <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            {...register("image_url")}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <p className="text-gray-400 text-xs mt-1">
            Will be used if no image is uploaded
          </p>
        </div> */}

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-3 py-2 font-light text-sm bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Release Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Année de sortie
          </label>
          <input
            {...register("release_date")}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Runtime */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Durée (minutes)
          </label>
          <input
            type="number"
            {...register("runtime", {
              pattern: {
                value: /^\d*\.?\d*$/,
                message: "Must be a number",
              },
            })}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          {errors.runtime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.runtime.message}
            </p>
          )}
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium mb-1">Langue</label>
          <input
            {...register("language")}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Director */}
        <div>
          <label className="block text-sm font-medium mb-1">Réalisation</label>
          <input
            {...register("director")}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Country */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">
            Pays de production
          </label>
          <input
            {...register("country")}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <p className="text-gray-400 text-xs mt-1">
            Enter country name (e.g., France, USA)
          </p>
        </div>

        {/* Genres */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Genres</label>
          <input
            {...register("genres")}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <p className="text-gray-400 text-xs mt-1">
            Entrez les genres séparés par des virgules (e.g., Drame, Comédie,
            Romance)
          </p>
        </div>

        {/* Keywords - Multi-Select */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Mots-clé</label>
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <div className="relative">
                {/* Search input */}
                <input
                  type="text"
                  className="block appearance-none w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Cherchez un mot-clé parmi la liste"
                  value={keywordInput}
                  onChange={handleKeywordInputChange}
                />

                {/* Filtered suggestions */}
                {keywordInput && filteredKeywords.length > 0 && (
                  <ul className="absolute left-0 right-0 bg-gray-700 rounded-md border mt-1 z-10 max-h-40 overflow-y-auto">
                    {filteredKeywords.map((keyword) => (
                      <li
                        key={keyword.value}
                        className="px-4 py-2 cursor-pointer hover:bg-rose-500"
                        onClick={() => {
                          handleAddKeyword(keyword);
                          const updatedKeywords = [
                            ...field.value.filter((k) => k !== keyword.label),
                            keyword.label,
                          ];
                          field.onChange(updatedKeywords);
                        }}
                      >
                        {keyword.label}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Display selected keywords */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedKeywords.map((keyword) => (
                    <span
                      key={keyword.value}
                      className="inline-flex items-center hover:cursor-pointer bg-rose-100 text-rose-500 text-sm font-medium px-2 py-1 rounded"
                    >
                      {keyword.label}
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => {
                          handleRemoveKeyword(keyword.value);
                          const updatedKeywords = field.value.filter(
                            (k) => k !== keyword.label
                          );
                          field.onChange(updatedKeywords);
                        }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          />

          <p className="text-gray-400 text-xs mt-1">
            Vous pouvez sélectionner plusieurs mot-clés.
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 rounded-md hover:from-rose-600 hover:to-red-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Mise à jour..." : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
