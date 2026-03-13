import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { fetchProductById, fetchProducts } from "../services/product.service";

export default function ProductDetails() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(id));

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
  });

  const { data: relatedData } = useQuery({
    queryKey: ["related-products", product?.category],
    queryFn: () => fetchProducts({ page: 1, category: product?.category, sort: "newest" }),
    enabled: Boolean(product?.category),
  });

  const relatedProducts = useMemo(
    () => (relatedData?.products || []).filter((item) => item.id !== id).slice(0, 4),
    [relatedData, id],
  );

  if (isLoading || !product) {
    return (
      <Layout>
        <div className="grid animate-pulse gap-8 md:grid-cols-2">
          <div className="h-[520px] rounded-3xl bg-zinc-200" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-zinc-200" />
            <div className="h-6 w-1/3 rounded bg-zinc-200" />
            <div className="h-24 rounded bg-zinc-200" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div className="overflow-hidden rounded-3xl bg-zinc-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full max-h-[640px] w-full cursor-zoom-in object-cover transition duration-500 hover:scale-110"
          />
        </div>

        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{product.category}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-zinc-900">${product.price.toFixed(2)}</p>
          <p className="leading-relaxed text-zinc-600">{product.description}</p>

          <div className="flex items-center gap-3">
            <button
              className="rounded-full border border-zinc-300 px-3 py-1.5"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button className="rounded-full border border-zinc-300 px-3 py-1.5" onClick={() => setQuantity((prev) => prev + 1)}>
              +
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              disabled={isAdding || product.stock <= 0}
              onClick={async () => {
                setIsAdding(true);
                try {
                  await addToCart(product.id, quantity);
                  setDrawerOpen(true);
                } finally {
                  setIsAdding(false);
                }
              }}
              className="flex-1 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:scale-[1.01] hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAdding ? "Adding..." : "Add To Cart"}
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login");
                  return;
                }
                toggleWishlist(product.id);
              }}
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition ${
                isWishlisted
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900"
              }`}
            >
              <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
              {isWishlisted ? "Saved" : "Save to Wishlist"}
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-sm font-medium text-zinc-900">Reviews</p>
            <p className="mt-1 text-sm text-zinc-600">4.8/5 average from 129 customers</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              <li>Excellent fit and lightweight feel.</li>
              <li>Premium material quality and finish.</li>
              <li>Comfortable for everyday wear.</li>
            </ul>
          </div>
        </section>
      </div>

      <section className="mt-14">
        <h2 className="mb-6 text-2xl font-semibold text-zinc-900">Related Products</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <Link key={item.id} to={`/products/${item.id}`} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <img src={item.image} alt={item.name} className="h-52 w-full object-cover transition duration-500 hover:scale-105" />
              <div className="p-4">
                <p className="line-clamp-1 text-sm font-medium text-zinc-900">{item.name}</p>
                <p className="mt-1 text-sm text-zinc-500">${item.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
