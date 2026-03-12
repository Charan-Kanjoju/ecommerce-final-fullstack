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
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <div
              key={cat}
              className="group border rounded-xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition cursor-pointer bg-gray-50"
            >
              <div className="text-3xl mb-3">📦</div>

              <p className="capitalize font-medium group-hover:text-black">
                {cat.replace("-", " ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
