"use server";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";

export async function getMovie(id: string) {
  const prisma = new PrismaClient();

  // Définition du schéma Zod pour valider et formater les données du film
  const MovieSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    release_date: z.string().nullable(),
    language: z.string().nullable(),
    runtime: z.number().nullable(), // Conversion du Decimal en number
    image_url: z.string().nullable(),
    director: z.string().nullable(),
    country: z.string().nullable(),
    created_at: z.date().nullable(),
    updated_at: z.date().nullable(),
    genres: z.array(
      z.object({
        id: z.bigint(),
        name: z.string().nullable(),
        created_at: z.date(),
      })
    ),
    keywords: z.array(
      z.object({
        id: z.number(),
        name: z.string().nullable(),
        created_at: z.date(),
      })
    ),
    directors: z.array(
      z.object({
        id: z.bigint(),
        name: z.string().nullable(),
        created_at: z.date(),
      })
    ),
    countries: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        code: z.string().nullable(),
        created_at: z.date(),
      })
    ),
  });

  try {
    const movie = await prisma.movies.findUnique({
      where: {
        id: id,
      },
      include: {
        movie_genres: {
          include: {
            genres: true,
          },
        },
        movie_keywords: {
          include: {
            keywords: true,
          },
        },
        movie_directors: {
          include: {
            directors: true,
          },
        },
        movie_countries: {
          include: {
            countries: true,
          },
        },
      },
    });

    if (!movie) {
      return { movie: null, error: "Movie not found" };
    }

    // Transform the data to match the format expected by the UI
    const transformedMovie = {
      ...movie,
      runtime: movie.runtime ? Number(movie.runtime) : null,
      genres: movie.movie_genres.map((g) => g.genres),
      keywords: movie.movie_keywords.map((k) => k.keywords),
      directors: movie.movie_directors.map((d) => d.directors),
      countries: movie.movie_countries.map((c) => c.countries),
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
