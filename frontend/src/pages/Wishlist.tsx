import { useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useProductsByIds } from "../hooks/useProductsByIds";

export default function Wishlist() {
  const navigate = useNavigate();
  const productIds = useWishlistStore((state) => state.productIds);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const addToCart = useCartStore((state) => state.addToCart);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const { orderedProducts, isLoading } = useProductsByIds(productIds);

  return (
    <Layout>
      <section className="mb-8 overflow-hidden rounded-3xl bg-zinc-950 px-6 py-14 text-white md:px-10">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-zinc-300">Wishlist</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">Your saved pieces, ready when you are.</h1>
        <p className="mt-4 max-w-2xl text-sm text-zinc-300 md:text-base">
          Keep track of standout products, compare favorites, and move the right one to your bag in one click.
        </p>
      </section>

      {productIds.length === 0 ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <Heart size={24} />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-zinc-900">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-zinc-500">Save the pieces you love so you can revisit them before they sell out.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black"
          >
            Explore products
          </button>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              {productIds.length} saved {productIds.length === 1 ? "item" : "items"}
            </p>
            <Link to="/products" className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline">
              Continue shopping
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-4">
              {productIds.map((id) => (
                <div key={id} className="h-40 animate-pulse rounded-3xl bg-zinc-200" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5">
              {orderedProducts.map((product) => {
                if (!product) return null;

                const isBusy = activeProductId === product.id;

                return (
                  <article
                    key={product.id}
                    className="grid gap-5 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-lg md:grid-cols-[180px_1fr]"
                  >
                    <Link to={`/products/${product.id}`} className="overflow-hidden rounded-2xl bg-zinc-100">
                      <img src={product.image} alt={product.name} className="h-full min-h-52 w-full object-cover transition duration-500 hover:scale-105" />
                    </Link>

                    <div className="flex flex-col justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{product.category}</p>
                        <Link to={`/products/${product.id}`} className="mt-2 inline-block text-2xl font-semibold tracking-tight text-zinc-900">
                          {product.name}
                        </Link>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{product.description}</p>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xl font-semibold text-zinc-900">${product.price.toFixed(2)}</p>
                          <p className={`text-sm ${product.stock > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {product.stock > 0 ? "In stock and ready to ship" : "Currently out of stock"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={async () => {
                              setActiveProductId(product.id);
                              try {
                                await addToCart(product.id, 1);
                                removeFromWishlist(product.id);
                                setDrawerOpen(true);
                              } finally {
                                setActiveProductId(null);
                              }
                            }}
                            disabled={isBusy || product.stock <= 0}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <ShoppingBag size={16} />
                            {isBusy ? "Adding..." : "Add to cart"}
                          </button>

                          <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </Layout>
  );
}
