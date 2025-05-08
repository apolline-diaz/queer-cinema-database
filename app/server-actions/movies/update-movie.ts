"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/utils/is-user-admin";
import { PrismaClient } from "@prisma/client";

export async function updateMovie(formData: FormData) {
  const supabase = createClient();
  const userIsAdmin = await isAdmin();

  if (!userIsAdmin) {
    return { type: "error", message: "You must be admin to update a movie" };
  }

  const prisma = new PrismaClient();

  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const release_date = formData.get("release_date") as string;
    const language = formData.get("language") as string;
    const type = formData.get("type") as string;
    const runtime = formData.get("runtime")
      ? Number(formData.get("runtime"))
      : null;
    const image_url = formData.get("image_url") as string;
    const image = formData.get("image") as File | null;
    const director_ids = JSON.parse(
      formData.get("director_ids") as string
    ) as string[];
    const country_id = formData.get("country_id") as string;
    const genre_ids = JSON.parse(
      formData.get("genre_ids") as string
    ) as string[];
    const keyword_ids = JSON.parse(
      formData.get("keyword_ids") as string
    ) as string[];

    let imageUrl = image_url;

    // Upload l'image si elle est fournie
    if (image) {
      const filename = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage
        .from("storage")
        .upload(filename, image, { cacheControl: "3600", upsert: true });

      if (error) {
        throw new Error(error.message);
      }
      imageUrl = `${data?.path}`;
    }

    await prisma.movies.update({
      where: { id },
      data: {
        title,
        description,
        release_date,
        language,
        type,
        runtime,
        image_url: imageUrl,
        updated_at: new Date(),
      },
    });

    // Update relationships (directors, countries, genres, keywords)
    await prisma.movies_directors.deleteMany({ where: { movie_id: id } });
    for (const directorId of director_ids) {
      await prisma.movies_directors.create({
        data: { movie_id: id, director_id: BigInt(directorId) },
      });
    }

    await prisma.movies_countries.deleteMany({ where: { movie_id: id } });
    await prisma.movies_countries.create({
      data: { movie_id: id, country_id: parseInt(country_id) },
    });

    await prisma.movies_genres.deleteMany({ where: { movie_id: id } });
    for (const genreId of genre_ids) {
      await prisma.movies_genres.create({
        data: { movie_id: id, genre_id: BigInt(genreId) },
      });
    }

    await prisma.movies_keywords.deleteMany({ where: { movie_id: id } });
    for (const keywordId of keyword_ids) {
      await prisma.movies_keywords.create({
        data: { movie_id: id, keyword_id: Number(keywordId) },
      });
    }

    revalidatePath(`/movies/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating movie:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  } finally {
    await prisma.$disconnect();
  }
}
