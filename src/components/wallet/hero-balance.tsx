"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function HeroBalance({
  value,
  formula,
}: {
  value: string;
  formula: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-left transition-opacity active:opacity-80"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-100/80">
          <Wallet className="size-4" />
          Saldo disponível
        </div>
        <p className="mt-1 font-numeric text-4xl font-bold tracking-tight">
          {value}
        </p>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Saldo disponível</DialogTitle>
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
