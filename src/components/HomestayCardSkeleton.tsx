export function HomestayCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-soft">
      <div className="shimmer aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="shimmer h-3 w-1/2 rounded" />
        <div className="shimmer h-5 w-3/4 rounded" />
        <div className="flex justify-between items-center">
          <div className="shimmer h-4 w-16 rounded" />
          <div className="shimmer h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function HomestayGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => <HomestayCardSkeleton key={i} />)}
    </div>
  );
}
