"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description?: string;
  category?: { name: string };
};
type TransactionListProps = {
  transactions: Transaction[];
  onTransactionChange: () => void;
};

export default function TransactionList({
  transactions,
  onTransactionChange,
}: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    amount: 0,
    date: "",
    description: "",
    category: "",
  });


  
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });

    if (res.ok) onTransactionChange();
    
    else console.error("Failed to delete");
  };

  const handleEditClick = (t: Transaction) => {
    setEditingId(t._id);
    setEditForm({
      amount: t.amount,
      date: t.date.slice(0, 10),
      description: t.description || "",
      category: t.category?.name || "",
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id: string) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        amount: Number(editForm.amount),
      }),
    });

    if (res.ok) {
      setEditingId(null);
      onTransactionChange();
    } else console.error("Failed to update");
  };

  return (
    <div className="overflow-x-auto max-w-4xl mx-auto mt-8">
      <table className="w-full text-sm border-collapse bg-white rounded-xl shadow-md">
        <thead className="bg-beige-200 text-brown-800">
          <tr>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="border-t hover:bg-beige-100 transition">
              {editingId === t._id ? (
                <>
                  <td className="p-3">
                    <Input
                      name="amount"
                      type="number"
                      value={editForm.amount}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td className="p-3">
                    <Input name="date" type="date" value={editForm.date} onChange={handleEditChange} />
                  </td>
                  <td className="p-3">
                    <Input
                      name="description"
                      placeholder="Description"
                      value={editForm.description}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      name="category"
                      placeholder="Category"
                      value={editForm.category}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button size="sm" onClick={() => handleEditSubmit(t._id)}>Save</Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-3 font-medium text-brown-700">₹{t.amount.toFixed(2)}</td>
                  <td className="p-3 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="p-3">{t.description}</td>
                  <td className="p-3 text-blue-500">{t.category?.name}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button size="sm" onClick={() => handleEditClick(t)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(t._id)}>Delete</Button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
