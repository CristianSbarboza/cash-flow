import type { Metadata } from "next";

import { requireUserId } from "@/lib/session";
import { getTransactions } from "@/lib/queries";
import { TransactionList } from "@/components/transactions/transaction-list";

export const metadata: Metadata = { title: "Extrato — Cash Flow" };

export default async function ExtratoPage() {
  const userId = await requireUserId();
  const transactions = await getTransactions(userId);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Extrato</h1>
        <p className="text-sm text-muted-foreground">
          Todos os seus lançamentos, filtráveis por situação.
        </p>
      </header>

      <TransactionList
        transactions={transactions.map((t) => ({
          id: t.id,
          description: t.description,
          amountCents: t.amountCents,
          status: t.status,
          category: t.category,
          allocation: t.allocation,
          createdAt: t.createdAt,
        }))}
      />
    </div>
  );
}
