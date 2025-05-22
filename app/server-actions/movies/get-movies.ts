"use server";

import { prisma } from "@/lib/prisma";

export const getMovies = async () => {
  try {
    const movies = await prisma.movies.findMany({
      select: {
        id: true,
        title: true,
        release_date: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return movies;
  } catch (error) {
    console.error("Error when fetching movies :", error);
    return [];
  }
};
