import { useState } from "react";
import Layout from "../components/Layout";
import { useCartStore } from "../store/useCartStore";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function Checkout() {
  const { items, fetchCart } = useCartStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    paymentMethod: "COD",
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });

  const total = items.reduce((sum: number, item: any) => {
    const product = products?.find((p: any) => p.id === item.productId);
    if (!product) return sum;

    return sum + product.price * item.quantity;
  }, 0);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    try {
      await api.post("/orders/checkout", form);

      alert("Order placed successfully 🎉");

      await fetchCart();
      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* SHIPPING FORM */}
          <div className="border rounded-xl p-6 shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>

            <div className="space-y-4">
              <input
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Full Name"
                name="fullName"
                onChange={handleChange}
              />

              <input
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Address Line 1"
                name="addressLine1"
                onChange={handleChange}
              />

              <input
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Address Line 2 (optional)"
                name="addressLine2"
                onChange={handleChange}
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="City"
                  name="city"
                  onChange={handleChange}
                />

                <input
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="State"
                  name="state"
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Postal Code"
                  name="postalCode"
                  onChange={handleChange}
                />

                <input
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Country"
                  name="country"
                  onChange={handleChange}
                />
              </div>

              <input
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Phone Number"
                name="phone"
                onChange={handleChange}
              />

              <select
                name="paymentMethod"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                onChange={handleChange}
              >
                <option value="COD">Cash On Delivery</option>
                <option value="CARD">Credit / Debit Card</option>
              </select>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="border rounded-xl p-6 shadow-sm bg-white h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4">
              {items.map((item: any) => {
                const product = products?.find(
                  (p: any) => p.id === item.productId,
                );

                if (!product) return null;

                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        className="w-12 h-12 object-cover rounded"
                      />

                      <div>
                        <p className="text-sm font-medium">{product.name}</p>

                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="font-medium">
                      ${(product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="border-t my-6"></div>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="border-t my-4"></div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-800 transition font-medium"
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
