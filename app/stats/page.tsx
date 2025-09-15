import BackButton from "../components/back-button";
import { getKeywordStats } from "../server-actions/statistics/get-keywords-stats";
import { getGenreStats } from "../server-actions/statistics/get-genres-stats";
import { getCountryStats } from "../server-actions/statistics/get-countries-stats";
import StatsChart from "././stats-chart";

export default async function StatisticsPage() {
  const [keywordStats, genreStats, countryStats] = await Promise.all([
    getKeywordStats(),
    getGenreStats(),
    getCountryStats(),
  ]);

  return (
    <div className="px-[clamp(1.25rem,5vw,2.5rem)] py-20">
      <BackButton />
      <h1 className="text-2xl text-rose-500 mb-10 font-bold">Statistiques</h1>

      <StatsChart
        data={keywordStats}
        title="Nombre de films par mots-clés les plus fréquents"
      />
      <StatsChart
        data={genreStats}
        title="Nombre de films par genres les plus fréquents"
      />
      <StatsChart
        data={countryStats}
        title="Nombre de films par pays les plus fréquents"
      />
    </div>
  );
}
