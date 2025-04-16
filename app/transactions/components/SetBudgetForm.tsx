"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .positive("Amount must be positive"),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

type Budget = {
  _id: string;
  category: string;
  amount: number;
  month: string;
};

type Props = {
  month: string;  // This should be passed from the parent component
  addBudget: (budget: Budget) => void;
};

export default function SetBudgetForm({ month, addBudget }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
  });

  const onSubmit = async (data: BudgetFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, month }),  // Pass the month correctly here
      });

      if (!res.ok) throw new Error("Failed to add budget");

      const newBudget: Budget = await res.json();
      addBudget(newBudget);  // Update the budget list immediately
      reset();
    } catch (error) {
      console.error("Error submitting budget:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <input
          {...register("category")}
          className="w-full border px-3 py-2 rounded"
          placeholder="e.g., Groceries"
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Amount</label>
        <input
          type="number"
          {...register("amount", { valueAsNumber: true })}
          className="w-full border px-3 py-2 rounded"
          placeholder="e.g., 5000"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
      </div>

      {/* Month Picker */}
      <div>
        <label className="block mb-1 font-medium">Month</label>
        <input
          type="month"
          value={month}  // Ensure month value is passed from the parent correctly
          disabled  // Disable the month input since the parent controls it
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded w-full"
      >
        {loading ? "Saving..." : "Set Budget"}
      </button>
    </form>
  );
}
