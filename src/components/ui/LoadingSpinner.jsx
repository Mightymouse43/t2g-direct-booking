/** Full-page or inline loading state */
export function LoadingSpinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t2g-mist border-t-t2g-navy" />
      </div>
    );
  }
  return (
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-t2g-mist border-t-t2g-navy" />
  );
}

/** Skeleton card grid for property listings */
export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="skeleton aspect-video w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
      </div>
    </div>
  );
}

/** Skeleton grid of N cards */
export function PropertyGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
