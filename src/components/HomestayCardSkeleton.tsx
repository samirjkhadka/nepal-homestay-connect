import { Skeleton } from '@/components/ui/skeleton';

export function HomestayCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
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
