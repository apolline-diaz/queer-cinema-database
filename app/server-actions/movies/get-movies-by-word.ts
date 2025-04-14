"use server";

import { Movie } from "@/app/types/movie";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMoviesByWord = async (search: string): Promise<Movie[]> => {
  // Si la recherche est vide, retourner les films récents
  if (search.trim() === "") {
    const movies = await prisma.movies.findMany({
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 20, // Limiter à 20 résultats pour améliorer les performances
    });

    return movies;
  }

  // Recherche unifiée avec une seule requête utilisant des jointures
  // Recherche unifiée avec Prisma
  const movies = await prisma.movies.findMany({
    where: {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          movies_keywords: {
            some: {
              keywords: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
        {
          movies_directors: {
            some: {
              directors: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
        {
          movies_countries: {
            some: {
              countries: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
        {
          movies_genres: {
            some: {
              genres: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      title: true,
      image_url: true,
      release_date: true,
    },
    take: 50, // Limiter le nombre de résultats
    distinct: ["id"], // Éviter les doublons
  });

  return movies;
};

// Conserver les anciennes fonctions pour rétrocompatibilité si nécessaire
export const getMoviesByTitle = async (search: string): Promise<Movie[]> => {
  return getMoviesByWord(search);
};

export const getMoviesByKeyword = async (search: string): Promise<Movie[]> => {
  return getMoviesByWord(search);
};
