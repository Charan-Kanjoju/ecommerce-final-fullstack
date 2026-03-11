import express from "express"
import { authMiddleware } from "../middleware/authMiddleware"

import {
  checkout,
  getOrders,
  getOrderById
} from "../controllers/orderController"

const router = express.Router()

router.post("/checkout", authMiddleware, checkout)

router.get("/", authMiddleware, getOrders)

router.get("/:id", authMiddleware, getOrderById)

export default router