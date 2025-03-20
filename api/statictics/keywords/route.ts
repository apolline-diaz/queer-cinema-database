// app/api/statistics/keywords/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Interface pour nos données
interface KeywordStat {
  name: string;
  count: number;
}

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();

  try {
    // Récupérer les paramètres de requête (optionnel)
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");

    // Récupérer les statistiques des mots-clés avec le nombre de films
    const keywordStats = await prisma.$queryRaw<KeywordStat[]>`
      SELECT k.name, COUNT(mk.movie_id) as count
      FROM keywords k
      JOIN movie_keywords mk ON k.id = mk.keyword_id
      GROUP BY k.name
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    const formattedStats = keywordStats.map((stat) => ({
      name: stat.name || "Sans nom",
      count: Number(stat.count),
    }));

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques de mots-clés:",
      error
    );
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des données" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
