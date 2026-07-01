import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/Product.js";
import {
  normalizeProductUpdate,
  validateProduct,
} from "../middlewares/validateProduct.js";

const productsRouter = new Router();

// Get products
productsRouter.get("/", getProducts);

// Get product by id
productsRouter.get("/:id", getProductById);

// Create product
productsRouter.post("/", validateProduct, createProduct);

// Update product
productsRouter.put("/:id", normalizeProductUpdate, updateProduct);

// Delete product
productsRouter.delete("/:id", deleteProduct);

export default productsRouter;
