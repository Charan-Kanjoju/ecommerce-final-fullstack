import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useCartStore } from "../store/useCartStore";
import { api } from "../api/client";

export default function Cart() {
  const { items, fetchCart, removeFromCart } = useCartStore();

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchCart();

    const fetchProducts = async () => {
      const res = await api.get("/products");
      setProducts(res.data);
    };

    fetchProducts();
  }, []);

  if (!items || items.length === 0) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p>Your cart is empty</p>
      </Layout>
    );
  }

  const total = items.reduce((sum: number, item: any) => {
    const product = products.find((p) => p.id === item.productId);

    if (!product) return sum;

    return sum + product.price * item.quantity;
  }, 0);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {items.map((item: any) => {
          const product = products.find((p) => p.id === item.productId);

          if (!product) return null;

          return (
            <div
              key={item.id}
              className="flex items-center gap-6 border p-4 rounded-xl"
            >
              <img
                src={product.image}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1">
                <h2 className="font-semibold">{product.name}</h2>

                <p className="text-gray-500">${product.price}</p>

                <p className="text-sm text-gray-400">
                  Quantity: {item.quantity}
                </p>

                <button
                  className="text-red-500 text-sm mt-2"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex justify-between items-center border-t pt-6">
        <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>

        <button className="bg-black text-white px-6 py-3 rounded-lg">
          Checkout
        </button>
      </div>
    </Layout>
  );
}
