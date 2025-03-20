import KeywordStatsClientComponent from "./client";
import { getKeywordStats } from "../server-actions/statistics/get-keywords-stats";

export default async function StatisticsPage() {
  const keywordStats = await getKeywordStats();

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl text-rose-500 font-medium mb-5">
        Statistiques des films par mot-clé
      </h1>

      <KeywordStatsClientComponent keywordStats={keywordStats} />
    </div>
  );
}
