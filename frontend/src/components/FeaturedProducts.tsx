import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { api } from "../api/client";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type ProductsResponse = {
  products: Product[];
  nextPage?: number;
};

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products?page=1");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="text-center">Loading products...</div>
      </section>
    );
  }

  const products = data?.products?.slice(0, 8) || [];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">Featured Products</h2>

          <a
            href="/products"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            View All →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
