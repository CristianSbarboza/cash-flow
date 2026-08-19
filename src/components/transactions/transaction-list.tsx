"use client";

import { useMemo, useState } from "react";
import { Receipt } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import {
  TransactionItem,
  type TransactionItemData,
} from "@/components/transactions/transaction-item";

const FILTERS = [
  { value: "all", label: "Todos" },
  { value: "PAGO", label: "Pagou" },
  { value: "RECEBIDO", label: "Recebeu" },
  { value: "DEVENDO", label: "Devendo" },
  { value: "RECEBIMENTO_FUTURO", label: "A receber" },
] as const;

export function TransactionList({
  transactions,
}: {
  transactions: TransactionItemData[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? transactions
        : transactions.filter((t) => t.status === filter),
    [transactions, filter],
  );

  return (
    <div className="space-y-4">
      <Tabs value={filter} onValueChange={setFilter}>
        <div className="-mx-4 overflow-x-auto px-4 no-scrollbar">
          <TabsList className="w-max">
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Receipt className="size-5" />}
          title="Nada por aqui"
          description="Nenhum lançamento neste filtro."
        />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card px-4">
          {filtered.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
}
