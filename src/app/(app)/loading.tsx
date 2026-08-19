import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-56 rounded-2xl" />

      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-16 rounded-md" />
        <Skeleton className="h-16 rounded-md" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <div className="space-y-4 rounded-xl border border-border bg-card px-4 py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
