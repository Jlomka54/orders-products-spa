import { Router } from "express";
import {
  attachProductToGroup,
  removeProductFromGroup,
} from "../controllers/Group.js";

const groupsRouter = new Router();

// Attach existing product to group
groupsRouter.post("/:groupId/products", attachProductToGroup);

// Remove product from group
groupsRouter.delete("/:groupId/products/:productId", removeProductFromGroup);

export default groupsRouter;
