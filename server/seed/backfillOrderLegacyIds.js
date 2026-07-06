import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Order from "../models/Order.js";

dotenv.config();

// One-off fix for orders created before order/legacyId auto-assignment
// was added. Without a legacyId, products can never be linked to (or
// deleted from) an order, since Product.order always stores a number.
const backfillOrderLegacyIds = async () => {
  try {
    await connectDB();

    const ordersWithoutLegacyId = await Order.find({
      $or: [{ legacyId: { $exists: false } }, { legacyId: null }],
    }).sort({ createdAt: 1 });

    const lastOrder = await Order.findOne({ legacyId: { $ne: null } })
      .sort({ legacyId: -1 })
      .select("legacyId")
      .lean();

    let nextLegacyId = (lastOrder?.legacyId ?? 0) + 1;

    for (const order of ordersWithoutLegacyId) {
      order.legacyId = nextLegacyId;
      await order.save();
      console.log(`Order ${order._id} -> legacyId ${nextLegacyId}`);
      nextLegacyId += 1;
    }

    console.log(`Done. Updated ${ordersWithoutLegacyId.length} order(s).`);
  } catch (error) {
    console.error("Backfill failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

backfillOrderLegacyIds();
