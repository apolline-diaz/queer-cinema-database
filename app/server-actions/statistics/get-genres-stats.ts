"use server";

import { PrismaClient } from "@prisma/client";

interface GenreStat {
  name: string;
  count: number;
}

export async function getGenreStats(limit: number = 13): Promise<GenreStat[]> {
  const prisma = new PrismaClient();

  try {
    const genreStats = await prisma.$queryRaw<GenreStat[]>`
      SELECT g.name, COUNT(mg.movie_id) as count
      FROM genres g
      JOIN movies_genres mg ON g.id = mg.genre_id
      GROUP BY g.name
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    return genreStats.map((stat) => ({
      name: stat.name || "Sans nom",
      count: Number(stat.count),
    }));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques de genres:",
      error
    );
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
