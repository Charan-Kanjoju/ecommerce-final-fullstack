import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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

export default function Checkout() {
  const navigate = useNavigate();
  const { items, fetchCart } = useCartStore();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    defaultValues: initialForm,
    mode: "onBlur",
  });

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

  const shippingMethod = watch("shippingMethod");
  const subtotal = items.reduce((sum, item) => {
    const product = productMap[item.productId];
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  const shippingFee = shippingMethod === "EXPRESS" ? 12 : 0;
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
      setFormError(getApiErrorMessage(mutationError, "Failed to place order."));
    },
  });

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }

    setFormError(null);
    await checkoutMutation.mutateAsync(sanitizeForm(data));
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
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_360px]" noValidate>
        <section className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Address</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="Full name"
                  aria-invalid={errors.fullName ? "true" : "false"}
                  {...register("fullName", {
                    required: "Full name is required.",
                    validate: (value) =>
                      value.trim().length >= 2 || "Full name must be at least 2 characters.",
                  })}
                />
                {errors.fullName && <p className="mt-1 text-xs text-rose-600">{errors.fullName.message}</p>}
              </div>

              <div className="md:col-span-2">
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="Address line 1"
                  aria-invalid={errors.addressLine1 ? "true" : "false"}
                  {...register("addressLine1", {
                    required: "Address line 1 is required.",
                    validate: (value) => value.trim().length > 0 || "Address line 1 is required.",
                  })}
                />
                {errors.addressLine1 && <p className="mt-1 text-xs text-rose-600">{errors.addressLine1.message}</p>}
              </div>

              <input
                className="rounded-xl border border-zinc-200 px-4 py-2.5 md:col-span-2"
                placeholder="Address line 2 (optional)"
                {...register("addressLine2")}
              />

              <div>
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="City"
                  aria-invalid={errors.city ? "true" : "false"}
                  {...register("city", {
                    required: "City is required.",
                    validate: (value) => value.trim().length > 0 || "City is required.",
                  })}
                />
                {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city.message}</p>}
              </div>

              <div>
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="State"
                  aria-invalid={errors.state ? "true" : "false"}
                  {...register("state", {
                    required: "State is required.",
                    validate: (value) => value.trim().length > 0 || "State is required.",
                  })}
                />
                {errors.state && <p className="mt-1 text-xs text-rose-600">{errors.state.message}</p>}
              </div>

              <div>
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="Postal code"
                  aria-invalid={errors.postalCode ? "true" : "false"}
                  {...register("postalCode", {
                    required: "Postal code is required.",
                    validate: (value) => {
                      const trimmedValue = value.trim();
                      if (!trimmedValue) return "Postal code is required.";
                      return (
                        /^[0-9]{3,12}$/.test(trimmedValue) ||
                        "Use 3 to 12 digits."
                      );
                    },
                  })}
                />
                {errors.postalCode && <p className="mt-1 text-xs text-rose-600">{errors.postalCode.message}</p>}
              </div>

              <div>
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="Country"
                  aria-invalid={errors.country ? "true" : "false"}
                  {...register("country", {
                    required: "Country is required.",
                    validate: (value) => value.trim().length > 0 || "Country is required.",
                  })}
                />
                {errors.country && <p className="mt-1 text-xs text-rose-600">{errors.country.message}</p>}
              </div>

              <div className="md:col-span-2">
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5"
                  placeholder="Phone"
                  aria-invalid={errors.phone ? "true" : "false"}
                  {...register("phone", {
                    required: "Phone number is required.",
                    validate: (value) => {
                      const trimmedValue = value.trim();
                      if (!trimmedValue) return "Phone number is required.";
                      return (
                        /^[0-9]{10}$/.test(trimmedValue) ||
                        "Use 10 digits for the phone number."
                      );
                    },
                  })}
                />
                {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Shipping</h2>
            <div className="space-y-3 text-sm">
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4">
                <span>Standard (3-5 days)</span>
                <input type="radio" value="STANDARD" {...register("shippingMethod")} />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4">
                <span>Express (1-2 days)</span>
                <input type="radio" value="EXPRESS" {...register("shippingMethod")} />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Payment</h2>
            <div className="space-y-3 text-sm">
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4">
                <span>Cash on delivery</span>
                <input type="radio" value="COD" {...register("paymentMethod")} />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4">
                <span>Credit/Debit card</span>
                <input type="radio" value="CARD" {...register("paymentMethod")} />
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

          {formError && <p className="mt-4 text-sm text-rose-600">{formError}</p>}

          <button
            type="submit"
            disabled={checkoutMutation.isPending || isSubmitting}
            className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checkoutMutation.isPending || isSubmitting ? "Placing order..." : "Place order"}
          </button>
        </aside>
      </form>
    </Layout>
  );
}
