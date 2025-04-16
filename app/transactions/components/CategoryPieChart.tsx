"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  category?: { name: string };
};

type DataPoint = {
  category: string;
  total: number;
};

// ✅ Category-to-color mapping
const CATEGORY_COLORS: { [category: string]: string } = {
  Food: "#d946ef",           // Fuchsia
  Transport: "#0ea5e9",      // Sky Blue
  Bills: "#facc15",          // Yellow
  Shopping: "#34d399",       // Emerald
  Health: "#ef4444",         // Red
  Entertainment: "#a855f7",  // Purple
  Uncategorized: "#9ca3af",  // Gray (fallback)
};

type CategoryPieChartProps = {
  transactions: Transaction[];
};

export default function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  // Calculate total by category
  const categoryData: DataPoint[] = useMemo(() => {
    const totals: { [category: string]: number } = {};

    transactions.forEach((tx) => {
      const category = tx.category?.name || "Uncategorized";
      if (!totals[category]) totals[category] = 0;
      totals[category] += tx.amount;
    });

    return Object.entries(totals).map(([category, total]) => ({
      category,
      total,
    }));
  }, [transactions]);

  return (
    <div className="w-full h-80 mt-8">
      <h2 className="text-xl font-semibold mb-2">Category Breakdown</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="total"
            nameKey="category"
            outerRadius="80%"
            label
            labelLine={false}
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[entry.category] || "#ccc"} // Fallback color
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
