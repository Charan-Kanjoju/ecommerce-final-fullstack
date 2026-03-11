import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="border-b p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">ShopSphere</h1>

      <div className="flex gap-6">
        <Link to="/">Home</Link>

        <Link to="/products">Products</Link>

        <Link to="/cart">Cart</Link>

        <Link to="/orders">Orders</Link>

        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
