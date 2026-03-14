import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Heart, LogIn, LogOut, Package, Search, ShoppingBag, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { logoutUser } from "../api/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, clearAuth } = useAuthStore();
  const cartCount = useCartStore((state) => state.cartCount || 0);
  const wishlistCount = useWishlistStore((state) => state.wishlistCount || 0);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const currentQuery = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    setSearch(currentQuery);
  }, [currentQuery]);

  const goToSearch = (rawValue = searchInputRef.current?.value ?? search) => {
    const q = rawValue.trim();
    const nextSearchParams = new URLSearchParams();

    if (q) {
      nextSearchParams.set("q", q);
    }

    if (location.pathname === "/products") {
      const currentCategory = new URLSearchParams(location.search).get("category");
      if (currentCategory) {
        nextSearchParams.set("category", currentCategory);
      }
    }

    navigate({
      pathname: "/products",
      search: nextSearchParams.toString() ? `?${nextSearchParams.toString()}` : "",
    });
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAuth();
      navigate("/");
    }
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    goToSearch(String(formData.get("global-search") || ""));
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 md:px-6">
        <Link to="/" className="text-2xl font-semibold tracking-tight text-zinc-900">
          AURORA
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-zinc-700 md:flex">
          <NavLink to="/products" className="transition hover:text-zinc-900">
            New Arrivals
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/wishlist" className="transition hover:text-zinc-900">
              Wishlist
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/orders" className="transition hover:text-zinc-900">
              Orders
            </NavLink>
          )}
        </div>

        <form onSubmit={handleSearch} className="hidden min-w-56 items-center rounded-full border border-zinc-200 bg-white px-3 py-1.5 md:flex">
          <Search size={15} className="text-zinc-400" />
          <input
            ref={searchInputRef}
            name="global-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="w-full bg-transparent px-2 text-sm outline-none"
          />
        </form>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToSearch()}
            className="rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 md:hidden"
            aria-label="Search products"
          >
            <Search size={18} />
          </button>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                navigate("/login");
                return;
              }
              navigate("/wishlist");
            }}
            className="relative rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Open wishlist"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                navigate("/login");
                return;
              }
              setDrawerOpen(true);
            }}
            className="relative rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Open cart drawer"
          >
            <ShoppingBag size={18} />
            {isAuthenticated && cartCount > 0 && (
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
        {isAuthenticated && (
          <NavLink to="/wishlist" className="inline-flex items-center gap-1">
            <Heart size={14} />
            Wishlist
          </NavLink>
        )}
      </div>
    </nav>
  );
}
