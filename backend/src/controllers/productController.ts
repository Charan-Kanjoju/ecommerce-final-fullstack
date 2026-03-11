import { Request, Response } from "express"
import { AuthRequest } from "../types/express"
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
  try {

    const { search, category, page, limit } = req.query

    const products = await getProductsService(
      search as string,
      category as string,
      Number(page) || 1,
      Number(limit) || 10
    )

    res.json(products)

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch products"
    })

  }
}

export const getProductById = async (
  req: Request<ProductParams>,
  res: Response
) => {
  try {

    const product = await getProductByIdService(
      req.params.id
    )

    res.json(product)

  } catch (error) {

    res.status(500).json({
      message: "Product not found"
    })

  }
}

export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {

    const product = await createProductService(
      req.body
    )

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