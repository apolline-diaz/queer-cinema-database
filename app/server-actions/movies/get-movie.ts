"use server";

import { PrismaClient } from "@prisma/client";

export async function getMovie(id: string) {
  const prisma = new PrismaClient();

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

    // Transform the movie data for the front-end
    const transformedMovie = {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      release_date: movie.release_date,
      language: movie.language,
      runtime: movie.runtime ? Number(movie.runtime) : null,
      image_url: movie.image_url,
      boost: movie.boost || false,
      genres: movie.movie_genres.map((g) => ({
        id: g.genres.id,
        name: g.genres.name,
      })),
      keywords: movie.movie_keywords.map((k) => ({
        id: k.keywords.id,
        name: k.keywords.name,
      })),
      directors: movie.movie_directors.map((d) => ({
        id: d.directors.id,
        name: d.directors.name,
      })),
      countries: movie.movie_countries.map((c) => ({
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
