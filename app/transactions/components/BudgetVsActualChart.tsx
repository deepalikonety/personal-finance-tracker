import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/app/types/transactions";

// Helper to normalize any category format into a string
const normalizeCategory = (cat: any): string => {
  if (typeof cat === "string") return cat;
  if (typeof cat === "object") return cat.label || cat.name || JSON.stringify(cat);
  return "Uncategorized";
};

type Budget = {
  category: string | { label?: string; name?: string };
  amount: number;
  month: string;
};

type BudgetVsActualChartProps = {
  transactions: Transaction[];
};

export default function BudgetVsActualChart({
  transactions,
}: BudgetVsActualChartProps) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgetVsActual = async () => {
    setLoading(true);
    try {
      const [budgetsRes, transactionsRes] = await Promise.all([
        fetch(`/api/transactions/budget?month=${month}`),
        fetch(`/api/transactions?month=${month}`),
      ]);

      const budgets: Budget[] = await budgetsRes.json();
      const actualMap: Record<string, number> = {};

      // Use the incoming transactions prop to calculate actual spending
      transactions.forEach((tx) => {
        const cat = normalizeCategory(tx.category);
        actualMap[cat] = (actualMap[cat] || 0) + tx.amount;
      });

      // Now, map budgets only if the budget exists for the month
      const chartData = budgets.map((b) => {
        const cat = normalizeCategory(b.category);
        return {
          category: cat,
          budgeted: b.amount,
          actual: actualMap[cat] || 0,
        };
      });

      // Add extra categories (no budget set), only if a category has actual transactions
      for (const [cat, amt] of Object.entries(actualMap)) {
        if (!chartData.find((d) => d.category === cat)) {
          chartData.push({ category: cat, budgeted: 0, actual: amt });
        }
      }

      setData(chartData);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Re-fetch the data whenever the transactions prop changes or month changes
    fetchBudgetVsActual();
  }, [transactions, month]);  // This ensures the chart updates when transactions are added

  return (
    <div className="mt-8 border p-4 rounded-xl shadow-md bg-white max-w-4xl w-full">
      <h2 className="text-xl font-semibold mb-4">Budget vs Actual ({month})</h2>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="mb-4 border px-3 py-2 rounded"
      />

      {loading ? (
        <p>Loading chart...</p>
      ) : data.length === 0 ? (
        <p>No data to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value: any) => `₹${value.toLocaleString("en-IN")}`} />
            <Legend />
            <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
