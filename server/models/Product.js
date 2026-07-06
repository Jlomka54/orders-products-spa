import mongoose from "mongoose";

const guaranteeSchema = new mongoose.Schema(
  {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const priceSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const productSchema = new mongoose.Schema(
  {
    legacyId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    serialNumber: {
      type: Number,
      required: true,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    photo: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    specification: {
      type: String,
      required: true,
      trim: true,
    },
    guarantee: {
      type: guaranteeSchema,
      required: true,
    },
    price: {
      type: [priceSchema],
      required: true,
      validate: {
        validator: (prices) => Array.isArray(prices) && prices.length > 0,
        message: "At least one price is required",
      },
    },
    order: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  },
);

export default mongoose.model("Product", productSchema);
