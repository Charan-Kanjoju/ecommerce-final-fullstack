import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useDebounce } from "../hooks/useDebounce";
import { fetchProducts, type Product, type ProductsResponse } from "../services/product.service";
import { ProductGridCard } from "../features/products/components/ProductGridCard";
import { ProductQuickPreview } from "../features/products/components/ProductQuickPreview";
import { ProductGridSkeleton } from "../features/products/components/ProductGridSkeleton";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { DB_CATEGORY_SLUGS, formatCategoryLabel } from "../utils/categories";

const ALL_CATEGORY = "All";

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isSyncingSearchFromUrlRef = useRef(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addToCart = useCartStore((state) => state.addToCart);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  const categoryFromUrl = searchParams.get("category") || ALL_CATEGORY;
  const queryFromUrl = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 400);
  const { data: categoriesSeed } = useQuery({
    queryKey: ["product-categories-seed"],
    queryFn: () => fetchProducts({ page: 1, sort: "newest" }),
  });

  const categoryOptions = useMemo(() => {
    const fromApi = (categoriesSeed?.products || []).map((product) => product.category).filter(Boolean);
    const merged = Array.from(new Set([...DB_CATEGORY_SLUGS, ...fromApi]));

    if (selectedCategory !== ALL_CATEGORY && !merged.includes(selectedCategory)) {
      merged.unshift(selectedCategory);
    }

    return [ALL_CATEGORY, ...merged];
  }, [categoriesSeed?.products, selectedCategory]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useInfiniteQuery<ProductsResponse, Error, InfiniteData<ProductsResponse>>({
      queryKey: [
        "products",
        "premium",
        debouncedSearch,
        selectedCategory,
        sortBy,
        minPrice,
        maxPrice,
      ],
      queryFn: ({ pageParam = 1 }) =>
        fetchProducts({
          page: Number(pageParam),
          q: debouncedSearch,
          category: selectedCategory,
          sort: sortBy,
          minPrice,
          maxPrice,
        }),
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      initialPageParam: 1,
      staleTime: 30 * 1000,
    });

  const products = data?.pages.flatMap((page) => page.products ?? []) ?? [];

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    isSyncingSearchFromUrlRef.current = true;
    setSearchTerm(queryFromUrl);
  }, [queryFromUrl]);

  const updateCategory = (category: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (category === ALL_CATEGORY) {
        next.delete("category");
      } else {
        next.set("category", category);
      }
      return next;
    });
  };

  useEffect(() => {
    const nextQuery = debouncedSearch.trim();
    const currentQuery = queryFromUrl.trim();

    if (isSyncingSearchFromUrlRef.current) {
      if (nextQuery !== currentQuery) {
        return;
      }

      isSyncingSearchFromUrlRef.current = false;
    }

    if (nextQuery === currentQuery) {
      return;
    }

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextQuery) {
        next.set("q", nextQuery);
      } else {
        next.delete("q");
      }
      return next;
    });
  }, [debouncedSearch, queryFromUrl, setSearchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Layout>
      <section className="mb-10 overflow-hidden rounded-3xl bg-zinc-950 px-6 py-16 text-white md:px-10">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-zinc-300">Spring 2026</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">Move with precision. Dress with intent.</h1>
        <p className="mt-4 max-w-xl text-sm text-zinc-300 md:text-base">
          Performance silhouettes and premium essentials engineered for all-day movement.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-5 lg:sticky lg:top-24">
          <div className="mb-4 flex items-center gap-2 text-zinc-800">
            <SlidersHorizontal size={16} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em]">Filters</h2>
          </div>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products"
            className="mb-5 w-full rounded-2xl border border-zinc-200 px-4 py-2.5 text-sm outline-none ring-zinc-300 focus:ring"
          />

          <div className="mb-5 space-y-2">
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Category</p>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  onClick={() => updateCategory(category)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    selectedCategory === category
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-200 text-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  {category === ALL_CATEGORY ? ALL_CATEGORY : formatCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 space-y-3">
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Price Range</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minPrice}
                min={0}
                onChange={(event) => setMinPrice(Number(event.target.value || 0))}
                className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                aria-label="Minimum price"
              />
              <input
                type="number"
                value={maxPrice}
                min={0}
                onChange={(event) => setMaxPrice(Number(event.target.value || 0))}
                className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                aria-label="Maximum price"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Sort</p>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as "newest" | "price_asc" | "price_desc")}
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-zinc-900">Products</h2>
            <p className="text-sm text-zinc-500">{products.length} items</p>
          </div>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : isError ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-6 text-zinc-700">
              Failed to load products: {error.message}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-zinc-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductGridCard
                  key={product.id}
                  product={product}
                  onQuickPreview={(selected) => setPreviewProduct(selected)}
                />
              ))}
            </div>
          )}

          <div ref={loadMoreRef} className="flex h-24 items-center justify-center">
            {isFetchingNextPage && <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />}
            {!hasNextPage && products.length > 0 && <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">No more products</p>}
          </div>
        </section>
      </div>

      <ProductQuickPreview
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
        onAddToCart={async (productId) => {
          if (!isAuthenticated) {
            setPreviewProduct(null);
            navigate("/login");
            return;
          }

          await addToCart(productId, 1);
          setDrawerOpen(true);
          setPreviewProduct(null);
        }}
      />
    </Layout>
  );
}
