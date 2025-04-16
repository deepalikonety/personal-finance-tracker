"use client";

import { useEffect, useState } from "react";

type Budget = {
  category: string | { label?: string; name?: string };
  amount: number;
  month: string;
};

type Transaction = {
  category: string | { label?: string; name?: string };
  amount: number;
  date: string;
};

// Normalize category field to plain string
const normalizeCategory = (cat: any): string => {
  if (typeof cat === "string") return cat;
  if (typeof cat === "object") return cat.label || cat.name || JSON.stringify(cat);
  return "Uncategorized";
};

export default function SpendingInsights() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);

    // Fetch only if there's budget or transactions for that month
    const [budgetsRes, transactionsRes] = await Promise.all([
      fetch(`/api/transactions/budget?month=${month}`),
      fetch(`/api/transactions?month=${month}`),
    ]);

    const budgets: Budget[] = await budgetsRes.json();
    const transactions: Transaction[] = await transactionsRes.json();

    // If no budgets or transactions are found for this month, we should reset insights
    if (budgets.length === 0 && transactions.length === 0) {
      setInsights(["ℹ️ No budgets or transactions set for this month."]);
      setLoading(false);
      return;
    }

    const actualMap: Record<string, number> = {};
    transactions.forEach((tx) => {
      const cat = normalizeCategory(tx.category);
      actualMap[cat] = (actualMap[cat] || 0) + tx.amount;
    });

    const newInsights: string[] = [];

    budgets.forEach((b) => {
      const cat = normalizeCategory(b.category);
      const spent = actualMap[cat] || 0;
      const diff = b.amount - spent;

      if (diff < 0) {
        newInsights.push(`⚠️ You overspent ₹${Math.abs(diff).toLocaleString("en-IN")} in ${cat}`);
      } else if (diff === 0) {
        newInsights.push(`✅ You exactly met your budget in ${cat}`);
      } else {
        newInsights.push(`🟢 ₹${diff.toLocaleString("en-IN")} left in ${cat}`);
      }
    });

    // Transactions with no matching budget
    Object.keys(actualMap).forEach((cat) => {
      const hasBudget = budgets.find((b) => normalizeCategory(b.category) === cat);
      if (!hasBudget) {
        newInsights.push(`ℹ️ You spent ₹${actualMap[cat].toLocaleString("en-IN")} in ${cat} with no budget set.`);
      }
    });

    setInsights(newInsights);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, [month]); // Fetch data on month change

  return (
    <div className="mt-8 border p-4 rounded-xl shadow-md bg-white max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Spending Insights ({month})</h2>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border px-3 py-2 rounded"
      />

      {loading ? (
        <p>Analyzing...</p>
      ) : insights.length === 0 ? (
        <p>No insights to show.</p>
      ) : (
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {insights.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
