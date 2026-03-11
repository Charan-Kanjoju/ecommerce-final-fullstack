import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

import { authMiddleware } from "../middleware/authMiddleware";

interface ProductParams {
  id: string;
}

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", authMiddleware, createProduct);

router.put<ProductParams>("/:id", authMiddleware, updateProduct);

router.delete<ProductParams>("/:id", authMiddleware, deleteProduct);

export default router;