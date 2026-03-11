import express from "express"
import { authMiddleware } from "../middleware/authMiddleware"

import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/cartController"

const router = express.Router()

router.post("/add", authMiddleware, addToCart)

router.get("/", authMiddleware, getCart)

router.put("/update", authMiddleware, updateCartItem)

router.delete("/remove", authMiddleware, removeCartItem)

router.delete("/clear", authMiddleware, clearCart)

export default router