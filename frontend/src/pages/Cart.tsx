import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useCartStore } from "../store/useCartStore";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const { items, fetchCart, removeFromCart } = useCartStore();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchCart();

    const fetchProducts = async () => {
      const res = await api.get("/products?page=1");
      setProducts(res.data.products); // ✅ FIX
    };

    fetchProducts();
  }, []);

  const total =
    items?.reduce((sum: number, item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0) ?? 0;

  if (!items || items?.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added anything yet.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

          {items.map((item: any) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;

            return (
              <div
                key={item.id}
                className="flex gap-6 border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                <img
                  src={product.image}
                  className="w-28 h-28 object-cover rounded-lg"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{product.name}</h2>

                    <p className="text-gray-500 text-sm mt-1">
                      ${product.price}
                    </p>

                    <p className="text-gray-400 text-sm mt-2">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm mt-3 hover:underline w-fit"
                  >
                    Remove
                  </button>
                </div>

                <div className="font-semibold text-lg">
                  ${(product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <div className="border rounded-xl p-6 h-fit shadow-sm bg-white sticky top-24">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600 mb-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="border-t my-4"></div>

          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </Layout>
  );
}
