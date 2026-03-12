import Layout from "../components/Layout";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchProducts, type ProductsResponse } from "../services/product.service";

export default function Landing() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["products", "premium", "", "All", "newest", 0, 2000],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        fetchProducts({
          page: Number(pageParam),
          sort: "newest",
          minPrice: 0,
          maxPrice: 2000,
        }),
      getNextPageParam: (lastPage: ProductsResponse) => lastPage.nextPage ?? undefined,
    });
  }, [queryClient]);

  return (
    <div>
      <Layout>
        <Hero />
        <Categories />
        <FeaturedProducts />
      </Layout>
      <Footer />
    </div>
  );
}
