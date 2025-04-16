import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/Transaction";
import Category from "@/models/Category";
import { dbConnect } from "@/lib/db";

export async function PUT(
  request: NextRequest,

  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;
  const body = await request.json();
  const { amount, date, description, category } = body;
  
  try {
    let categoryId;
    if (category) {
      let cat = await Category.findOne({ name: category });
      if (!cat) {
        cat = await Category.create({ name: category });
      }
      categoryId = cat._id;
    }
    
    const updated = await Transaction.findByIdAndUpdate(
      id,
      {
        amount,
        date,
        description,
        category: categoryId,
      },
      { new: true }
    );
    
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;
  
  try {
    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}