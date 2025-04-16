// app/api/transactions/stats/categoryBreakdown/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  // Sample category data (usually fetched from a database)
  const categoryData = [
    { category: "Food", amount: 1200 },
    { category: "Transport", amount: 500 },
    { category: "Entertainment", amount: 300 }
  ];

  return NextResponse.json(categoryData);
}
