import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-gray-50 to-gray-100 py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
        {/* LEFT CONTENT */}
        <div>
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            New Arrivals
          </span>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mt-4 mb-6">
            Discover the <span className="text-black">Latest Products</span>
          </h1>

          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Shop the newest trends in electronics, fashion, and everyday
            essentials — all in one place.
          </p>

          <div className="flex gap-4">
            <Link to="/products">
              <Button size="lg" className="px-8">
                Shop Now
              </Button>
            </Link>

            <Link to="/products">
              <Button variant="outline" size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f"
            className="rounded-2xl shadow-2xl object-cover"
          />

        
        </div>
      </div>
    </section>
  );
}
