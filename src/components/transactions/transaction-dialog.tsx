"use client";

import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Loader2, Plus } from "lucide-react";

import { createTransaction } from "@/actions/transactions";
import { useDialogAction } from "@/lib/use-dialog-action";
import {
  EXPENSE_STATUSES,
  INCOME_STATUSES,
  STATUS_META,
} from "@/lib/transaction-meta";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Kind = "expense" | "income";
type AllocationOption = { id: string; name: string };

export function TransactionDialog({
  kind,
  allocations = [],
}: {
  kind: Kind;
  allocations?: AllocationOption[];
}) {
  const [open, setOpen] = useState(false);
  const { state, pending, formAction } = useDialogAction(createTransaction, () =>
    setOpen(false),
  );

  const statuses = kind === "expense" ? EXPENSE_STATUSES : INCOME_STATUSES;
  const [status, setStatus] = useState(statuses[0]);
  const [allocationId, setAllocationId] = useState<string>("");

  const isExpense = kind === "expense";
  const showDueDate = status === "DEVENDO" || status === "RECEBIMENTO_FUTURO";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isExpense ? "outline" : "default"}
          className={cn(
            "h-auto flex-col items-start gap-1 py-3.5 text-left",
            isExpense &&
              "border-danger/25 bg-danger/5 text-danger hover:bg-danger/10 hover:text-danger",
          )}
        >
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            {isExpense ? (
              <ArrowUpCircle className="size-4" />
            ) : (
              <ArrowDownCircle className="size-4" />
            )}
            {isExpense ? "Gasto / Dívida" : "Recebimento"}
          </span>
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-normal opacity-80",
              isExpense ? "text-danger/80" : "text-primary-foreground/80",
            )}
          >
            <Plus className="size-3" /> Novo lançamento
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isExpense ? "Adicionar gasto ou dívida" : "Adicionar recebimento"}
          </DialogTitle>
          <DialogDescription>
            {isExpense
              ? "Registre uma saída. Gastos pagos debitam o saldo na hora."
              : "Registre uma entrada. Recebimentos confirmados somam ao saldo."}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="allocationId" value={allocationId} />

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              name="description"
              placeholder={isExpense ? "Ex.: Mercado" : "Ex.: Salário"}
              aria-invalid={!!state.fieldErrors?.description}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  R$
                </span>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  inputMode="decimal"
                  placeholder="0,00"
                  className="pl-8 font-numeric"
                  aria-invalid={!!state.fieldErrors?.amount}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Situação</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as typeof status)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_META[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div
            className={cn(
              "grid gap-3",
              showDueDate ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            <div className="space-y-2">
              <Label htmlFor="category">Categoria (opcional)</Label>
              <Input
                id="category"
                name="category"
                placeholder="Ex.: Alimentação"
              />
            </div>
            {showDueDate && (
              <div className="space-y-2">
                <Label htmlFor="dueDate">
                  {isExpense ? "Vencimento" : "Previsão"}
                </Label>
                <Input id="dueDate" name="dueDate" type="date" />
              </div>
            )}
          </div>

          {isExpense && allocations.length > 0 && (
            <div className="space-y-2">
              <Label>Atribuir a um objetivo (opcional)</Label>
              <Select value={allocationId} onValueChange={setAllocationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  {allocations.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {allocationId && (
                <p className="text-xs text-muted-foreground">
                  {status === "PAGO"
                    ? "O valor sai do carimbado deste objetivo agora."
                    : "Só desconta do carimbado quando você marcar como pago."}
                </p>
              )}
            </div>
          )}

          {state.error && (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            variant={isExpense ? "destructive" : "default"}
            disabled={pending}
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            Salvar lançamento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
