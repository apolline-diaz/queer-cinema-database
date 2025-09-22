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

interface Stat {
  name: string;
  count: number;
}

interface StatsChartProps {
  data: Stat[];
  title: string;
}

export default function StatsChart({ data, title }: StatsChartProps) {
  const [chartType, setChartType] = useState<"pie" | "bar">("bar");

  const COLORS = [
    "oklch(85% 0.08 10)",
    "oklch(83% 0.08 30)",
    "oklch(81% 0.07 50)",
    "oklch(79% 0.07 70)",
    "oklch(77% 0.07 90)",
    "oklch(82% 0.06 110)",
    "oklch(84% 0.06 130)",
    "oklch(86% 0.05 150)",
    "oklch(88% 0.05 170)",
    "oklch(90% 0.04 190)",
    "oklch(87% 0.05 210)",
    "oklch(85% 0.06 230)",
    "oklch(83% 0.07 250)",
    "oklch(81% 0.08 270)",
    "oklch(79% 0.09 290)",
  ];

  return (
    <>
      <div className="mb-5 flex xs:flex-col justify-start">
        <div className="flex flex-col">
          <h2 className="text-black text-xl font-semibold mb-5">{title}</h2>
          <div className="flex flex-wrap gap-4 xs:w-full">
            <button
              onClick={() => setChartType("bar")}
              className={`w-auto text-sm font-light px-4 py-1 border rounded-full transition-colors ${
                chartType === "bar"
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-transparent text-rose-500 border-rose-500 hover:bg-rose-500 hover:text-white"
              }`}
            >
              Diagramme en barres
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`w-auto text-sm font-light px-4 py-1 border rounded-full transition-colors ${
                chartType === "pie"
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-transparent text-rose-500 border-rose-500 hover:bg-rose-500 hover:text-white"
              }`}
            >
              Diagramme circulaire
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg mb-10">
        <div className="h-96">
          {chartType === "bar" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={90}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value} films`]}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{ color: "black", background: "white" }}
                />
                <Bar dataKey="count" name="Nombre de films">
                  {data.map((entry, index) => (
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
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="count"
                  nameKey="name"
                  // label={({ name, count, percent }) =>
                  //   `${name}: ${count} (${(percent * 100).toFixed(0)}%)`
                  // }
                  label={({ count, percent }) =>
                    `${count} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} films`, "Nombre"]} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
}
