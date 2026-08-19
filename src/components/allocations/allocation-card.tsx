"use client";

import { useTransition } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { deleteAllocation } from "@/actions/allocations";
import { allocationColor } from "@/lib/allocation-colors";
import { cn, formatBRL } from "@/lib/utils";
import { AllocationDialog } from "@/components/allocations/allocation-dialog";

export type AllocationCardData = {
  id: string;
  name: string;
  currentCents: number;
  targetCents: number | null;
  color: string;
};

export function AllocationCard({ allocation }: { allocation: AllocationCardData }) {
  const [pending, startTransition] = useTransition();
  const c = allocationColor(allocation.color);
  const current = allocation.currentCents / 100;
  const target = allocation.targetCents ? allocation.targetCents / 100 : null;
  const pct = target && target > 0 ? Math.min((current / target) * 100, 100) : null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-opacity",
        pending && "opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className={cn("size-2.5 rounded-full", c.swatch)} />
          <p className="font-semibold">{allocation.name}</p>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="-mr-1 grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Ações"
            >
              <MoreVertical className="size-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="z-50 min-w-40 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
            >
              <AllocationDialog
                allocation={{
                  id: allocation.id,
                  name: allocation.name,
                  current,
                  target,
                  color: allocation.color,
                }}
                trigger={
                  <DropdownMenu.Item
                    onSelect={(e) => e.preventDefault()}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-none focus:bg-accent"
                  >
                    <Pencil className="size-4" /> Editar
                  </DropdownMenu.Item>
                }
              />
              <DropdownMenu.Item
                onSelect={() =>
                  startTransition(() => {
                    deleteAllocation(allocation.id);
                  })
                }
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-danger outline-none focus:bg-danger/10"
              >
                <Trash2 className="size-4" /> Excluir
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <p className="font-numeric text-xl font-bold">{formatBRL(current)}</p>
        {target && (
          <p className="font-numeric text-xs text-muted-foreground">
            meta {formatBRL(target)}
          </p>
        )}
      </div>

      {pct !== null && (
        <div className="mt-2.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", c.bar)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className={cn("mt-1 text-right text-[11px] font-medium", c.text)}>
            {Math.round(pct)}%
          </p>
        </div>
      )}
    </div>
  );
}
