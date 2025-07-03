import KeywordStatsClientComponent from "./client";
import { getKeywordStats } from "../server-actions/statistics/get-keywords-stats";
import BackButton from "../components/back-button";

export default async function StatisticsPage() {
  const keywordStats = await getKeywordStats();

  return (
    <div className="px-10 py-20">
      <BackButton />
      <h1 className="text-2xl text-rose-900 mb-5 font-medium">Statistiques</h1>
      <KeywordStatsClientComponent keywordStats={keywordStats} />
    </div>
  );
}
