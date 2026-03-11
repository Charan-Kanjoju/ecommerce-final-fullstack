import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import ProductSearch from "../components/ProductSearch";
import CategoryFilter from "../components/CategoryFilter";
import Pagination from "../components/Pagination";

import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

import { useState } from "react";

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");

      return res.data;
    },
  });

  let filtered = data || [];

  if (search) {
    filtered = filtered.filter((p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (category !== "all") {
    filtered = filtered.filter((p: any) => p.category === category);
  }

  const pageSize = 8;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const paginatedProducts = filtered.slice(start, end);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <ProductSearch search={search} setSearch={setSearch} />

      <CategoryFilter category={category} setCategory={setCategory} />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>

      <Pagination page={page} setPage={setPage} />
    </Layout>
  );
}
