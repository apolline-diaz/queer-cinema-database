"use server";

import { cachedQuery } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function searchMovies({
  countryId,
  genreId,
  keywordIds,
  directorId,
  startYear,
  endYear,
  type,
  page = 1,
  limit = 20, // Réduit pour un vrai lazy loading
}: {
  countryId: string;
  genreId: string;
  keywordIds: string[];
  directorId: string;
  startYear: string;
  endYear: string;
  type: string;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  // IMPORTANT: Ne pas mettre en cache avec page/limit pour le lazy loading
  // Ou utiliser une clé de cache différente incluant page et limit
  const cacheKey = [
    "search-movies",
    countryId,
    directorId,
    genreId,
    JSON.stringify(keywordIds),
    startYear,
    endYear,
    type,
    page.toString(), // Inclure la page dans la clé de cache
    limit.toString(), // Inclure la limite dans la clé de cache
  ];

  try {
    // Build date range condition
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

    const whereClause = {
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

    // Compter le total pour la pagination
    const totalCount = await prisma.movies.count({
      where: whereClause,
    });

    // Récupérer les films avec pagination
    const movies = await prisma.movies.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
      orderBy: { created_at: "desc" },
      skip: skip, // UTILISER skip pour la pagination
      take: limit, // UTILISER take pour limiter les résultats
    });

    const mappedMovies = movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      image_url: movie.image_url || "",
      release_date: movie.release_date || "",
    }));

    // Retourner les données avec les métadonnées de pagination
    return {
      movies: mappedMovies,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: skip + movies.length < totalCount,
    };
  } catch (error) {
    console.error("Error searching movies:", error);
    return {
      movies: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      hasMore: false,
    };
  }
}

// Fonction pour la première page (peut être mise en cache)
export async function searchMoviesFirstPage(searchParams: {
  countryId: string;
  genreId: string;
  keywordIds: string[];
  directorId: string;
  startYear: string;
  endYear: string;
  type: string;
}) {
  return cachedQuery(
    [
      "search-movies-first-page",
      searchParams.countryId,
      searchParams.directorId,
      searchParams.genreId,
      JSON.stringify(searchParams.keywordIds),
      searchParams.startYear,
      searchParams.endYear,
      searchParams.type,
    ],
    async () => {
      return searchMovies({ ...searchParams, page: 1, limit: 20 });
    },
    {
      tags: ["movies-search"],
      revalidate: 3600, // 1 hour cache
    }
  );
}

// Garder vos autres fonctions inchangées
export async function getCountries() {
  return cachedQuery(
    ["countries-with-movies"],
    async () => {
      const countries = await prisma.countries.findMany({
        where: {
          movies_countries: {
            some: {},
          },
        },
        orderBy: { name: "asc" },
      });
      return countries.map((country) => ({
        value: country.id.toString(),
        label: country.name,
      }));
    },
    {
      tags: ["countries-with-movies"],
      revalidate: 86400,
    }
  );
}

export async function getGenres() {
  return cachedQuery(
    ["genres"],
    async () => {
      const genres = await prisma.genres.findMany({
        orderBy: { name: "asc" },
        where: { name: { not: null } },
      });
      return genres.map((genre) => ({
        value: genre.id.toString(),
        label: genre.name || "",
      }));
    },
    {
      tags: ["genres"],
      revalidate: 86400,
    }
  );
}

export async function getKeywords() {
  return cachedQuery(
    ["keywords"],
    async () => {
      const keywords = await prisma.keywords.findMany({
        orderBy: { name: "asc" },
        where: { name: { not: null } },
      });
      return keywords.map((keyword) => ({
        value: keyword.id.toString(),
        label: keyword.name || "",
      }));
    },
    {
      tags: ["keywords"],
      revalidate: 86400,
    }
  );
}

export async function getDirectors() {
  return cachedQuery(
    ["directors"],
    async () => {
      const directors = await prisma.directors.findMany({
        orderBy: { name: "asc" },
        where: { name: { not: null } },
      });
      return directors.map((director) => ({
        value: director.id.toString(),
        label: director.name || "",
      }));
    },
    {
      tags: ["directors"],
      revalidate: 86400,
    }
  );
}

export async function getReleaseYears() {
  try {
    const movies = await prisma.movies.findMany({
      select: { release_date: true },
      where: { release_date: { not: null } },
    });

    const years = new Set<string>();
    movies.forEach((movie) => {
      if (movie.release_date) {
        const year = movie.release_date.substring(0, 4);
        if (/^\d{4}$/.test(year)) {
          years.add(year);
        }
      }
    });

    const sortedYears = Array.from(years).sort(
      (a, b) => parseInt(b) - parseInt(a)
    );

    return sortedYears.map((year) => ({
      value: year,
      label: year,
    }));
  } catch (error) {
    console.error("Error fetching release years:", error);
    return [];
  }
}
