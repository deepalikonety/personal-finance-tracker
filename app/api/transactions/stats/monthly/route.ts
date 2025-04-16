import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  // Group by month and sum
  const monthly = await Transaction.aggregate([
    {
      $group: {
        _id: { $substr: ["$date", 0, 7] }, // "YYYY-MM"
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return NextResponse.json(
    monthly.map((m) => ({
      month: m._id,
      total: m.total,
    }))
  );
}
