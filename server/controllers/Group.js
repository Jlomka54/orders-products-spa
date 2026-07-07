import mongoose from "mongoose";

import Order from "../models/Order.js";
import Product from "../models/Product.js";

const isNumeric = (value) => value !== "" && !Number.isNaN(Number(value));

const hasValidIdentifier = (id) =>
  mongoose.isValidObjectId(id) || isNumeric(id);

const findOrderByIdentifier = async (id) => {
  let order = null;

  if (mongoose.isValidObjectId(id)) {
    order = await Order.findById(id);
  }

  if (!order && isNumeric(id)) {
    order = await Order.findOne({ legacyId: Number(id) });
  }

  return order;
};

const findProductByIdentifier = async (id) => {
  let product = null;

  if (mongoose.isValidObjectId(id)) {
    product = await Product.findById(id);
  }

  if (!product && isNumeric(id)) {
    product = await Product.findOne({ legacyId: Number(id) });
  }

  return product;
};

const getGroupProductLinkId = (group) => {
  const groupObject = group.toObject ? group.toObject() : group;

  return groupObject.legacyId ?? String(groupObject._id ?? groupObject.id);
};

const getGroupWithProducts = async (group) => {
  const groupObject = group.toObject();
  const productLinkId = getGroupProductLinkId(groupObject);
  const products = await Product.find({ order: productLinkId }).sort({
    createdAt: -1,
  });

  return {
    ...groupObject,
    products,
  };
};

export const attachProductToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { productId } = req.body ?? {};

    if (!hasValidIdentifier(groupId)) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    const group = await findOrderByIdentifier(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    if (!productId || !hasValidIdentifier(productId)) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const product = await findProductByIdentifier(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const groupProductLinkId = getGroupProductLinkId(group);

    if (String(product.order) === String(groupProductLinkId)) {
      return res.status(409).json({
        message: "Product is already in this group",
      });
    }

    product.order = groupProductLinkId;
    await product.save();

    return res.json({
      group: await getGroupWithProducts(group),
      message: "Product was added to group",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add product to group",
    });
  }
};

export const removeProductFromGroup = async (req, res) => {
  try {
    const { groupId, productId } = req.params;

    if (!hasValidIdentifier(groupId)) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    const group = await findOrderByIdentifier(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    if (!productId || !hasValidIdentifier(productId)) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const product = await findProductByIdentifier(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const groupProductLinkId = getGroupProductLinkId(group);

    if (String(product.order) === String(groupProductLinkId)) {
      product.order = null;
      await product.save();
    }

    return res.json({
      group: await getGroupWithProducts(group),
      message: "Product was removed from group",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove product from group",
    });
  }
};
