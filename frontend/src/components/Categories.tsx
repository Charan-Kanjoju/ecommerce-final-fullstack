export default function Categories() {
  const categories = [
    "smartphones",
    "laptops",
    "fragrances",
    "skincare",
    "groceries",
    "home-decoration",
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
        {categories.map((cat) => (
          <div
            key={cat}
            className="border rounded-xl p-6 text-center hover:shadow-lg cursor-pointer"
          >
            <p className="capitalize">{cat}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
