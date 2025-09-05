"use server";

import { prisma } from "@/lib/prisma";

export const getMoviesToWatch = async (ids: string[]) => {
  try {
    const movies = await prisma.movies.findMany({
      where: { id: { in: ids } },
      include: {
        movies_directors: { include: { directors: true } },
        movies_genres: { include: { genres: true } },
        movies_countries: { include: { countries: true } },
      },
    });

    return movies;
  } catch (error) {
    console.error("Error when fetching movies for TV:", error);
    return [];
  }
};
