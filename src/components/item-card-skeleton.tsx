import { Skeleton } from "./ui/skeleton"

export function ItemCardSkeleton() {
  return (
    <div className="group block">
      {/* Image Container Skeleton */}
      <div className="relative aspect-[3/4] sm:aspect-square overflow-hidden rounded-xl bg-gray-100">
        <Skeleton className="h-full w-full rounded-xl" />
        
        {/* Category Badge Skeleton */}
        <div className="absolute top-3 left-3">
            <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>

      {/* Card Body Skeleton */}
      <div className="mt-4 px-1 space-y-2">
        {/* Title Skeleton */}
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        
        {/* Price Skeleton */}
        <Skeleton className="h-5 w-1/4 rounded-md mt-1" />
      </div>
    </div>
  )
}
