"use server";

import { Movie } from "@/app/types/movie";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMoviesByTitle = async (search: string): Promise<Movie[]> => {
  if (search.trim() === "") {
    // Si la recherche est vide, récupérer tous les films, triés du plus récent au plus ancien
    const movies = await prisma.movies.findMany({
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
        description: true,
        language: true,
        runtime: true,
        director: true,
        country: true,
      },

      orderBy: {
        created_at: "desc", // Tri par la date de création, du plus récent au plus ancien
      },
      take: 100, // Limiter à 100 films
    });

    return movies.map((movie) => ({
      ...movie,
      description: movie.description ?? null,
      language: movie.language ?? null,
      runtime: movie.runtime ?? null,
      director: movie.director ?? null,
      country: movie.country ?? null,
      genres: [], // Si tu ne les récupères pas dans la requête
      keywords: [],
      directors: [],
      countries: [],
    }));
  } else {
    // Recherche par titre, insensible à la casse
    const moviesByTitle = await prisma.movies.findMany({
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
        description: true,
        language: true,
        runtime: true,
        director: true,
        country: true,
      },
      where: {
        title: {
          contains: search, // Recherche insensible à la casse
          mode: "insensitive", // Insensible à la casse
        },
      },
    });

    return moviesByTitle;
  }
};
