import { useInfiniteQuery } from "@tanstack/react-query";
import type { QueryFunctionContext, InfiniteData } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { api } from "../api/client";

// Product type
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

// API response type
type ProductsResponse = {
  products: Product[];
  nextPage?: number;
};

// Properly typed query function
const fetchProductsPage = async ({
  pageParam = 1,
}: QueryFunctionContext<["products"], number>): Promise<ProductsResponse> => {
  const res = await api.get(`/products?page=${pageParam}`);
  return res.data;
};

export default function Products() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<
    ProductsResponse,
    Error,
    InfiniteData<ProductsResponse>,
    ["products"],
    number
  >({
    queryKey: ["products"],
    queryFn: fetchProductsPage,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.products) return undefined;
      return lastPage.nextPage ?? undefined;
    },
    initialPageParam: 1,
  });

  const products = data?.pages?.flatMap((page) => page.products ?? []) ?? [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    const current = loadMoreRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && hasNextPage)
    return (
      <Layout>
        <div className="p-8 text-center text-lg">Loading products...</div>
      </Layout>
    );

  if (isError)
    return (
      <Layout>
        <div className="p-8 text-center text-red-500">{error.message}</div>
      </Layout>
    );

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-16 flex items-center justify-center">
        {isFetchingNextPage && (
          <p className="text-gray-500">Loading more products...</p>
        )}
      </div>
    </Layout>
  );
}
