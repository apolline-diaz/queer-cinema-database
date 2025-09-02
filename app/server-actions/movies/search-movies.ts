"use server";

import { cachedQuery } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SearchParams {
  countryId?: string;
  genreId?: string;
  keywordIds?: string[];
  directorId?: string;
  startYear?: string;
  endYear?: string;
  type?: string;
  page?: number;
  limit?: number;
}

interface SearchResult {
  movies: any[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
}

export async function searchMoviesPaginated({
  countryId = "",
  genreId = "",
  keywordIds = [],
  directorId = "",
  startYear = "",
  endYear = "",
  type = "",
  page = 1,
  limit = 50,
}: SearchParams): Promise<SearchResult> {
  return cachedQuery(
    [
      "search-movies-paginated",
      countryId,
      directorId,
      genreId,
      JSON.stringify(keywordIds),
      startYear,
      endYear,
      type,
      page.toString(),
      limit.toString(),
    ],
    async () => {
      try {
        const skip = (page - 1) * limit;

        // Build date range condition (votre logique existante)
        let releaseCondition = {};

        if (startYear && endYear) {
          releaseCondition = {
            release_date: {
              gte: `${startYear}`,
              lte: `${endYear}-12-31`,
            },
          };
        } else if (startYear) {
          releaseCondition = {
            release_date: {
              gte: `${startYear}`,
            },
          };
        } else if (endYear) {
          releaseCondition = {
            release_date: {
              lte: `${endYear}-12-31`,
            },
          };
        }

        // Construction des conditions WHERE (votre logique existante)
        const whereCondition = {
          ...(countryId && {
            movies_countries: {
              some: { country_id: parseInt(countryId) },
            },
          }),
          ...(genreId && {
            movies_genres: {
              some: { genre_id: BigInt(genreId) },
            },
          }),
          ...(keywordIds.length > 0 && {
            AND: keywordIds.map((id) => ({
              movies_keywords: {
                some: { keyword_id: parseInt(id) },
              },
            })),
          }),
          ...(directorId && {
            movies_directors: {
              some: { director_id: BigInt(directorId) },
            },
          }),
          ...releaseCondition,
          ...(type && {
            type: type,
          }),
        };

        // Requête avec pagination + count total
        const [movies, totalCount] = await Promise.all([
          prisma.movies.findMany({
            where: whereCondition,
            select: {
              id: true,
              title: true,
              image_url: true,
              release_date: true,
            },
            orderBy: { created_at: "desc" },
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
          image_url: movie.image_url || "",
          release_date: movie.release_date || "",
        }));

        return {
          movies: formattedMovies,
          totalCount,
          hasMore,
          currentPage: page,
        };
      } catch (error) {
        console.error("Error searching movies:", error);
        return {
          movies: [],
          totalCount: 0,
          hasMore: false,
          currentPage: page,
        };
      }
    },
    {
      tags: ["movies-search"],
      revalidate: 3600, // 1 hour cache
    }
  );
}
