import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { useCartStore } from "./store/useCartStore";
import { useEffect } from "react";
import { bootstrapAuthSession } from "./api/client";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const fetchCart = useCartStore((state) => state.fetchCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const run = async () => {
      await bootstrapAuthSession();
      if (useAuthStore.getState().isAuthenticated) {
        await fetchCart();
      }
    };

    run();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return <RouterProvider router={router} />;
}

export default App;
