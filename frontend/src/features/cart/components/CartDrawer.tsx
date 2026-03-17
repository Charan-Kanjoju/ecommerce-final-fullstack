import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../store/useCartStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useProductsByIds } from "../../../hooks/useProductsByIds";

export const CartDrawer = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { items, isDrawerOpen, setDrawerOpen, removeFromCart, updateCartItem } =
    useCartStore();

  const productIds = items.map((item) => item.productId);

  const { data: productsData, productMap } = useProductsByIds(productIds);

  useEffect(() => {
    (productsData || []).forEach((product) => {
      const image = new Image();
      image.src = product.image;
    });
  }, [productsData]);

  const total = items.reduce((sum, item) => {
    const product = productMap[item.productId];
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[55] bg-black/40 transition ${isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart drawer"
      >
        <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-zinc-900">Your Bag</h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500">
              <ShoppingBag size={28} />
              <p className="mt-3">Your cart is empty.</p>
            </div>
          ) : (
            items.map((item) => {
              const product = productMap[item.productId];
              if (!product) return null;

              return (
                <div
                  key={item.id}
                  className="group flex gap-3 rounded-2xl border border-zinc-200 p-3 transition hover:border-zinc-400"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-zinc-900">
                      {product.name}
                    </p>
                    <p className="text-sm text-zinc-500">
                      ${product.price.toFixed(2)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateCartItem(item.id, item.quantity - 1)
                        }
                        className="rounded-full border border-zinc-300 p-1"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartItem(item.id, item.quantity + 1)
                        }
                        className="rounded-full border border-zinc-300 p-1"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <footer className="space-y-4 border-t border-zinc-200 px-5 py-4">
          <div className="flex items-center justify-between text-sm text-zinc-600">
            <span>Subtotal</span>
            <span className="text-base font-semibold text-zinc-900">
              ${total.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => {
              setDrawerOpen(false);
              navigate("/checkout");
            }}
            className="w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white hover:bg-black"
          >
            Checkout
          </button>
        </footer>
      </aside>
    </>
  );
};
