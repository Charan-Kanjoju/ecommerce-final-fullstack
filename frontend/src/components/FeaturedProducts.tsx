import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { api } from "../api/client";

export default function FeaturedProducts() {
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.slice(0, 8).map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </section>
  );
}
