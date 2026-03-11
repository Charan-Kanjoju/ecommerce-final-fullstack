import { Link } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";

export default function Navbar() {

  const { isAuthenticated, logout } = useAuthStore();
  const cartCount = useCartStore((state) => state.cartCount||0);

  



  return (
    <nav className="border-b p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">ShopSphere</h1>

      <div className="flex gap-6">
        <Link to="/">Home</Link>

        <Link to="/products">Products</Link>

        <Link to="/cart">Cart ({cartCount})</Link>

        <Link to="/orders">Orders</Link>

        {isAuthenticated ? (
          <button
            onClick={() => {
              logout();

              window.location.href = "/";
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
