"use client";

import { useRef, useState, useEffect } from "react";
import TransactionForm from "./transactions/components/TransactionForm";
import DashboardSummaryCards from "./transactions/components/DashboardSummaryCards";
import SetBudgetForm from "./transactions/components/SetBudgetForm";
import BudgetList from "./transactions/components/BudgetList";
import BudgetVsActualChart from "./transactions/components/BudgetVsActualChart";
import SpendingInsights from "./transactions/components/SpendingInsight";
import MonthlyExpensesChart from "./transactions/components/MonthlyExpensesChart";
import CategoryPieChart from "./transactions/components/CategoryPieChart";
import TransactionList from "./transactions/components/TransactionList";
import { Transaction } from "./types/transactions";

type Budget = {
  _id: string;
  category: string;
  amount: number;
  month: string;
};

export default function TransactionsPage() {
  const transactionHistoryRef = useRef<HTMLDivElement>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [budgetMonth, setBudgetMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgetLoading, setBudgetLoading] = useState(true);

 
  useEffect(() => {
    const fetchBudgets = async () => {
      setBudgetLoading(true);
      const res = await fetch(`/api/transactions/budget?month=${budgetMonth}`);
      const data = await res.json();
      setBudgetList(data);
      setBudgetLoading(false);
    };
    fetchBudgets();
  }, [budgetMonth]);

  const addBudget = (newBudget: Budget) => {
    setBudgetList((prev) => [...prev, newBudget]);
  };

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTransactionChange = () => {
    fetchTransactions();
  };
  const handleViewDetailsClick = () => {
    if (transactionHistoryRef.current) {
      transactionHistoryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="p-6 space-y-10 bg-gradient-to-r from-[#F4E1D2] via-[#E2C2D9] to-[#F0D6D1] min-h-screen">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center text-blue-500  drop-shadow-md">
          Personal Finance Visualizer💸
      </h1>

      {/* Add Transaction + Intro */}
      <section className="space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 dark:bg-zinc-900/80 p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl text-center font-semibold text-indigo-700">Add a Transaction👇</h2>
            <TransactionForm onSuccess={handleTransactionChange} />
          </div>
          <div className="bg-white/80 dark:bg-zinc-900/80 p-6 rounded-xl shadow-md space-y-4 ">
            <h3 className="text-2xl text-center font-semibold text-indigo-700">Welcome to Your Finance Tracker😁</h3>
            <p className="text-s text-gray-700 dark:text-gray-300 text-justify">
              Stay on top of your personal finances with ease. Quickly log your daily transactions by
              entering the amount, selecting a category, and adding a short description.
            </p>
            <p className="text-s text-gray-700 dark:text-gray-300 text-justify">
              This will help you visualize your spending habits, track monthly expenses, and stick to your
              budget more effectively.
            </p>
            <p className="text-s text-gray-700 dark:text-gray-300 italic text-justify">
              💡 Pro Tip: Add specific descriptions and categories to get better spending insights!
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="space-y-6 max-w-7xl mx-auto justify-center">
        <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 shadow-lg">
          <h2 className="text-3xl text-center font-semibold text-indigo-700">Overview 🤔</h2>
          <DashboardSummaryCards onViewDetailsClick={handleViewDetailsClick} transactions={transactions} />
        </div>
        <div className="space-y-6 p-6 bg-gradient-to-b from-white to-blue-500 rounded-2xl shadow-2xl border border-black transform transition-all duration-300">
        <div className="text-center ">
          <label className="font-medium text-lg text-gray-700 mr-2">Select Budget Month:</label>
          <input
          type="month"
          value={budgetMonth}
          onChange={(e) => setBudgetMonth(e.target.value)}
          className="border px-3 py-1 rounded shadow-sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Set Budget */}
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-lg">
            <h3 className="text-2xl text-center font-semibold text-indigo-700 mb-2">Set Budget</h3>
            <SetBudgetForm addBudget={addBudget} month={budgetMonth} />
          </div>
          {/* Budget List */}
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-lg">
            <h3 className="text-2xl text-center font-semibold text-indigo-700 mb-2">Your Budgets</h3>
            <BudgetList budgets={budgetList} month={budgetMonth} setMonth={setBudgetMonth} loading={budgetLoading} />
          </div>
        </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-lg">
            <h3 className="text-2xl text-center font-semibold text-indigo-700 mb-2">Budget vs Actual</h3>
            <BudgetVsActualChart transactions={transactions} />
          </div>
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-lg">
            <h3 className="text-2xl text-center font-semibold text-indigo-700 mb-2">Spending Insights</h3>
            <SpendingInsights />
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="space-y-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-b from-white to-blue-500 rounded-xl p-4 shadow-lg">
          <h2 className="text-3xl text-center font-semibold text-indigo-700 mb-6">Visual Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-lg">
              <MonthlyExpensesChart transactions={transactions} />
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-lg">
              <CategoryPieChart transactions={transactions} />
            </div>
          </div>
        </div>
      </section>

      {/* Transaction History */}
      <section className="space-y-4 max-w-7xl mx-auto " ref={transactionHistoryRef}>
        <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-lg">
          <h2 className="text-3xl text-center font-semibold text-indigo-700">Transaction History</h2>
          <TransactionList transactions={transactions} onTransactionChange={handleTransactionChange} />
        </div>
      </section>
    </div>
  );
}
