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
  const movies = await prisma.$queryRaw<Movie[]>`
    SELECT DISTINCT m.id, m.title, m.image_url, m.release_date
    FROM movies m
    LEFT JOIN movies_keywords mk ON m.id = mk.movie_id
    LEFT JOIN keywords k ON mk.keyword_id = k.id
    LEFT JOIN movies_directors md ON m.id = md.movie_id
    LEFT JOIN directors d ON md.director_id = d.id
    LEFT JOIN movies_countries mc ON m.id = mc.movie_id
    LEFT JOIN countries c ON mc.country_id = c.id
    LEFT JOIN movies_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE 
      m.title ILIKE ${`%${search}%`} OR
      m.description ILIKE ${`%${search}%`} OR
      k.name ILIKE ${`%${search}%`} OR
      d.name ILIKE ${`%${search}%`} OR
      c.name ILIKE ${`%${search}%`} OR
      g.name ILIKE ${`%${search}%`}
    LIMIT 50
  `;

  return movies;
};

// Conserver les anciennes fonctions pour rétrocompatibilité si nécessaire
export const getMoviesByTitle = async (search: string): Promise<Movie[]> => {
  return getMoviesByWord(search);
};

export const getMoviesByKeyword = async (search: string): Promise<Movie[]> => {
  return getMoviesByWord(search);
};
