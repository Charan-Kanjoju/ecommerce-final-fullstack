import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { useCartStore } from "../store/useCartStore";
import { api } from "../api/client";
import { fetchProductsByIds } from "../services/product.service";

type CheckoutForm = {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  shippingMethod: "STANDARD" | "EXPRESS";
  paymentMethod: "COD" | "CARD";
};

const initialForm: CheckoutForm = {
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
  shippingMethod: "STANDARD",
  paymentMethod: "COD",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, fetchCart } = useCartStore();
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [error, setError] = useState<string | null>(null);

  const productIds = items.map((item) => item.productId);

  const { data: products } = useQuery({
    queryKey: ["checkout-products", productIds],
    queryFn: () => fetchProductsByIds(productIds),
    enabled: productIds.length > 0,
  });

  const productMap = useMemo(() => {
    const map: Record<string, any> = {};
    (products || []).forEach((product) => {
      map[product.id] = product;
    });
    return map;
  }, [products]);

  const subtotal = items.reduce((sum, item) => {
    const product = productMap[item.productId];
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  const shippingFee = form.shippingMethod === "EXPRESS" ? 12 : 0;
  const total = subtotal + shippingFee;

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        paymentMethod: form.paymentMethod,
      };
      await api.post("/orders/checkout", payload);
    },
    onSuccess: async () => {
      await fetchCart();
      navigate("/orders");
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.fullName || !form.addressLine1 || !form.city || !form.state || !form.postalCode || !form.country || !form.phone) {
      setError("Please complete all required fields.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setError(null);
    await checkoutMutation.mutateAsync();
  };

  return (
    <Layout>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Address</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-xl border border-zinc-200 px-4 py-2.5 md:col-span-2"
                placeholder="Full name"
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              />
              <input
                className="rounded-xl border border-zinc-200 px-4 py-2.5 md:col-span-2"
                placeholder="Address line 1"
                value={form.addressLine1}
                onChange={(event) => setForm((prev) => ({ ...prev, addressLine1: event.target.value }))}
              />
              <input
                className="rounded-xl border border-zinc-200 px-4 py-2.5 md:col-span-2"
                placeholder="Address line 2 (optional)"
                value={form.addressLine2}
                onChange={(event) => setForm((prev) => ({ ...prev, addressLine2: event.target.value }))}
              />
              <input
                className="rounded-xl border border-zinc-200 px-4 py-2.5"
                placeholder="City"
                value={form.city}
                onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              />
              <input
                className="rounded-xl border border-zinc-200 px-4 py-2.5"
                placeholder="State"
                value={form.state}
                onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
              />
              <input
                className="rounded-xl border border-zinc-200 px-4 py-2.5"
                placeholder="Postal code"
                value={form.postalCode}
                onChange={(event) => setForm((prev) => ({ ...prev, postalCode: event.target.value }))}
              />
              <input
                className="rounded-xl border border-zinc-200 px-4 py-2.5"
                placeholder="Country"
                value={form.country}
                onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
              />
              <input
                className="rounded-xl border border-zinc-200 px-4 py-2.5 md:col-span-2"
                placeholder="Phone"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Shipping</h2>
            <div className="space-y-3 text-sm">
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4">
                <span>Standard (3-5 days)</span>
                <input
                  type="radio"
                  name="shipping"
                  checked={form.shippingMethod === "STANDARD"}
                  onChange={() => setForm((prev) => ({ ...prev, shippingMethod: "STANDARD" }))}
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4">
                <span>Express (1-2 days)</span>
                <input
                  type="radio"
                  name="shipping"
                  checked={form.shippingMethod === "EXPRESS"}
                  onChange={() => setForm((prev) => ({ ...prev, shippingMethod: "EXPRESS" }))}
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Payment</h2>
            <div className="space-y-3 text-sm">
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4">
                <span>Cash on delivery</span>
                <input
                  type="radio"
                  name="payment"
                  checked={form.paymentMethod === "COD"}
                  onChange={() => setForm((prev) => ({ ...prev, paymentMethod: "COD" }))}
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4">
                <span>Credit/Debit card</span>
                <input
                  type="radio"
                  name="payment"
                  checked={form.paymentMethod === "CARD"}
                  onChange={() => setForm((prev) => ({ ...prev, paymentMethod: "CARD" }))}
                />
              </label>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => {
              const product = productMap[item.productId];
              if (!product) return null;
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm">{product.name}</p>
                    <p className="text-xs text-zinc-500">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">${(product.price * item.quantity).toFixed(2)}</p>
                </div>
              );
            })}
          </div>
          <div className="my-4 h-px bg-zinc-200" />
          <div className="space-y-2 text-sm text-zinc-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</span>
            </div>
          </div>
          <div className="my-4 h-px bg-zinc-200" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={checkoutMutation.isPending}
            className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checkoutMutation.isPending ? "Placing order..." : "Place order"}
          </button>
        </aside>
      </form>
    </Layout>
  );
}
