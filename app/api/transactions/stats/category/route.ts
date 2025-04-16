import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  // Aggregate by category
  const categoryStats = await Transaction.aggregate([
    {
      $lookup: {
        from: "categories", // Category collection
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" }, // Flatten the category array
    {
      $group: {
        _id: "$categoryDetails.name", // Group by category name
        total: { $sum: "$amount" },
      },
    },
    { $sort: { total: -1 } },
  ]);

  return NextResponse.json(
    categoryStats.map((stat) => ({
      category: stat._id,
      total: stat.total,
    }))
  );
}
