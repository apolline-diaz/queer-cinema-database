"use server";

//import { supabase } from "@/lib/supabase";
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
    director: z.string().min(1, "Lea réalisateur-ce est obligatoire"),
    description: z
      .string()
      .min(5, "Le synopsis doit faire au moins 5 caractères"),
    release_date: z.string().min(4, "L'année de sortie est obligatoire"),
    keyword_id: z.string().min(1, "Un mot-clé est obligatoire"),
    genre_id: z.string().min(1, "Le genre est obligatoire"),
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
    director: formData.get("director"),
    description: formData.get("description"),
    release_date: formData.get("release_date"),
    keyword_id: formData.get("keyword_id"),
    genre_id: formData.get("genre_id"),
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
    director,
    description,
    genre_id,
    keyword_id,
    release_date,
    image_url,
  } = validatedFields.data;
  try {
    const fileName = `${Math.random()}-${title}`;
    const supabase = createServerActionClient({ cookies });
    const { data, error } = await supabase.storage
      .from("storage")
      .upload(fileName, image_url, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      return {
        type: "error",
        message:
          "Erreur avec la base de données : Echec du téléchargement de l'image",
      };
    }

    if (data) {
      // insert
      const path = data.path;

      const { error: moviesError } = await supabase.from("movies").insert({
        title,
        director,
        release_date,
        description,
        genre_id,
        keyword_id,
        image_url: path,
      });

      if (moviesError) {
        return {
          type: "error",
          message: "Erreur avec la base de données : Echec de l'ajout du film",
        };
      }
    }
  } catch (error) {
    console.error("Error", error);
    return {
      type: "error",
      message: "Erreur avec la base de données : Echec de l'ajout du film",
    };
  }

  revalidatePath("/");
  redirect("/");
}
