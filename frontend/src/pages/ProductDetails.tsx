import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../api/client";

export default function ProductDetails() {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
  });

  const addToCart = useMutation({
    mutationFn: async () => {
      const res = await api.post("/cart/add", {
        productId: product.id,
        quantity,
      });

      return res.data;
    },

    onSuccess: () => {
      alert("Added to cart");
    },

    onError: (error) => {
      console.error(error);
      alert("Failed to add to cart");
    },
  });

  if (isLoading) return <p>Loading...</p>;

  const product = data;

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-10">
        <img src={product.image} className="w-full rounded-xl" />

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <p className="text-2xl font-semibold mb-4">${product.price}</p>

          <p className="text-sm text-gray-500 mb-6">Stock: {product.stock}</p>

          <div className="flex items-center gap-4 mb-6">
            <button
              className="border px-3 py-1"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              className="border px-3 py-1"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>

          <button
            className="bg-black text-white px-6 py-3 rounded-lg"
            onClick={() => addToCart.mutate()}
            disabled={addToCart.isPending}
          >
            {addToCart.isPending ? "Adding..." : "Add To Cart"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
