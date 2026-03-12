import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../services/product.service";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "./ui/carousel";

export default function FeaturedProducts() {
  const [api, setApi] = useState<CarouselApi>();

  const { data, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => fetchProducts({ page: 1, sort: "newest" }),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (!api) return;

    const interval = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 2800);

    return () => window.clearInterval(interval);
  }, [api]);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-80 animate-pulse rounded-2xl bg-zinc-200" />
          ))}
        </div>
      </section>
    );
  }

  const products = (data?.products || []).filter((product) => product.category !== "kitchen-accessories").slice(0, 8);

  return (
    <section className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">Featured Products</h2>
        <Link to="/products" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
          View all
        </Link>
      </div>

      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
              <ProductCard id={product.id} name={product.name} price={product.price} image={product.image} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
