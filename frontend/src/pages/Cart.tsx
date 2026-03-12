import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { useCartStore } from "../store/useCartStore";
import { fetchProductsByIds } from "../services/product.service";

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateCartItem, removeFromCart } = useCartStore();

  const productIds = items.map((item) => item.productId);

  const { data: products } = useQuery({
    queryKey: ["cart-page-products", productIds],
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

  const total = items.reduce((sum, item) => {
    const product = productMap[item.productId];
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  return (
    <Layout>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">Your Cart</h1>
          {items.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center">
              <p className="text-zinc-600">Your cart is empty.</p>
              <button
                onClick={() => navigate("/products")}
                className="mt-5 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
              >
                Shop products
              </button>
            </div>
          ) : (
            items.map((item) => {
              const product = productMap[item.productId];
              if (!product) return null;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 transition duration-300 hover:shadow-lg"
                >
                  <div className="flex gap-4">
                    <img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl object-cover" loading="lazy" />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="font-medium text-zinc-900">{product.name}</h2>
                        <p className="text-sm text-zinc-500">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                          className="rounded-full border border-zinc-300 px-2"
                        >
                          -
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          className="rounded-full border border-zinc-300 px-2"
                        >
                          +
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="ml-auto text-sm text-zinc-700">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold">Summary</h2>
          <div className="mt-5 space-y-2 text-sm text-zinc-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          <div className="my-5 h-px bg-zinc-200" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            disabled={items.length === 0}
            className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to checkout
          </button>
        </aside>
      </div>
    </Layout>
  );
}
