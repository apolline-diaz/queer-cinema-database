"use server";

import { Movie } from "@/app/types/movie";
import { cachedQuery } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SearchByWordParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface SearchResult {
  movies: Movie[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
}

export async function searchMoviesByWordPaginated({
  search = "",
  page = 1,
  limit = 20,
}: SearchByWordParams): Promise<SearchResult> {
  return cachedQuery(
    [
      "search-movies-by-word-paginated",
      search.trim(),
      page.toString(),
      limit.toString(),
    ],
    async () => {
      try {
        const skip = (page - 1) * limit;
        const searchTerm = search.trim();

        // Construction de la condition WHERE
        let whereCondition = {};

        if (searchTerm === "") {
          // Si la recherche est vide, pas de condition WHERE (tous les films)
          whereCondition = {};
        } else {
          // Recherche unifiée avec une seule requête utilisant des jointures
          whereCondition = {
            OR: [
              { title: { contains: searchTerm, mode: "insensitive" } },
              { original_title: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
              { language: { contains: searchTerm, mode: "insensitive" } },
              {
                movies_keywords: {
                  some: {
                    keywords: {
                      name: { contains: searchTerm, mode: "insensitive" },
                    },
                  },
                },
              },
              {
                movies_directors: {
                  some: {
                    directors: {
                      name: { contains: searchTerm, mode: "insensitive" },
                    },
                  },
                },
              },
              {
                movies_countries: {
                  some: {
                    countries: {
                      name: { contains: searchTerm, mode: "insensitive" },
                    },
                  },
                },
              },
              {
                movies_genres: {
                  some: {
                    genres: {
                      name: { contains: searchTerm, mode: "insensitive" },
                    },
                  },
                },
              },
            ],
          };
        }

        // Requête avec pagination + count total
        const [movies, totalCount] = await Promise.all([
          prisma.movies.findMany({
            where: whereCondition,
            select: {
              id: true,
              title: true,
              original_title: true,
              image_url: true,
              release_date: true,
              language: true,
            },
            orderBy: {
              created_at: "desc",
            },
            skip,
            take: limit,
          }),
          prisma.movies.count({
            where: whereCondition,
          }),
        ]);

        const hasMore = skip + movies.length < totalCount;

        const formattedMovies = movies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          original_title: movie.original_title,
          image_url: movie.image_url || "",
          release_date: movie.release_date || "",
          language: movie.language,
        }));

        return {
          movies: formattedMovies,
          totalCount,
          hasMore,
          currentPage: page,
        };
      } catch (error) {
        console.error("Error searching movies by word:", error);
        return {
          movies: [],
          totalCount: 0,
          hasMore: false,
          currentPage: page,
        };
      }
    },
    {
      tags: ["movies-search-word"],
      revalidate: 3600, // 1 hour cache
    }
  );
}

// Garder votre fonction originale pour la compatibilité
export const getMoviesByWord = async (search: string): Promise<Movie[]> => {
  // Si la recherche est vide, retourner les films récents
  if (search.trim() === "") {
    const movies = await prisma.movies.findMany({
      select: {
        id: true,
        title: true,
        original_title: true,
        image_url: true,
        release_date: true,
        language: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return movies;
  }

  // Recherche unifiée avec une seule requête utilisant des jointures
  const movies = await prisma.movies.findMany({
    where: {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { original_title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { language: { contains: search, mode: "insensitive" } },
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
      original_title: true,
      image_url: true,
      release_date: true,
      language: true,
    },
  });

  return movies;
};
