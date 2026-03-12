import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Package, Search, ShoppingBag, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { logoutUser } from "../api/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, clearAuth } = useAuthStore();
  const cartCount = useCartStore((state) => state.cartCount || 0);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAuth();
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="text-2xl font-semibold tracking-tight text-zinc-900">
          AURORA
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-zinc-700 md:flex">
          <NavLink to="/products" className="transition hover:text-zinc-900">
            New Arrivals
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" className="transition hover:text-zinc-900">
              Orders
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/profile" className="transition hover:text-zinc-900">
              Profile
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/products" className="rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900">
            <Search size={18} />
          </Link>

          <button
            onClick={() => setDrawerOpen(true)}
            className="relative rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Open cart drawer"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-zinc-900 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900">
                <User size={18} />
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900">
                <LogIn size={18} />
              </Link>
              <Link
                to="/register"
                className="hidden rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black md:inline-flex"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 border-t border-zinc-100 px-4 py-2 text-xs font-medium text-zinc-500 md:hidden">
        <NavLink to="/products" className="inline-flex items-center gap-1">
          <Package size={14} />
          Shop
        </NavLink>
      </div>
    </nav>
  );
}
