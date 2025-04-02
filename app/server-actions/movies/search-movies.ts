"use server";

import { cachedQuery } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function searchMovies({
  countryId,
  genreId,
  keywordIds,
  directorId,
  releaseYear,
}: {
  countryId: string;
  genreId: string;
  keywordIds: string[]; // Array of keyword IDs
  directorId: string;
  releaseYear: string;
}) {
  return cachedQuery(
    [
      "search-movies",
      countryId,
      directorId,
      genreId,
      JSON.stringify(keywordIds),
      releaseYear,
    ],
    async () => {
      try {
        const movies = await prisma.movies.findMany({
          where: {
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
            ...(releaseYear && {
              release_date: { startsWith: releaseYear },
            }),
          },
          select: {
            id: true,
            title: true,
            image_url: true,
            release_date: true,
          },
          orderBy: { created_at: "desc" },
          // take: 150,
        });

        return movies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          image_url: movie.image_url || "",
          release_date: movie.release_date || "",
        }));
      } catch (error) {
        console.error("Error searching movies:", error);
        return [];
      }
    },
    {
      tags: ["movies-search"],
      revalidate: 3600, // 1 hour cache
    }
  );
}

// Similar approach for other query functions
export async function getCountries() {
  return cachedQuery(
    ["countries"],
    async () => {
      const countries = await prisma.countries.findMany({
        orderBy: { name: "asc" },
      });
      return countries.map((country) => ({
        value: country.id.toString(),
        label: country.name,
      }));
    },
    {
      tags: ["countries"],
      revalidate: 86400, // 24 hours cache
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
      revalidate: 86400, // 24 hours cache
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
      revalidate: 86400, // 24 hours cache
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
      revalidate: 86400, // 24 hours cache
    }
  );
}

export async function getReleaseYears() {
  try {
    const movies = await prisma.movies.findMany({
      select: { release_date: true },
      where: { release_date: { not: null } },
    });

    // Extract years from release_date strings
    const years = new Set<string>();
    movies.forEach((movie) => {
      if (movie.release_date) {
        const year = movie.release_date.substring(0, 4);
        if (/^\d{4}$/.test(year)) {
          years.add(year);
        }
      }
    });

    // Convert to array, sort in descending order (newest first)
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
