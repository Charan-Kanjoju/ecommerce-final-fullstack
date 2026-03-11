type Props = {
  category: string;
  setCategory: (value: string) => void;
};

const categories = [
  "all",
  "smartphones",
  "laptops",
  "fragrances",
  "skincare",
  "groceries",
  "home-decoration",
];

export default function CategoryFilter({ category, setCategory }: Props) {
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-4 py-2 rounded-lg border capitalize
${category === cat ? "bg-black text-white" : ""}
`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
