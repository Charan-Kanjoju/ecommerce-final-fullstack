import { Request, Response } from "express";
import { AuthRequest } from "../types/express";
import { prisma } from "../lib/prisma";
import {
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../services/productService";

interface ProductParams {
  id: string;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const search = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;
    const sort = (req.query.sort as string | undefined) || "newest";
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

    const limit = 12;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "All") {
      where.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
          ? { price: "desc" as const }
          : { createdAt: "desc" as const };

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.product.count({ where });

    res.json({
      products,
      nextPage: skip + limit < total ? page + 1 : null,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request<ProductParams>, res: Response) => {
  try {
    const product = await getProductByIdService(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch {
    res.status(500).json({
      message: "Product fetch failed",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await createProductService(req.body);

    res.status(201).json(product);
  } catch {
    res.status(500).json({
      message: "Product creation failed",
    });
  }
};

export const updateProduct = async (req: AuthRequest<ProductParams>, res: Response) => {
  try {
    const product = await updateProductService(req.params.id, req.body);

    res.json(product);
  } catch {
    res.status(500).json({
      message: "Product update failed",
    });
  }
};

export const deleteProduct = async (req: AuthRequest<ProductParams>, res: Response) => {
  try {
    await deleteProductService(req.params.id);

    res.json({
      message: "Product deleted successfully",
    });
  } catch {
    res.status(500).json({
      message: "Product deletion failed",
    });
  }
};
