import { Link } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";

import {
  ShoppingCart,
  Package,
  User,
  LogOut,
  LogIn,
  Home,
  Store,
} from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const cartCount = useCartStore((state) => state.cartCount || 0);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
       
        <Link
          to="/"
          className="text-2xl font-bold flex items-center gap-2 text-gray-800"
        >
          <Store size={24} />
          ShopSphere
        </Link>


        <div className="flex items-center gap-6 text-gray-600 font-medium">
         <Link
            to="/"
            className="flex items-center gap-1 hover:text-black transition"
          >
            <Home size={18} />
            Home
          </Link>

       
          <Link
            to="/products"
            className="flex items-center gap-1 hover:text-black transition"
          >
            <Package size={18} />
            Products
          </Link>

      
          <Link
            to="/cart"
            className="relative flex items-center gap-1 hover:text-black transition"
          >
            <ShoppingCart size={18} />
 
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          
          {isAuthenticated && (
            <Link
              to="/orders"
              className="flex items-center gap-1 hover:text-black transition"
            >
              <Package size={18} />
              Orders
            </Link>
          )}

          
          {isAuthenticated && (
            <Link
              to="/profile"
              className="flex items-center gap-1 hover:text-black transition"
            >
              <User size={18} />
            </Link>
          )}

   
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 hover:text-black transition"
              >
                <LogIn size={18} />
                Login
              </Link>

              <Link
                to="/register"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
