import { Link } from "react-router-dom";

type Props = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ id, name, price, image }: Props) {
  return (
    <Link
      to={`/products/${id}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="overflow-hidden bg-zinc-100">
        <img src={image} alt={name} loading="lazy" className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-base font-medium text-zinc-900">{name}</h3>
        <p className="text-sm text-zinc-500">${price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
