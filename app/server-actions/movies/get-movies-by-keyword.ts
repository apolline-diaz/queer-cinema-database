"use server";

import { Movie } from "@/app/types/movie";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMoviesByKeyword = async (search: string): Promise<Movie[]> => {
  if (search.trim() === "") {
    return [];
  }

  const keywords = await prisma.keywords.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    select: { id: true },
  });

  if (keywords.length === 0) return [];

  const keywordIds = keywords.map((k) => k.id);

  const movieKeywords = await prisma.movie_keywords.findMany({
    where: { keyword_id: { in: keywordIds } },
    select: { movie_id: true },
  });

  const movieIds = movieKeywords.map((mk) => mk.movie_id);
  if (movieIds.length === 0) return [];

  const movies = await prisma.movies.findMany({
    where: { id: { in: movieIds } },
    select: {
      id: true,
      title: true,
      description: true,
      release_date: true,
      language: true,
      runtime: true,
      image_url: true,
      director: true,
      country: true,
    },
  });

  return movies; // Pas besoin de conversion si Movie accepte déjà Decimal
};
