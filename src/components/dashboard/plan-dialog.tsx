"use client";

import { useState } from "react";
import { Loader2, SlidersHorizontal } from "lucide-react";

import { upsertMonthlyPlan } from "@/actions/planning";
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
import { formatBRL } from "@/lib/utils";

export function PlanDialog({
  month,
  monthLabel,
  defaults,
}: {
  month: string;
  monthLabel: string;
  defaults: {
    plannedSpend: number;
    requiredSpend: number;
    expectedIncome: number;
  };
}) {
  const [open, setOpen] = useState(false);
  const { state, pending, formAction } = useDialogAction(
    upsertMonthlyPlan,
    () => setOpen(false),
  );
  const [required, setRequired] = useState(defaults.requiredSpend);
  const [income, setIncome] = useState(defaults.expectedIncome);

  const leftover = income - required;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="size-4" /> Planejar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            Planejar {monthLabel}
          </DialogTitle>
          <DialogDescription>
            Responda às perguntas-chave para prever o mês.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="month" value={month} />

          <PlanField
            name="expectedIncome"
            label="Quanto vou receber?"
            hint="Ganhos previstos"
            defaultValue={defaults.expectedIncome}
            onChange={setIncome}
          />
          <PlanField
            name="plannedSpend"
            label="Quanto pretendo gastar?"
            hint="Orçamento teto"
            defaultValue={defaults.plannedSpend}
          />
          <PlanField
            name="requiredSpend"
            label="Quanto preciso gastar?"
            hint="Despesas fixas/obrigatórias"
            defaultValue={defaults.requiredSpend}
            onChange={setRequired}
          />

          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
            <span className="text-sm font-medium">
              {leftover >= 0 ? "Vai sobrar" : "Pode faltar"}
            </span>
            <span
              className={`font-numeric text-lg font-bold ${
                leftover >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {formatBRL(Math.abs(leftover))}
            </span>
          </div>

          {state.error && (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
              {state.error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Salvar planejamento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PlanField({
  name,
  label,
  hint,
  defaultValue,
  onChange,
}: {
  name: string;
  label: string;
  hint: string;
  defaultValue: number;
  onChange?: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          R$
        </span>
        <Input
          id={name}
          name={name}
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          defaultValue={defaultValue || ""}
          placeholder="0,00"
          className="pl-9 font-numeric"
          onChange={(e) => onChange?.(Number(e.target.value) || 0)}
        />
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
