import mongoose from "mongoose";

import Order from "../models/Order.js";
import Product from "../models/Product.js";

const isNumeric = (value) => value !== "" && !Number.isNaN(Number(value));

const hasValidOrderIdentifier = (id) =>
  mongoose.isValidObjectId(id) || isNumeric(id);

const getDuplicateField = (error) => {
  return Object.keys(error.keyPattern ?? error.keyValue ?? {})[0];
};

const useOrderIdentifier = async (id, handlers) => {
  let order = null;

  if (mongoose.isValidObjectId(id)) {
    order = await handlers.byId(id);
  }

  if (!order && isNumeric(id)) {
    order = await handlers.byLegacyId(Number(id));
  }

  return order;
};

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

    const order = await useOrderIdentifier(id, {
      byId: (orderId) => Order.findById(orderId),
      byLegacyId: (legacyId) => Order.findOne({ legacyId }),
    });

    if (!order) {
      if (!hasValidOrderIdentifier(id)) {
        return res.status(400).json({
          message: "Invalid order id",
        });
      }

      return res.status(404).json({
        message: "Order not found",
      });
    }

    const orderObject = order.toObject();
    const embeddedProducts = Array.isArray(orderObject.products)
      ? orderObject.products
      : [];
    const productOrderId =
      orderObject.legacyId ?? String(orderObject._id ?? orderObject.id);
    const linkedProducts =
      productOrderId === undefined
        ? []
        : await Product.find({ order: productOrderId });
    const products =
      linkedProducts.length > 0 ? linkedProducts : embeddedProducts;

    return res.json({
      ...orderObject,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get order",
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);

    return res.status(201).json({
      order,
      message: "Order was created",
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = getDuplicateField(error);

      return res.status(409).json({
        message: duplicateField
          ? `Order with this ${duplicateField} already exists`
          : "Order already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create order",
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!hasValidOrderIdentifier(id)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }

    const order = await useOrderIdentifier(id, {
      byId: (orderId) =>
        Order.findByIdAndUpdate(orderId, req.body, {
          new: true,
          runValidators: true,
        }),
      byLegacyId: (legacyId) =>
        Order.findOneAndUpdate({ legacyId }, req.body, {
          new: true,
          runValidators: true,
        }),
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json({
      order,
      message: "Order was updated",
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = getDuplicateField(error);

      return res.status(409).json({
        message: duplicateField
          ? `Order with this ${duplicateField} already exists`
          : "Order already exists",
      });
    }

    return res.status(400).json({
      message: "Failed to update order",
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!hasValidOrderIdentifier(id)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }

    const order = await useOrderIdentifier(id, {
      byId: (orderId) => Order.findByIdAndDelete(orderId),
      byLegacyId: (legacyId) => Order.findOneAndDelete({ legacyId }),
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json({
      order,
      message: "Order was deleted",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to delete order",
    });
  }
};
