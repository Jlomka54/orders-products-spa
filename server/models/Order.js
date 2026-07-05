import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    legacyId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
