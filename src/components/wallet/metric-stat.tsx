"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function MetricStat({
  icon,
  label,
  value,
  formula,
  wide,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  formula: string;
  wide?: boolean;
  danger?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "rounded-xl px-3 py-2.5 text-left backdrop-blur-sm transition-colors hover:bg-white/15 active:scale-[0.98]",
          danger ? "bg-rose-500/20" : "bg-white/10",
          wide && "col-span-2",
        )}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-100/75">
          {icon}
          {label}
        </div>
        <p className="mt-0.5 font-numeric text-sm font-semibold">{value}</p>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>Como esse valor é calculado</DialogDescription>
          </DialogHeader>
          <div className="space-y-1">
            <p className="font-numeric text-3xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{formula}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
