import axios from "axios";
import { prisma } from "../src/lib/prisma";

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

const curatedProducts: SeedProduct[] = [
  {
    name: "Hydra Glow Face Serum",
    description: "Hydrating daily serum for brighter and smoother skin.",
    price: 34,
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=900&q=80",
    category: "beauty",
    stock: 60,
  },
  {
    name: "Amber Spice Eau De Parfum",
    description: "Warm and woody fragrance with amber and spice notes.",
    price: 79,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80",
    category: "fragrances",
    stock: 40,
  },
  {
    name: "Organic Oat Granola Pack",
    description: "Crunchy multigrain granola with nuts and dried fruits.",
    price: 12,
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
    category: "groceries",
    stock: 100,
  },
  {
    name: "Nordic Wall Decor Set",
    description: "Minimal wall decoration set for modern living spaces.",
    price: 49,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    category: "home-decoration",
    stock: 35,
  },
  {
    name: "Chef Knife and Board Kit",
    description: "Premium knife and cutting board combo for home kitchens.",
    price: 56,
    image: "https://images.unsplash.com/photo-1590794056466-ade5f837a6ef?auto=format&fit=crop&w=900&q=80",
    category: "kitchen-accessories",
    stock: 45,
  },
  {
    name: "Urban Motion Men Sneakers",
    description: "Lightweight men sneakers with cushioned sole.",
    price: 68,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    category: "mens-shoes",
    stock: 55,
  },
  {
    name: "Steel Chrono Men Watch",
    description: "Stainless steel chronograph watch with date display.",
    price: 112,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",
    category: "mens-watches",
    stock: 30,
  },
  {
    name: "MagSafe Phone Grip Stand",
    description: "Magnetic grip stand for one-hand use and desk viewing.",
    price: 22,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    category: "mobile-accessories",
    stock: 80,
  },
];

async function fetchApiProducts(): Promise<SeedProduct[]> {
  try {
    const response = await axios.get("https://dummyjson.com/products?limit=100");
    const products = response.data.products || [];

    return products.map((product: any) => ({
      name: product.title,
      description: product.description,
      price: product.price,
      image: product.thumbnail,
      category: product.category,
      stock: product.stock ?? 50,
    }));
  } catch {
    console.log("Could not fetch remote products, continuing with curated seed data.");
    return [];
  }
}

async function main() {
  console.log("Seeding products...");

  const apiProducts = await fetchApiProducts();
  const allProducts = [...apiProducts, ...curatedProducts];

  const existing = await prisma.product.findMany({
    select: { name: true },
  });

  const existingNames = new Set(existing.map((item) => item.name.toLowerCase()));

  const newProducts = allProducts.filter((product) => {
    const key = product.name.toLowerCase();
    if (existingNames.has(key)) return false;
    existingNames.add(key);
    return true;
  });

  if (newProducts.length > 0) {
    await prisma.product.createMany({ data: newProducts });
  }

  console.log(`Inserted ${newProducts.length} new products`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
