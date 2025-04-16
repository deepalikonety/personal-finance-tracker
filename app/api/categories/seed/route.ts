import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const defaultCategories = [
    { name: "Food", color: "#f87171" },
    { name: "Transport", color: "#60a5fa" },
    { name: "Bills", color: "#facc15" },
    { name: "Shopping", color: "#a78bfa" },
    { name: "Health", color: "#34d399" },
    { name: "Entertainment", color: "#fb923c" },
  ];

  for (const cat of defaultCategories) {
    const exists = await Category.findOne({ name: cat.name });
    if (!exists) {
      await Category.create(cat);
    }
  }

  return NextResponse.json({ success: true, message: "Categories seeded" });
}
