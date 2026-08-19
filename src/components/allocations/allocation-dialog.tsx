"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";

import { upsertAllocation } from "@/actions/allocations";
import { useDialogAction } from "@/lib/use-dialog-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ALLOCATION_COLORS } from "@/lib/allocation-colors";
import { cn } from "@/lib/utils";

export type AllocationFormData = {
  id: string;
  name: string;
  current: number;
  target: number | null;
  color: string;
};

export function AllocationDialog({
  allocation,
  trigger,
}: {
  allocation?: AllocationFormData;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { state, pending, formAction } = useDialogAction(upsertAllocation, () =>
    setOpen(false),
  );
  const [color, setColor] = useState(allocation?.color ?? "emerald");
  const isEdit = !!allocation;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="w-full">
            <Plus className="size-4" /> Novo objetivo
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar objetivo" : "Novo objetivo"}
          </DialogTitle>
          <DialogDescription>
            Carimbe parte do seu saldo para um fim específico.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {isEdit && <input type="hidden" name="id" value={allocation.id} />}
          <input type="hidden" name="color" value={color} />

          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex.: Reserva de emergência"
              defaultValue={allocation?.name}
              aria-invalid={!!state.fieldErrors?.name}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="current">Valor carimbado</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  R$
                </span>
                <Input
                  id="current"
                  name="current"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  placeholder="0,00"
                  className="pl-8 font-numeric"
                  defaultValue={allocation?.current ?? 0}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Meta (opcional)</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  R$
                </span>
                <Input
                  id="target"
                  name="target"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  placeholder="0,00"
                  className="pl-8 font-numeric"
                  defaultValue={allocation?.target ?? undefined}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ALLOCATION_COLORS).map(([key, c]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColor(key)}
                  aria-label={key}
                  className={cn(
                    "size-8 rounded-full ring-offset-2 ring-offset-card transition-all",
                    c.swatch,
                    color === key && "ring-2 ring-foreground",
                  )}
                />
              ))}
            </div>
          </div>

          {state.error && (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
              {state.error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {isEdit ? (
              <>
                <Pencil className="size-4" /> Salvar alterações
              </>
            ) : (
              <>
                <Plus className="size-4" /> Criar objetivo
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
