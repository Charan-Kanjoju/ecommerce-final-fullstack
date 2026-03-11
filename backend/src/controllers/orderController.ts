import { Response } from "express"
import { AuthRequest } from "../types/express"

import {
  checkoutService,
  getOrdersService,
  getOrderByIdService
} from "../services/orderService"

export const checkout = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const order = await checkoutService(req.userId!)

    res.json(order)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }

}

export const getOrders = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const orders = await getOrdersService(req.userId!)

    res.json(orders)

  } catch {

    res.status(500).json({
      message: "Failed to fetch orders"
    })

  }

}

export const getOrderById = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const order = await getOrderByIdService(
      req.userId!,
      req.params.id
    )

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    res.json(order)

  } catch {

    res.status(500).json({
      message: "Failed to fetch order"
    })

  }

}