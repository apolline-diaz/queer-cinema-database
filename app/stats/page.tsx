import { PrismaClient } from "@prisma/client";
import KeywordStatsClientComponent from "./client";

interface KeywordStat {
  name: string;
  count: number;
}

// Action serveur pour récupérer les données
async function getKeywordStats(): Promise<KeywordStat[]> {
  const prisma = new PrismaClient();

  try {
    // Récupérer les statistiques des mots-clés avec le nombre de films
    const keywordStats = await prisma.$queryRaw<KeywordStat[]>`
      SELECT k.name, COUNT(mk.movie_id) as count
      FROM keywords k
      JOIN movie_keywords mk ON k.id = mk.keyword_id
      GROUP BY k.name
      ORDER BY count DESC
      LIMIT 20
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

export default async function StatisticsPage() {
  // Récupérer les données côté serveur
  const keywordStats = await getKeywordStats();

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl text-rose-500 font-medium mb-5">
        Statistiques des films par mot-clé
      </h1>

      {/* Passer les données au composant client pour le rendu des graphiques */}
      <KeywordStatsClientComponent keywordStats={keywordStats} />
    </div>
  );
}
