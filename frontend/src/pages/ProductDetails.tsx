import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useCartStore } from "../store/useCartStore";

import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export default function ProductDetails() {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          Loading product...
        </div>
      </Layout>
    );
  }

  const product = data;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* PRODUCT IMAGE */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <img src={product.image} className="w-full object-cover rounded-lg" />
        </div>

        {/* PRODUCT DETAILS */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <p className="text-gray-500 text-sm">
              Category: {product.category}
            </p>
          </div>

          {/* PRICE */}
          <div className="text-3xl font-semibold text-black">
            ${product.price}
          </div>

          {/* STOCK */}
          <div>
            {product.stock > 0 ? (
              <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* QUANTITY SELECTOR */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Quantity</span>

            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                className="px-4 py-2 hover:bg-gray-100"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>

              <span className="px-4">{quantity}</span>

              <button
                className="px-4 py-2 hover:bg-gray-100"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* ADD TO CART BUTTON */}
          <button
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
            onClick={async () => {
              await addToCart(product.id, quantity);
              alert("Added to cart 🛒");
            }}
          >
            Add To Cart
          </button>
        </div>
      </div>
    </Layout>
  );
}
