import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/product.service";

export const HOMEPAGE_PRODUCTS_QUERY_KEY = [
  "products",
  "homepage",
  "newest",
] as const;

export const useHomepageProducts = () =>
  useQuery({
    queryKey: HOMEPAGE_PRODUCTS_QUERY_KEY,
    queryFn: () => fetchProducts({ page: 1, sort: "newest" }),
    staleTime: 60 * 1000,
  });
