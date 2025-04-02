"use server";

import { PrismaClient } from "@prisma/client";

interface KeywordStat {
  name: string;
  count: number;
}

export async function getKeywordStats(
  limit: number = 20
): Promise<KeywordStat[]> {
  const prisma = new PrismaClient();

  try {
    // get stats of keywords with number of movies
    const keywordStats = await prisma.$queryRaw<KeywordStat[]>`
      SELECT k.name, COUNT(mk.movie_id) as count
      FROM keywords k
      JOIN movies_keywords mk ON k.id = mk.keyword_id
      GROUP BY k.name
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    return keywordStats.map((stat) => ({
      name: stat.name || "Sans nom",
      count: Number(stat.count),
    }));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques de mots-clés:",
      error
    );
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
