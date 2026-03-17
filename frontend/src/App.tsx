import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { useCartStore } from "./store/useCartStore";
import { useEffect } from "react";
import { bootstrapAuthSession } from "./api/client";
import { useAuthStore } from "./store/useAuthStore";
import { useWishlistStore } from "./store/useWishlistStore";
import ToastViewport from "./components/ToastViewport";

function App() {
  const fetchCart = useCartStore((state) => state.fetchCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const hydrateWishlist = useWishlistStore((state) => state.hydrateWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  useEffect(() => {
    const run = async () => {
      await bootstrapAuthSession();
    };

    run();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      return;
    }

    clearCart();
  }, [clearCart, isAuthenticated, fetchCart]);

  useEffect(() => {
    if (isAuthenticated && userId) {
      hydrateWishlist(userId);
      return;
    }

    clearWishlist();
  }, [clearWishlist, hydrateWishlist, isAuthenticated, userId]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastViewport />
    </>
  );
}

export default App;
