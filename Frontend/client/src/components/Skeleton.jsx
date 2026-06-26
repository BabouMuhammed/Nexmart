export function Skeleton({ className = '' }) {
  return <div className={`skeleton bg-gradient-to-r from-[#0B143D] via-[#111A4A] to-[#0B143D] rounded-lg ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
