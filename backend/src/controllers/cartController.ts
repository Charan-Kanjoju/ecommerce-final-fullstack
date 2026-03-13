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

    if (!productId || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        message: "Valid productId and quantity are required"
      })
    }

    const item = await addToCartService(
      req.userId!,
      productId,
      Number(quantity)
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

    const parsedQuantity = Number(quantity)

    if (!itemId) {
      return res.status(400).json({
        message: "Valid itemId is required"
      })
    }

    if (Number.isNaN(parsedQuantity)) {
      return res.status(400).json({
        message: "Valid quantity is required"
      })
    }

    if (parsedQuantity <= 0) {
      await removeCartItemService(req.userId!, itemId)

      return res.json({
        message: "Item removed"
      })
    }

    const item = await updateCartItemService(
      req.userId!,
      itemId,
      parsedQuantity
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

    if (!itemId) {
      return res.status(400).json({
        message: "itemId is required"
      })
    }

    await removeCartItemService(req.userId!, itemId)

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
