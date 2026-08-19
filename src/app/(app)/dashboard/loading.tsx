import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      <Skeleton className="h-20 rounded-xl" />

      <div className="rounded-xl border border-border bg-card p-5">
        <Skeleton className="mb-4 h-4 w-32" />
        <Skeleton className="h-44 w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  );
}
