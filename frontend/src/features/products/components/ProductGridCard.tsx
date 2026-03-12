import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "../../../store/useWishlistStore";
import type { Product } from "../../../services/product.service";
import { formatCategoryLabel } from "../../../utils/categories";

type ProductGridCardProps = {
  product: Product;
  onQuickPreview: (product: Product) => void;
};

export const ProductGridCard = ({ product, onQuickPreview }: ProductGridCardProps) => {
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id));

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Link to={`/products/${product.id}`} className="block overflow-hidden bg-zinc-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </Link>

      <button
        aria-label="Toggle wishlist"
        onClick={() => toggleWishlist(product.id)}
        className="absolute right-4 top-4 rounded-full border border-white/70 bg-white/90 p-2 text-zinc-700 backdrop-blur transition hover:scale-105"
      >
        <Heart size={16} className={isWishlisted ? "fill-zinc-900 text-zinc-900" : ""} />
      </button>

      <button
        aria-label="Quick preview"
        onClick={() => onQuickPreview(product)}
        className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 p-2 text-zinc-700 opacity-0 backdrop-blur transition group-hover:opacity-100"
      >
        <Eye size={16} />
      </button>

      <div className="space-y-2 p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{formatCategoryLabel(product.category)}</p>
        <Link to={`/products/${product.id}`} className="line-clamp-1 text-lg font-semibold text-zinc-900">
          {product.name}
        </Link>
        <div className="flex items-center justify-between pt-1">
          <p className="text-base font-semibold text-zinc-900">${product.price.toFixed(2)}</p>
          <Link
            to={`/products/${product.id}`}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
};
