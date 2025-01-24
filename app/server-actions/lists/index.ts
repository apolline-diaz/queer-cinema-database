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

export async function createList(prevState: any, formData: FormData) {
  const schema = z.object({
    title: z.string().min(1, "Le titre est obligatoire"),
    description: z
      .string()
      .min(5, "La description doit faire au moins 5 caractères"),
    movie_id: z.string().min(1, "Au moins un film est obligatoire"),
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
    description: formData.get("description"),
    movie_id: formData.get("movie_id"),
    image_url: formData.get("image_url"),
  });

  if (!validatedFields.success) {
    return {
      type: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Veuillez remplir tous les champs obligatoires",
    };
  }

  const { title, description, movie_id, image_url } = validatedFields.data;

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

    // create list
    const { data: listData, error: listError } = await supabase
      .from("lists")
      .insert({
        title,
        description,
        image_url: imageData?.path,
      })
      .select("id"); // get id of the created list

    if (listError) {
      return {
        type: "error",
        message:
          "Erreur avec la base de données : Echec de la création de la liste",
      };
    }

    const listId = listData[0]?.id; // get list id

    // insert movies into lists_movies
    const movieIds = movie_id.split(",").map(Number); // movie_id on list format
    const movieInserts = movieIds.map((id) => ({
      list_id: listId,
      movie_id: id,
    }));

    const { error: moviesError } = await supabase
      .from("lists_movies")
      .insert(movieInserts);

    if (moviesError) {
      return {
        type: "error",
        message: "Erreur lors de l'insertion des films dans la liste",
      };
    }

    revalidatePath("/"); // Redirect or cache update if necessary
    redirect("/");
  } catch (error) {
    console.error("Error", error);
    return {
      type: "error",
      message: "Erreur avec la base de données : Problème inconnu",
    };
  }
}
