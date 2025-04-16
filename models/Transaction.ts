import mongoose, { Document, Schema } from "mongoose";

// Category interface to match the category schema
interface Category {
  name: string;
}

interface Transaction extends Document {
  amount: number;
  date: Date;
  description: string;
  category: Category;
}

const TransactionSchema: Schema<Transaction> = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
});

// Export the Transaction model
export default mongoose.models.Transaction ||
  mongoose.model<Transaction>("Transaction", TransactionSchema);
