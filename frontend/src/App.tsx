import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { useCartStore } from "./store/useCartStore";
import { useEffect } from "react";

function App() {
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
