import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductsByIds, type Product } from "../services/product.service";

const PRODUCTS_BY_IDS_STALE_TIME = 60 * 1000;

export const getProductsByIdsQueryKey = (productIds: string[]) =>
  ["products-by-ids", Array.from(new Set(productIds)).sort()] as const;

export const useProductsByIds = (productIds: string[]) => {
  const uniqueProductIds = useMemo(
    () => Array.from(new Set(productIds)),
    [productIds],
  );

  const query = useQuery({
    queryKey: getProductsByIdsQueryKey(uniqueProductIds),
    queryFn: () => fetchProductsByIds(uniqueProductIds),
    enabled: uniqueProductIds.length > 0,
    staleTime: PRODUCTS_BY_IDS_STALE_TIME,
  });

  const productMap = useMemo(() => {
    const map: Record<string, Product> = {};
    (query.data || []).forEach((product) => {
      map[product.id] = product;
    });
    return map;
  }, [query.data]);

  const orderedProducts = useMemo(
    () => productIds.map((id) => productMap[id]).filter(Boolean),
    [productIds, productMap],
  );

  return {
    ...query,
    productMap,
    orderedProducts,
  };
};
