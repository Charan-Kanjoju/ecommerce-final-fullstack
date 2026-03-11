import { Input } from "../components/ui/input";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function ProductSearch({ search, setSearch }: Props) {
  return (
    <div className="mb-6">
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
