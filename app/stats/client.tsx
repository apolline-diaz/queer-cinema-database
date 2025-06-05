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

  const COLORS = [
    "oklch(70% 0.25 10)",
    "oklch(60% 0.22 15)",
    "oklch(50% 0.20 20)",
    "oklch(40% 0.18 25)",
    "oklch(65% 0.24 355)",
    "oklch(55% 0.21 5)",
    "oklch(45% 0.19 0)",
    "oklch(35% 0.16 8)",
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
          <h2 className="text-black text-xl pt-4">
            Distribution des films par mot-clé
          </h2>
        </div>
      </div>

      <div className="rounded-lg my-6">
        {/* Distribution des films par mot-clé ({totalMovies} films au total) */}
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
                  height={70}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} films`]}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{ color: "black", background: "white" }}
                />
                <Legend />
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

      {/* <div className="rounded-lg ">
        <h2 className="text-xl text-rose-900 font-semibold mb-4">
          Données brutes
        </h2>
        <div className="text-black overflow-x-auto">
          <table className="min-w-full ">
            <thead>
              <tr>
                <th className="text-rose-900  py-2 border-b border-gray-200 text-left">
                  Mot-clé
                </th>
                <th className="py-2 border-b text-rose-900 border-gray-200 text-right">
                  Nombre de films
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-light">
              {keywordStats.map((stat, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-rose-200" : "bg-red-200"}
                >
                  <td className="py-2 px-4 border-b border-gray-200">
                    {stat.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-right">
                    {stat.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </>
  );
}
