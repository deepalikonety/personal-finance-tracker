// /models/Budget.ts
import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String, // Store the month as a string, e.g., "2025-04"
      required: true,
    },
  },
  { timestamps: true }
);

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

export default Budget;
