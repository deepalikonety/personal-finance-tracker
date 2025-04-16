import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  // Total Expenses
  const totalExpenses = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  // Recent Transactions
  const recentTransactions = await Transaction.find()
    .sort({ date: -1 })
    .limit(5)
    .select("amount description date category");

  return NextResponse.json({
    totalExpenses: totalExpenses[0]?.total || 0,
    recentTransactions,
  });
}
