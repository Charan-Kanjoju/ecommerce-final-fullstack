export const DB_CATEGORY_SLUGS = [
  "beauty",
  "fragrances",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
] as const;

export const formatCategoryLabel = (category: string) =>
  category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
