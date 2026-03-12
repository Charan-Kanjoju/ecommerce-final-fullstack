import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/product.service";
import { DB_CATEGORY_SLUGS, formatCategoryLabel } from "../utils/categories";

export default function Categories() {
  const { data } = useQuery({
    queryKey: ["homepage-categories"],
    queryFn: () => fetchProducts({ page: 1, sort: "newest" }),
  });

  const categories = Array.from(new Set([...(data?.products.map((product) => product.category) || []), ...DB_CATEGORY_SLUGS])).slice(0, 8);

  return (
    <section className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">Shop by Category</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category}
            to={`/products?category=${encodeURIComponent(category)}`}
            className="group rounded-3xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Category</p>
            <p className="mt-3 text-2xl font-semibold text-zinc-900">{formatCategoryLabel(category)}</p>
            <p className="mt-4 text-sm text-zinc-500 transition group-hover:text-zinc-700">Shop now</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
