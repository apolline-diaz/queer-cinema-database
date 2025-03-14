"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Movie {
  id: string;
  title: string;
  image_url: string | null;
  release_date: string | null;
}

export const getMoviesByTitle = async (search: string): Promise<Movie[]> => {
  if (search.trim() === "") {
    // Si la recherche est vide, récupérer tous les films, triés du plus récent au plus ancien
    const movies = await prisma.movies.findMany({
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
      orderBy: {
        created_at: "desc", // Tri par la date de création, du plus récent au plus ancien
      },
      take: 100, // Limiter à 100 films
    });

    return movies;
  } else {
    // Recherche par titre, insensible à la casse
    const moviesByTitle = await prisma.movies.findMany({
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
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

export const getMoviesByKeyword = async (search: string): Promise<Movie[]> => {
  if (search.trim() === "") {
    return []; // Pas de résultats si le champ est vide
  }

  // Recherche des mots-clés correspondants
  const keywords = await prisma.keywords.findMany({
    where: {
      name: {
        contains: search, // Recherche insensible à la casse
        mode: "insensitive", // Insensible à la casse
      },
    },
    select: {
      id: true,
    },
  });

  if (keywords.length > 0) {
    const keywordIds = keywords.map((k) => k.id);

    // Recherche des films associés aux mots-clés
    const movieKeywords = await prisma.movie_keywords.findMany({
      where: {
        keyword_id: {
          in: keywordIds, // Recherche les films qui ont les mots-clés associés
        },
      },
      select: {
        movie_id: true,
      },
    });

    const movieIds = movieKeywords.map((mk) => mk.movie_id);

    // Recherche des films par IDs associés aux mots-clés
    const movies = await prisma.movies.findMany({
      where: {
        id: {
          in: movieIds, // Recherche les films dont l'ID est dans movieIds
        },
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
    });

    return movies;
  }

  return [];
};
