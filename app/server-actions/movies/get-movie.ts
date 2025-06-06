"use server";

import { PrismaClient } from "@prisma/client";

export async function getMovie(id: string) {
  const prisma = new PrismaClient();

  try {
    const movie = await prisma.movies.findUnique({
      where: { id: id },
      include: {
        movies_genres: { include: { genres: true } },
        movies_keywords: { include: { keywords: true } },
        movies_directors: { include: { directors: true } },
        movies_countries: { include: { countries: true } },
      },
    });

    console.log(movie); // Vérifie ici si "type" est présent

    if (!movie) {
      return { movie: null, error: "Movie not found" };
    }

    // Transform the movie data for the front-end
    const transformedMovie = {
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      description: movie.description,
      release_date: movie.release_date,
      language: movie.language,
      runtime: movie.runtime ? Number(movie.runtime) : null,
      type: movie.type,
      image_url: movie.image_url,
      boost: movie.boost || false,
      genres: movie.movies_genres.map((g) => ({
        id: Number(g.genres.id),
        name: g.genres.name,
      })),
      keywords: movie.movies_keywords.map((k) => ({
        id: k.keywords.id,
        name: k.keywords.name,
      })),
      directors: movie.movies_directors.map((d) => ({
        id: d.directors.id,
        name: d.directors.name,
      })),
      countries: movie.movies_countries.map((c) => ({
        id: c.countries.id,
        name: c.countries.name,
        code: c.countries.code,
      })),
      created_at: movie.created_at,
      updated_at: movie.updated_at,
    };

    return { movie: transformedMovie, error: null };
  } catch (error) {
    console.error("Error fetching movie:", error);
    return {
      movie: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  } finally {
    await prisma.$disconnect();
  }
}
