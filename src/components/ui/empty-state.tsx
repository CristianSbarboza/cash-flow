import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  className,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center",
        className,
      )}
    >
      {icon && (
        <div className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <p className="font-medium">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}
