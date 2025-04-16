import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const transactions = await Transaction.find()
    .sort({ date: -1 })
    .populate("category", "name"); // populate category name

  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { amount, date, description, category } = body;

    let categoryId = undefined;

    if (category) {
      // check if category already exists or create one
      let existing = await Category.findOne({ name: category });
      if (!existing) {
        existing = await Category.create({ name: category });
      }
      categoryId = existing._id;
    }

    const transaction = await Transaction.create({
      amount,
      date,
      description,
      category: categoryId,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
