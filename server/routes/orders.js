import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../controllers/Order.js";
import {
  normalizeOrderUpdate,
  validateOrder,
} from "../middlewares/validateOrder.js";

const ordersRouter = new Router();

// Get orders
ordersRouter.get("/", getOrders);

// Get order by id
ordersRouter.get("/:id", getOrderById);

// Create order
ordersRouter.post("/", validateOrder, createOrder);

// Update order
ordersRouter.put("/:id", normalizeOrderUpdate, updateOrder);
ordersRouter.patch("/:id", normalizeOrderUpdate, updateOrder);

// Delete order
ordersRouter.delete("/:id", deleteOrder);

export default ordersRouter;
