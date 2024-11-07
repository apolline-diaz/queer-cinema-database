"use server";

import { z } from "zod";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MAX_FILE_SIZE = 5000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export async function addMovie(prevState: any, formData: FormData) {
  const schema = z.object({
    title: z.string().min(1, "Le titre est obligatoire"),
    director_name: z
      .string()
      .min(1, "Le prénom du réalisateur est obligatoire"),
    description: z
      .string()
      .min(5, "Le synopsis doit faire au moins 5 caractères"),
    release_date: z.number().min(4, "L'année de sortie est obligatoire"),
    runtime: z.number().min(4, "L'année de sortie est obligatoire"),
    country_id: z.string().min(1, "Le pays est obligatoire"),
    genre_id: z.string().min(1, "Le genre est obligatoire"),
    keyword_id: z.string().min(1, "Un mot-clé est obligatoire"),
    image_url: z
      .any()
      .refine(
        (file) => file?.size <= MAX_FILE_SIZE,
        `La taille maximum de l'image est 5MB`
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        `Seuls les formats .jpg, jpeg, png et webp sont acceptés`
      ),
  });

  const validatedFields = schema.safeParse({
    title: formData.get("title"),
    director_name: formData.get("director_name"),
    description: formData.get("description"),
    release_date: Number(formData.get("release_date")),
    runtime: Number(formData.get("runtime")),
    country_id: formData.get("country_id"),
    genre_id: formData.get("genre_id"),
    keyword_id: formData.get("keyword_id"),
    image_url: formData.get("image_url"),
  });

  if (!validatedFields.success) {
    console.log("Error", validatedFields.error);
    return {
      type: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Veuillez remplir tous les champs obligatoires",
    };
  }

  const {
    title,
    director_name,
    description,
    country_id,
    genre_id,
    runtime,
    keyword_id,
    release_date,
    image_url,
  } = validatedFields.data;
  console.log(validatedFields.data);

  try {
    // image upload
    const fileName = `${Math.random()}-${title}`;
    const supabase = createServerActionClient({ cookies });
    const { data: imageData, error: imageError } = await supabase.storage
      .from("storage")
      .upload(fileName, image_url, {
        cacheControl: "3600",
        upsert: false,
      });

    if (imageError) {
      return {
        type: "error",
        message:
          "Erreur avec la base de données : Echec du téléchargement de l'image",
      };
    }

    // movie insert
    const { data: movieData, error: movieError } = await supabase
      .from("movies")
      .insert({
        title,
        release_date,
        runtime,
        description,
        image_url: imageData?.path,
      })
      .select("id"); // get id movie

    if (movieError) {
      return {
        type: "error",
        message: "Erreur avec la base de données : Echec de l'ajout du film",
      };
    }

    const movieId = movieData[0]?.id; // get movie id

    // insert country in movie_countries
    const countryIds = country_id.split(",").map(Number); // country_id on list format
    const countryInsert = countryIds.map((id) => ({
      movie_id: movieId,
      country_id: id,
    }));

    const { error: countryError } = await supabase
      .from("movie_countries")
      .insert(countryInsert);

    if (countryError) {
      return {
        type: "error",
        message: "Erreur lors de l'insertion des pays",
      };
    }

    //insert director
    const { data: directorData, error: directorError } = await supabase
      .from("directors")
      .upsert({
        name: director_name,
      })
      .select("id");

    if (directorError) {
      return {
        type: "error",
        message: "Erreur lors de l'insertion du réalisateur",
      };
    }

    const directorId = directorData[0]?.id;
    // Link director to movie
    const { error: movieDirectorError } = await supabase
      .from("movie_directors")
      .insert({
        movie_id: movieId,
        director_id: directorId,
      });

    if (movieDirectorError) {
      return {
        type: "error",
        message: "Erreur lors de la liaison du réalisateur au film",
      };
    }

    // insert genres in movie_genres
    const genreIds = genre_id.split(",").map(Number); // genre_id on list format
    const genreInserts = genreIds.map((id) => ({
      movie_id: movieId,
      genre_id: id,
    }));

    const { error: genreError } = await supabase
      .from("movie_genres")
      .insert(genreInserts);

    if (genreError) {
      return {
        type: "error",
        message: "Erreur lors de l'insertion des genres",
      };
    }

    // insert keywords into movie_keywords
    const keywordIds = keyword_id.split(",").map(Number);
    const keywordInserts = keywordIds.map((id) => ({
      movie_id: movieId,
      keyword_id: id,
    }));

    const { error: keywordError } = await supabase
      .from("movie_keywords")
      .insert(keywordInserts);

    if (keywordError) {
      return {
        type: "error",
        message: "Erreur lors de l'insertion des mots-clés",
      };
    }
  } catch (error) {
    console.error("Error", error);
    return {
      type: "error",
      message: "Erreur avec la base de données : Echec de l'ajout du film",
    };
  }

  // redirect

  revalidatePath("/");
  redirect("/");
}
