"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

type UpdateMovieInput = {
  id: string;
  title: string;
  description: string;
  release_date: string;
  language: string;
  runtime: number | null;
  image_url: string | null;
  director: string;
  country: string;
  genres: string[];
  keywords: string[];
  image?: File | null;
};

export async function updateMovie(movie: UpdateMovieInput) {
  const prisma = new PrismaClient();

  try {
    let imageUrl = movie.image_url;

    // Handle file upload if provided
    if (movie.image && movie.image instanceof File) {
      const bytes = await movie.image.arrayBuffer();
      const buffer = Buffer.from(await movie.image.arrayBuffer());
      const uint8Array = new Uint8Array(buffer);

      const filename = `${Date.now()}-${movie.image.name.replace(/\s+/g, "-")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, uint8Array);
      imageUrl = `/uploads/${filename}`;
    }

    // Update movie data
    await prisma.movies.update({
      where: { id: movie.id },
      data: {
        title: movie.title,
        description: movie.description,
        release_date: movie.release_date,
        language: movie.language,
        runtime: movie.runtime ? Number(movie.runtime) : null,
        image_url: imageUrl,
        director: movie.director,
        country: movie.country,
        updated_at: new Date(),
      },
    });

    // Update genres & keywords
    await prisma.movie_genres.deleteMany({ where: { movie_id: movie.id } });
    await prisma.movie_keywords.deleteMany({ where: { movie_id: movie.id } });

    for (const genreName of movie.genres) {
      let genre = await prisma.genres.findFirst({ where: { name: genreName } });
      if (!genre)
        genre = await prisma.genres.create({ data: { name: genreName } });
      await prisma.movie_genres.create({
        data: { movie_id: movie.id, genre_id: genre.id },
      });
    }

    for (const keywordName of movie.keywords) {
      let keyword = await prisma.keywords.findFirst({
        where: { name: keywordName },
      });
      if (!keyword)
        keyword = await prisma.keywords.create({ data: { name: keywordName } });
      await prisma.movie_keywords.create({
        data: { movie_id: movie.id, keyword_id: keyword.id },
      });
    }

    // Revalidate UI
    revalidatePath(`/movies/${movie.id}`);
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
