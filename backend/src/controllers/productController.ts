import { Request, Response } from "express"
import { AuthRequest } from "../types/express"
import { prisma } from "../lib/prisma";
import {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService
} from "../services/productService"

interface ProductParams {
  id: string
}



export const getProducts = async (
  req: Request,
  res: Response
) => {

  const page = Number(req.query.page) || 1
  const limit = 12

  const skip = (page - 1) * limit

  const products = await prisma.product.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc"
    }
  })

  const total = await prisma.product.count()

  res.json({
    products,
    nextPage: skip + limit < total ? page + 1 : null
  })

}
export const getProductById = async (
  req: Request<ProductParams>,
  res: Response
) => {
  try {

    const product = await getProductByIdService(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      })
    }

    res.json(product)

  } catch (error) {

    res.status(500).json({
      message: "Product fetch failed"
    })

  }
}

export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {

    const product = await createProductService(req.body)

    res.status(201).json(product)

  } catch (error) {

    res.status(500).json({
      message: "Product creation failed"
    })

  }
}

export const updateProduct = async (
  req: AuthRequest<ProductParams>,
  res: Response
) => {
  try {

    const product = await updateProductService(
      req.params.id,
      req.body
    )

    res.json(product)

  } catch (error) {

    res.status(500).json({
      message: "Product update failed"
    })

  }
}

export const deleteProduct = async (
  req: AuthRequest<ProductParams>,
  res: Response
) => {
  try {

    await deleteProductService(req.params.id)

    res.json({
      message: "Product deleted successfully"
    })

  } catch (error) {

    res.status(500).json({
      message: "Product deletion failed"
    })

  }
}