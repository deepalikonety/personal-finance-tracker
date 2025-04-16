"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Transaction } from "@/app/types/transactions";

type DashboardSummaryCardsProps = {
  onViewDetailsClick: () => void;
  transactions: Transaction[]; // <-- now passed as prop
};

export default function DashboardSummaryCards({
  onViewDetailsClick,
  transactions,
}: DashboardSummaryCardsProps) {
  const [showAll, setShowAll] = useState(false);
  const month = "2025-04"; // You can later make this dynamic

  const { totalExpenses, recentTransactions } = useMemo(() => {
    const filtered = transactions.filter(
      (tx) => tx.date.slice(0, 7) === month
    );
    const total = filtered.reduce((sum, tx) => sum + tx.amount, 0);
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return {
      totalExpenses: total,
      recentTransactions: sorted,
    };
  }, [transactions, month]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 ">
      {/* Total Expenses Card */}
      <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Total Expenses</h2>
        <p className="text-2xl">{formatCurrency(totalExpenses)}</p>
        <button
          className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg"
          onClick={onViewDetailsClick}
        >
          View Details
        </button>
      </div>

      {/* Recent Transactions Card */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <ul className="space-y-2">
          {recentTransactions
            .slice(0, showAll ? recentTransactions.length : 4)
            .map((tx) => (
              <li key={tx._id} className="flex justify-between text-gray-700">
                <span>{tx.description}</span>
                <span>{formatCurrency(tx.amount)}</span>
              </li>
            ))}
        </ul>
        <button
          className="mt-4 px-4 py-2 bg-white text-gray-700 rounded-lg"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>
    </div>
  );
}
