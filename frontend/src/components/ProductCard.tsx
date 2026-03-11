
import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";

type Props = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ id, name, price, image }: Props) {
  return (
    <Card className="hover:shadow-lg transition">
      <Link to={`/products/${id}`}>
        <img src={image} className="h-48 w-full object-cover rounded-t-lg" />

        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">{name}</h3>

          <p className="text-gray-500">${price}</p>
        </CardContent>
      </Link>
    </Card>
  );
}
