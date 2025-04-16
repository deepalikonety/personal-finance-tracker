// models/Category.ts
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String },
});

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
