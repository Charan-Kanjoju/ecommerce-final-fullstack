import { Response } from "express"
import { AuthRequest } from "../types/express"

import {
  addToCartService,
  getCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService
} from "../services/cartService"

export const addToCart = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const { productId, quantity } = req.body

    const item = await addToCartService(
      req.userId!,
      productId,
      quantity
    )

    res.json(item)

  } catch (error) {

    res.status(500).json({
      message: "Failed to add item to cart"
    })

  }

}

export const getCart = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const cart = await getCartService(req.userId!)

    res.json(cart)

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch cart"
    })

  }

}

export const updateCartItem = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const { itemId, quantity } = req.body

    const item = await updateCartItemService(
      itemId,
      quantity
    )

    res.json(item)

  } catch (error) {

    res.status(500).json({
      message: "Failed to update cart item"
    })

  }

}

export const removeCartItem = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const { itemId } = req.body

    await removeCartItemService(itemId)

    res.json({
      message: "Item removed"
    })

  } catch (error) {

    res.status(500).json({
      message: "Failed to remove item"
    })

  }

}

export const clearCart = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    await clearCartService(req.userId!)

    res.json({
      message: "Cart cleared"
    })

  } catch (error) {

    res.status(500).json({
      message: "Failed to clear cart"
    })

  }

}