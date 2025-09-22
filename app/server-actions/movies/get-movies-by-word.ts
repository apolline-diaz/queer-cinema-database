"use server";

import { Movie } from "@/app/types/movie";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMoviesByWord = async (search: string): Promise<Movie[]> => {
  // Map des exceptions
  const exceptions: Record<string, string[]> = {
    trans: ["transféminité", "transmasculinité", "transidentité/transgenre"],
    transgenre: [
      "transféminité",
      "transmasculinité",
      "transidentité/transgenre",
    ],
    transidentité: [
      "transféminité",
      "transmasculinité",
      "transidentité/transgenre",
    ],
    mode: ["mode/fashion"],
    bi: ["bisexualité/pansexualité"],
    bisexuel: ["bisexualité/pansexualité"],
    pansexuel: ["bisexualité/pansexualité"],
    gouine: ["lesbienne"],
    "comédie romantique": ["romance"],
    musical: ["comédie musicale", "musical"],
    "etats unis": ["États-Unis"],
  };

  // Si l'utilisateur tape un mot avec exception, on remplace par les mots-clés correspondants
  const wordsToSearch = exceptions[search.toLowerCase()] || [search];

  // Recherche unifiée avec une seule requête utilisant des jointures
  const movies = await prisma.movies.findMany({
    where: {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { original_title: { contains: search, mode: "insensitive" } },
        { language: { contains: search, mode: "insensitive" } },
        {
          movies_keywords: {
            some: {
              keywords: {
                name: { in: wordsToSearch, mode: "insensitive" },
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
                name: { in: wordsToSearch, mode: "insensitive" },
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      title: true,
      original_title: true,
      image_url: true,
      release_date: true,
      language: true,
    },
    orderBy: {
      release_date: "desc",
    },
  });

  return movies;
};
