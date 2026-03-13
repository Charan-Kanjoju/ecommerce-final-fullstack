import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { useCartStore } from "../store/useCartStore";
import { api } from "../api/client";
import { fetchProductsByIds } from "../services/product.service";
import { getApiErrorMessage } from "../lib/api-error";

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

type FieldErrors = Partial<Record<keyof CheckoutForm, string>>;

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

const sanitizeForm = (form: CheckoutForm): CheckoutForm => ({
  ...form,
  fullName: form.fullName.trim(),
  addressLine1: form.addressLine1.trim(),
  addressLine2: form.addressLine2.trim(),
  city: form.city.trim(),
  state: form.state.trim(),
  postalCode: form.postalCode.trim(),
  country: form.country.trim(),
  phone: form.phone.trim(),
});

const validateCheckoutForm = (rawForm: CheckoutForm) => {
  const form = sanitizeForm(rawForm);
  const errors: FieldErrors = {};

  if (!form.fullName) errors.fullName = "Full name is required.";
  else if (form.fullName.length < 2) errors.fullName = "Full name must be at least 2 characters.";

  if (!form.addressLine1) errors.addressLine1 = "Address line 1 is required.";
  if (!form.city) errors.city = "City is required.";
  if (!form.state) errors.state = "State is required.";
  if (!form.country) errors.country = "Country is required.";

  if (!form.postalCode) {
    errors.postalCode = "Postal code is required.";
  } else if (!/^[a-zA-Z0-9\s-]{3,12}$/.test(form.postalCode)) {
    errors.postalCode = "Use 3 to 12 letters, numbers, spaces, or hyphens.";
  }

  if (!form.phone) {
    errors.phone = "Phone number is required.";
  } else if (!/^[0-9+\s()-]{7,20}$/.test(form.phone)) {
    errors.phone = "Use 7 to 20 digits or phone symbols.";
  }

  return {
    form,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, fetchCart } = useCartStore();
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
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
    mutationFn: async (payload: CheckoutForm) => {
      await api.post("/orders/checkout", payload, {
        skipErrorToast: true,
      } as any);
    },
    onSuccess: async () => {
      await fetchCart();
      navigate("/orders");
    },
    onError: (mutationError) => {
      setError(getApiErrorMessage(mutationError, "Failed to place order."));
    },
  });

  const updateField = <K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const validation = validateCheckoutForm(form);
    setErrors(validation.errors);

    if (!validation.isValid) {
      setError("Please fix the highlighted fields.");
      return;
    }

    setError(null);
    await checkoutMutation.mutateAsync(validation.form);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl rounded-3xl border border-zinc-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">Your cart is empty</h1>
          <p className="mt-2 text-sm text-zinc-600">Add products to your bag before proceeding to checkout.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white"
          >
            Continue shopping
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Address</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>}
              </div>

              <div className="md:col-span-2">
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="Address line 1"
                  value={form.addressLine1}
                  onChange={(event) => updateField("addressLine1", event.target.value)}
                  aria-invalid={!!errors.addressLine1}
                />
                {errors.addressLine1 && <p className="mt-1 text-xs text-rose-600">{errors.addressLine1}</p>}
              </div>

              <input
                className="rounded-xl border border-zinc-200 px-4 py-2.5 md:col-span-2"
                placeholder="Address line 2 (optional)"
                value={form.addressLine2}
                onChange={(event) => updateField("addressLine2", event.target.value)}
              />

              <div>
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="City"
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  aria-invalid={!!errors.city}
                />
                {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city}</p>}
              </div>

              <div>
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="State"
                  value={form.state}
                  onChange={(event) => updateField("state", event.target.value)}
                  aria-invalid={!!errors.state}
                />
                {errors.state && <p className="mt-1 text-xs text-rose-600">{errors.state}</p>}
              </div>

              <div>
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="Postal code"
                  value={form.postalCode}
                  onChange={(event) => updateField("postalCode", event.target.value)}
                  aria-invalid={!!errors.postalCode}
                />
                {errors.postalCode && <p className="mt-1 text-xs text-rose-600">{errors.postalCode}</p>}
              </div>

              <div>
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="Country"
                  value={form.country}
                  onChange={(event) => updateField("country", event.target.value)}
                  aria-invalid={!!errors.country}
                />
                {errors.country && <p className="mt-1 text-xs text-rose-600">{errors.country}</p>}
              </div>

              <div className="md:col-span-2">
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
              </div>
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
                  onChange={() => updateField("shippingMethod", "STANDARD")}
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4">
                <span>Express (1-2 days)</span>
                <input
                  type="radio"
                  name="shipping"
                  checked={form.shippingMethod === "EXPRESS"}
                  onChange={() => updateField("shippingMethod", "EXPRESS")}
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
                  onChange={() => updateField("paymentMethod", "COD")}
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4">
                <span>Credit/Debit card</span>
                <input
                  type="radio"
                  name="payment"
                  checked={form.paymentMethod === "CARD"}
                  onChange={() => updateField("paymentMethod", "CARD")}
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

          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

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
