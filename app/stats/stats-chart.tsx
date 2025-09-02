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
    "oklch(80% 0.07 40)",
    "oklch(78% 0.07 120)",
    "oklch(82% 0.06 200)",
    "oklch(87% 0.06 300)",
    "oklch(84% 0.05 25)",
    "oklch(88% 0.05 85)",
    "oklch(90% 0.04 180)",
  ];

  return (
    <>
      <div className="mb-10 flex xs:flex-col justify-start">
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

      <div className="rounded-lg my-6">
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
                />
                <YAxis />
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
                  label={({ name, count, percent }) =>
                    `${name}: ${count} (${(percent * 100).toFixed(0)}%)`
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
}
