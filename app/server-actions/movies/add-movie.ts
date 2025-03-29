"use server";

import { z } from "zod";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/utils/is-user-admin";

const MAX_FILE_SIZE = 5000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export async function addMovie(prevState: any, formData: FormData) {
  const userIsAdmin = await isAdmin();

  if (!userIsAdmin) {
    return {
      type: "error",
      message: "You must be admin to update a movie",
      errors: null,
    };
  }

  const schema = z.object({
    title: z
      .string()
      .min(1, "Le titre est obligatoire")
      .regex(/^[\s\S]*$/, "Le titre contient des caractères non valides"), // accepte tous les caractères
    director_name: z
      .string()
      .min(1, "Le prénom du réalisateur est obligatoire"),
    description: z
      .string()
      .min(5, "Le synopsis doit faire au moins 5 caractères"),
    release_date: z.string().min(4, "L'année de sortie est obligatoire"),
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
    release_date: formData.get("release_date"),
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

    const result = await prisma.$transaction(async (prisma) => {
      // Upsert director
      const director = await prisma.directors.upsert({
        where: { id: 0 }, // Placeholder
        // where: { name: director_name }, // Only works if 'name' is defined as @unique in schema
        update: { name: director_name },
        create: { name: director_name },
      });

      // Create movie
      const movie = await prisma.movies.create({
        data: {
          title,
          release_date,
          runtime,
          description,
          image_url: imageData?.path,
        },
      });

      // Insert movie countries
      const countryIds = country_id.split(",").map(Number);
      await prisma.movie_countries.createMany({
        data: countryIds.map((countryId) => ({
          movie_id: movie.id,
          country_id: countryId,
        })),
      });

      // Link director to movie
      await prisma.movie_directors.create({
        data: {
          movie_id: movie.id,
          director_id: director.id,
        },
      });

      // Insert genres
      const genreIds = genre_id.split(",").map(Number);
      await prisma.movie_genres.createMany({
        data: genreIds.map((genreId) => ({
          movie_id: movie.id,
          genre_id: genreId,
        })),
      });

      // Insert keywords
      const keywordIds = keyword_id.split(",").map(Number);
      await prisma.movie_keywords.createMany({
        data: keywordIds.map((keywordId) => ({
          movie_id: movie.id,
          keyword_id: keywordId,
        })),
      });

      return movie;
    });
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
