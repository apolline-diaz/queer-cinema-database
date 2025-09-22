"use server";

import { PrismaClient } from "@prisma/client";

interface CountryStat {
  name: string;
  count: number;
}

export async function getCountryStats(
  limit: number = 15
): Promise<CountryStat[]> {
  const prisma = new PrismaClient();

  try {
    const countryStats = await prisma.$queryRaw<CountryStat[]>`
      SELECT c.name, COUNT(mc.movie_id) as count
      FROM countries c
      JOIN movies_countries mc ON c.id = mc.country_id
      GROUP BY c.name
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    return countryStats.map((stat) => ({
      name: stat.name || "Sans nom",
      count: Number(stat.count),
    }));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques de pays:",
      error
    );
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
