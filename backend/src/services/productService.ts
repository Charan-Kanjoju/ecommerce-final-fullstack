import { prisma } from "../lib/prisma"

export const getProductsService = async (
  search?: string,
  category?: string,
  page: number = 1,
  limit: number = 10
) => {

  const skip = (page - 1) * limit

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive"
      },
      category: category || undefined
    },
    skip,
    take: limit
  })

  return products
}

export const getProductByIdService = async (id: string) => {

  const product = await prisma.product.findUnique({
    where: { id }
  })

  return product
}

export const createProductService = async (data: any) => {

  const product = await prisma.product.create({
    data
  })

  return product
}

export const updateProductService = async (
  id: string,
  data: any
) => {

  const product = await prisma.product.update({
    where: { id },
    data
  })

  return product
}

export const deleteProductService = async (id: string) => {

  const product = await prisma.product.delete({
    where: { id }
  })

  return product
}