"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";

interface KeywordStat {
  name: string;
  count: number;
}

interface KeywordStatsClientProps {
  keywordStats: KeywordStat[];
}

export default function KeywordStatsClientComponent({
  keywordStats,
}: KeywordStatsClientProps) {
  const [chartType, setChartType] = useState<"pie" | "bar">("bar");
  const totalMovies = keywordStats.reduce(
    (sum, keyword) => sum + keyword.count,
    0
  );

  const COLORS = [
    "oklch(85% 0.08 10)", // beige pâle
    "oklch(80% 0.07 40)", // pêche clair
    "oklch(78% 0.07 120)", // vert amande
    "oklch(82% 0.06 200)", // bleu ciel doux
    "oklch(87% 0.06 300)", // lavande pâle
    "oklch(84% 0.05 25)", // rose poudré
    "oklch(88% 0.05 85)", // jaune pastel
    "oklch(90% 0.04 180)", // bleu très pâle
  ];

  return (
    <>
      <div className="mb-10 flex xs:flex-col justify-start">
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-4 xs:w-full">
            <button
              onClick={() => setChartType("bar")}
              className={`w-auto text-sm font-light px-4 py-1 border rounded-full transition-colors ${
                chartType === "bar"
                  ? "bg-rose-950 text-white border-rose-900 "
                  : "bg-transparent text-rose-900 border-rose-900 hover:bg-rose-900 hover:text-white"
              }`}
            >
              Diagramme en bâton
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`w-auto text-sm font-light px-4 py-1 border rounded-full transition-colors ${
                chartType === "pie"
                  ? "bg-rose-950 text-white border-rose-900 "
                  : "bg-transparent text-rose-900 border-rose-900 hover:bg-rose-900 hover:text-white"
              }`}
            >
              Diagramme en camembert
            </button>
          </div>
          <h2 className="text-black text-md pt-4">
            Répartition des films par les 10 mots-clés les plus fréquents
          </h2>
        </div>
      </div>

      <div className="rounded-lg my-6">
        <div className="h-96">
          {chartType === "bar" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={keywordStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={90}
                ></XAxis>
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} films`]}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{ color: "black", background: "white" }}
                />

                <Bar
                  dataKey="count"
                  name="Nombre de films"
                  isAnimationActive={true}
                  className="text-black"
                >
                  {keywordStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={keywordStats}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, count, percent }) =>
                    `${name}: ${count} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {keywordStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} films`, "Nombre"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
}
