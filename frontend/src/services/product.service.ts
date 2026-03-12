import { api } from "../api/client";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
};

export type ProductQuery = {
  page?: number;
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc";
};

export type ProductsResponse = {
  products: Product[];
  nextPage: number | null;
};

export const fetchProducts = async (query: ProductQuery) => {
  const params = new URLSearchParams();
  params.set("page", String(query.page || 1));

  if (query.q) params.set("q", query.q);
  if (query.category && query.category !== "All") params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);
  if (typeof query.minPrice === "number") params.set("minPrice", String(query.minPrice));
  if (typeof query.maxPrice === "number") params.set("maxPrice", String(query.maxPrice));

  const response = await api.get(`/products?${params.toString()}`);
  return response.data as ProductsResponse;
};

export const fetchProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data as Product;
};

export const fetchProductsByIds = async (productIds: string[]) => {
  const uniqueIds = Array.from(new Set(productIds));
  const responses = await Promise.all(uniqueIds.map((id) => fetchProductById(id)));
  return responses;
};
