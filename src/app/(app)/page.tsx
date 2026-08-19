import Link from "next/link";
import { Receipt, ArrowRight } from "lucide-react";

import { requireUserId } from "@/lib/session";
import {
  getAllocations,
  getRecentTransactions,
  getWalletSummary,
} from "@/lib/queries";
import { BalanceCard } from "@/components/wallet/balance-card";
import { ProjectedBalanceCard } from "@/components/wallet/projected-balance-card";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { TransactionItem } from "@/components/transactions/transaction-item";
import { EmptyState } from "@/components/ui/empty-state";

export default async function HomePage() {
  const userId = await requireUserId();
  const [summary, recent, allocations] = await Promise.all([
    getWalletSummary(userId),
    getRecentTransactions(userId),
    getAllocations(userId),
  ]);

  const allocationOptions = allocations.map((a) => ({
    id: a.id,
    name: a.name,
  }));

  return (
    <div className="space-y-6">
      <BalanceCard summary={summary} />
      <ProjectedBalanceCard summary={summary} />

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 gap-3">
        <TransactionDialog kind="expense" allocations={allocationOptions} />
        <TransactionDialog kind="income" />
      </div>

      {/* Últimos lançamentos */}
      <section>
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Últimos lançamentos
          </h2>
          <Link
            href="/extrato"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Ver extrato <ArrowRight className="size-3" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon={<Receipt className="size-5" />}
            title="Nenhum lançamento ainda"
            description="Adicione seu primeiro gasto ou recebimento acima para começar a acompanhar seu fluxo."
          />
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border bg-card px-4">
            {recent.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
