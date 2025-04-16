"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const schema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  date: z.string().nonempty("Date is required"), // date is required
  description: z.string().nonempty("Description is required"), // description is required
  category: z.string().nonempty("Category is required"), // category is required
});

type FormData = z.infer<typeof schema>;

type Category = {
  _id: string;
  name: string;
};

type TransactionToEdit = {
  _id: string;
  amount: number;
  date: string;
  description?: string;
  category?: { name: string };
};

export default function TransactionForm({
  transactionToEdit,
  onSuccess,
}: {
  transactionToEdit?: TransactionToEdit;
  onSuccess?: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  useEffect(() => {
    if (transactionToEdit) {
      setValue("amount", transactionToEdit.amount);
      setValue("date", transactionToEdit.date.slice(0, 10));
      setValue("description", transactionToEdit.description || "");
      setValue("category", transactionToEdit.category?.name || "");
    }
  }, [transactionToEdit, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const method = transactionToEdit ? "PUT" : "POST";
      const url = transactionToEdit
        ? `/api/transactions/${transactionToEdit._id}`
        : `/api/transactions`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save transaction");

      reset();
      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xs mx-auto">
  <Input type="number" className="border-slate-500" placeholder="Amount" {...register("amount", { valueAsNumber: true })}  />
  {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}

  <Input className="border-slate-500" type="date" {...register("date")} />
  {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}

  <Input placeholder="Description" className="border-slate-500" {...register("description")} />
  {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

  <select {...register("category")} className="w-full border border-slate-500 rounded p-3 ">
    <option value="">Select category (optional)</option>
    {categories.map((c) => (
      <option key={c._id} value={c.name}>
        {c.name}
      </option>
    ))}
  </select>
  {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}

  <Button type="submit" disabled={loading}>
    {loading ? (transactionToEdit ? "Updating..." : "Adding...") : transactionToEdit ? "Update Transaction" : "Add Transaction"}
  </Button>
</form>

  );
}
