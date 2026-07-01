import Product from "../models/Product.js";

const getDuplicateField = (error) => {
  return Object.keys(error.keyPattern ?? error.keyValue ?? {})[0];
};

export const getProducts = async (req, res) => {
  try {
    const { type, order, isNew } = req.query;
    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (order) {
      filter.order = Number(order);
    }

    if (isNew !== undefined) {
      filter.isNew = isNew === "true" || isNew === "1";
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json(product);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      product,
      message: "Product was created",
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = getDuplicateField(error);

      return res.status(409).json({
        message: duplicateField
          ? `Product with this ${duplicateField} already exists`
          : "Product already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create product",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json({
      product,
      message: "Product was updated",
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = getDuplicateField(error);

      return res.status(409).json({
        message: duplicateField
          ? `Product with this ${duplicateField} already exists`
          : "Product already exists",
      });
    }

    return res.status(400).json({
      message: "Failed to update product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json({
      product,
      message: "Product was deleted",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to delete product",
    });
  }
};
