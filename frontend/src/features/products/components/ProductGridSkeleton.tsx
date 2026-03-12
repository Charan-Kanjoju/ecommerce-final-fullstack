export const ProductGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <div className="h-80 animate-pulse bg-zinc-200" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-20 animate-pulse rounded bg-zinc-200" />
            <div className="h-6 w-2/3 animate-pulse rounded bg-zinc-200" />
            <div className="h-5 w-24 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>
      ))}
    </div>
  );
};
