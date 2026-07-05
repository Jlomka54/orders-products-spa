import mongoose from "mongoose";

import Order from "../models/Order.js";
import Product from "../models/Product.js";

const isNumeric = (value) => value !== "" && !Number.isNaN(Number(value));

export const getOrders = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get orders",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    if (mongoose.isValidObjectId(id)) {
      order = await Order.findById(id);
    }

    if (!order && isNumeric(id)) {
      order = await Order.findOne({ legacyId: Number(id) });
    }

    if (!order) {
      if (!mongoose.isValidObjectId(id) && !isNumeric(id)) {
        return res.status(400).json({
          message: "Invalid order id",
        });
      }

      return res.status(404).json({
        message: "Order not found",
      });
    }

    const products =
      order.legacyId === undefined ? [] : await Product.find({ order: order.legacyId });

    return res.json({
      ...order.toObject(),
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get order",
    });
  }
};
