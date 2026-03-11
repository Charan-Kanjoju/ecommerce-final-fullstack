import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Discover the Latest Products
          </h1>

          <p className="text-gray-600 mb-8">
            Shop the newest trends in electronics, fashion, and more.
          </p>

          <Link to="/products">
            <Button size="lg">Shop Now</Button>
          </Link>
        </div>

        <img
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f"
          className="rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}
