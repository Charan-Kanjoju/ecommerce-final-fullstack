type Props = {
  page: number;
  setPage: (page: number) => void;
};

export default function Pagination({ page, setPage }: Props) {
  return (
    <div className="flex justify-center gap-4 mt-10">
      <button
        className="border px-4 py-2 rounded"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>

      <span className="px-4 py-2">Page {page}</span>

      <button
        className="border px-4 py-2 rounded"
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
