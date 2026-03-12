import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "./ui/carousel";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1400&q=80",
    alt: "Athletic lifestyle",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
    alt: "Urban premium fashion",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80",
    alt: "Premium sportswear collection",
  },
];

export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const timer = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3200);

    return () => window.clearInterval(timer);
  }, [api]);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-20 text-white md:px-12">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-300">Performance Essentials</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">Designed to move.</h1>
          <p className="mt-5 max-w-md text-sm text-zinc-300 md:text-base">
            Premium gear inspired by elite sport culture with clean silhouettes and all-day comfort.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200">
              Shop Collection
            </Link>
            <Link
              to="/products"
              className="rounded-full border border-zinc-400 px-6 py-3 text-sm font-medium text-white transition hover:border-zinc-200"
            >
              Explore New Arrivals
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {heroSlides.map((slide) => (
                <CarouselItem key={slide.image}>
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="h-[420px] w-full object-cover transition duration-700"
                    loading="lazy"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
