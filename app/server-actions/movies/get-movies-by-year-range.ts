"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getMoviesByYearRange(startYear: string, endYear: string) {
  try {
    const movies = await prisma.movies.findMany({
      where: {
        release_date: {
          gte: startYear,
          lte: endYear,
        },
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
        movies_genres: {
          include: {
            genres: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: 15,
    });

    return movies;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue";
    throw new Error(
      `Erreur lors de la récupération des films par année: ${errorMessage}`
    );
  }
}
