import { cn } from "@/lib/utils";

/** Marca do app: "Fluxo" com um glifo de fluxo/onda em esmeralda. */
export function Brand({
  className,
  showName = true,
}: {
  className?: string;
  showName?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5"
          aria-hidden="true"
        >
          <path
            d="M3 14c3 0 3-4 6-4s3 4 6 4 3-4 6-4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M3 9c3 0 3-4 6-4s3 4 6 4 3-4 6-4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </span>
      {showName && (
        <span className="text-xl font-extrabold tracking-tight">Fluxo</span>
      )}
    </div>
  );
}
