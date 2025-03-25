"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTopMovies() {
  try {
    const movies = await prisma.movies.findMany({
      where: {
        boost: true,
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        description: true,
        release_date: true,
      },
      take: 2,
    });

    return movies;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error happened";
    throw new Error(`Error when fetching movies: ${errorMessage}`);
  }
}
