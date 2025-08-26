"use server";

import { PrismaClient } from "@prisma/client";

export async function getReleaseYears() {
  const prisma = new PrismaClient();

  try {
    // Récupérer toutes les dates distinctes
    const movies = await prisma.movies.findMany({
      where: {
        release_date: {
          not: null,
        },
      },
      select: {
        release_date: true,
      },
      distinct: ["release_date"],
    });

    // Extraire juste l'année (les 4 premiers caractères)
    const years = movies
      .map((m) => m.release_date?.substring(0, 4)) // "2023-05-12" -> "2023"
      .filter((y): y is string => !!y);

    // Supprimer les doublons et trier décroissant
    const uniqueYears = Array.from(new Set(years)).sort(
      (a, b) => parseInt(b) - parseInt(a)
    );

    return uniqueYears;
  } catch (error) {
    console.error("Error fetching release years:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
