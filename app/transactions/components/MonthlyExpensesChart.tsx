"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
};

type DataPoint = {
  month: string;
  total: number;
};

type MonthlyExpensesChartProps = {
  transactions: Transaction[];
};

export default function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const monthlyData: DataPoint[] = useMemo(() => {
    const monthlyTotals: { [month: string]: number } = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const month = date.toLocaleString("default", { month: "short", year: "numeric" }); 
      if (!monthlyTotals[month]) monthlyTotals[month] = 0;
      monthlyTotals[month] += tx.amount;
    });
    return Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      total,
    }));
  }, [transactions]);

  return (
    <div className="w-full h-100 mt-8">
      <h2 className="text-xl font-semibold mb-2">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#f59e0b" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
