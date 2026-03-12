import { X, ShoppingBag } from "lucide-react";
import type { Product } from "../../../services/product.service";

type ProductQuickPreviewProps = {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
};

export const ProductQuickPreview = ({ product, onClose, onAddToCart }: ProductQuickPreviewProps) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-zinc-100 p-2 text-zinc-700 hover:bg-zinc-200"
          aria-label="Close preview"
        >
          <X size={18} />
        </button>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-zinc-100">
            <img src={product.image} alt={product.name} className="h-full min-h-80 w-full object-cover" />
          </div>

          <div className="space-y-5 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{product.category}</p>
            <h2 className="text-3xl font-semibold text-zinc-900">{product.name}</h2>
            <p className="text-zinc-600">{product.description}</p>
            <p className="text-2xl font-semibold text-zinc-900">${product.price.toFixed(2)}</p>
            <button
              onClick={() => onAddToCart(product.id)}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-black"
            >
              <ShoppingBag size={16} />
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
