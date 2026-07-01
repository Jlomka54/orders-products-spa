import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

const products = [
  {
    legacyId: 1,
    serialNumber: 1234,
    isNew: true,
    photo: "pathToFile.jpg",
    title: "Product 1",
    type: "Monitors",
    specification: "Specification 1",
    guarantee: {
      start: "2017-06-29 12:09:33",
      end: "2017-06-29 12:09:33",
    },
    price: [
      { value: 100, symbol: "USD", isDefault: false },
      { value: 2600, symbol: "UAH", isDefault: true },
    ],
    order: 1,
    date: "2017-06-29 12:09:33",
  },
  {
    legacyId: 2,
    serialNumber: 1234,
    isNew: true,
    photo: "pathToFile.jpg",
    title: "Product 1",
    type: "Monitors",
    specification: "Specification 1",
    guarantee: {
      start: "2017-06-29 12:09:33",
      end: "2017-06-29 12:09:33",
    },
    price: [
      { value: 100, symbol: "USD", isDefault: false },
      { value: 2600, symbol: "UAH", isDefault: true },
    ],
    order: 2,
    date: "2017-06-29 12:09:33",
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    const result = await Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { legacyId: product.legacyId },
          update: { $set: product },
          upsert: true,
        },
      })),
    );

    console.log(
      `Products seed completed. Upserted: ${result.upsertedCount}, modified: ${result.modifiedCount}`,
    );
  } catch (error) {
    console.error("Products seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
