import { NextRequest, NextResponse } from "next/server";
import Budget from "@/models/Budget";
import { dbConnect } from "@/lib/db";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const { category, amount, month } = body;

  try {
    const existingBudget = await Budget.findOne({ category, month });
    if (existingBudget) {
      return NextResponse.json(
        { message: "Budget already set for this category" },
        { status: 400 }
      );
    }

    const budget = new Budget({ category, amount, month });
    await budget.save();

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error saving budget", error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  try {
    const budgets = await Budget.find({ month });
    return NextResponse.json(budgets, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching budgets", error }, { status: 500 });
  }
}
