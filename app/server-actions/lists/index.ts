"use server";

import { z } from "zod";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Constants
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
] as const;

// Zod schema
const createListSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  description: z
    .string()
    .min(5, "La description doit faire au moins 5 caractères"),
  movie_id: z.string().min(1, "Au moins un film est obligatoire"),
  image_url: z
    .any()
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `La taille maximum de l'image est 5MB`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Seuls les formats .jpg, jpeg, png et webp sont acceptés`
    ),
});

export async function createList(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  // Get the current user session first
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return {
      type: "error",
      message: "Vous devez être connecté pour créer une liste",
      errors: null,
    };
  }

  // Validate form data
  const validatedFields = createListSchema.safeParse({
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
    let imagePath: string | undefined;

    // Handle image upload if provided
    if (image_url) {
      const fileName = `${session.user.id}-${Date.now()}-${title}`.replace(
        /[^a-zA-Z0-9]/g,
        "-"
      );

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
          errors: null,
        };
      }

      imagePath = imageData?.path;
    }

    // Create the list
    const { data: listData, error: listError } = await supabase
      .from("lists")
      .insert({
        title,
        description,
        image_url: imagePath,
        user_id: session.user.id,
      })
      .select("id")
      .single();

    if (listError) {
      return {
        type: "error",
        message:
          "Erreur avec la base de données : Echec de la création de la liste",
        errors: null,
      };
    }

    // Parse and insert movie relationships
    const movieIds = movie_id.split(",").filter(Boolean);

    if (movieIds.length > 0) {
      const movieInserts = movieIds.map((id) => ({
        list_id: listData.id,
        movie_id: id,
        added_at: new Date().toISOString(),
      }));

      const { error: moviesError } = await supabase
        .from("lists_movies")
        .insert(movieInserts);

      if (moviesError) {
        // If movie insertion fails, delete the created list to maintain consistency
        await supabase.from("lists").delete().eq("id", listData.id);

        return {
          type: "error",
          message: "Erreur lors de l'insertion des films dans la liste",
          errors: null,
        };
      }
    }

    // Success! Revalidate and redirect
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.error("Error creating list:", error);
    return {
      type: "error",
      message: "Erreur avec la base de données : Problème inconnu",
      errors: null,
    };
  }
}
