import type { Metadata } from "next";
import { Target, Lock } from "lucide-react";

import { requireUserId } from "@/lib/session";
import { getAllocations, getWalletSummary } from "@/lib/queries";
import { formatBRL } from "@/lib/utils";
import { AllocationDialog } from "@/components/allocations/allocation-dialog";
import { AllocationCard } from "@/components/allocations/allocation-card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Objetivos — Cash Flow" };

export default async function ObjetivosPage() {
  const userId = await requireUserId();
  const [allocations, summary] = await Promise.all([
    getAllocations(userId),
    getWalletSummary(userId),
  ]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Objetivos</h1>
        <p className="text-sm text-muted-foreground">
          Para que serve o seu dinheiro? Carimbe cada real.
        </p>
      </header>

      {/* Resumo carimbado x livre */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Lock className="size-3.5" /> Carimbado
          </div>
          <p className="mt-1 font-numeric text-lg font-bold text-primary">
            {formatBRL(summary.allocated)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Target className="size-3.5" /> Livre no saldo
          </div>
          <p className="mt-1 font-numeric text-lg font-bold">
            {formatBRL(summary.unallocated)}
          </p>
        </div>
      </div>

      <AllocationDialog />

      {allocations.length === 0 ? (
        <EmptyState
          icon={<Target className="size-5" />}
          title="Nenhum objetivo ainda"
          description="Crie envelopes como Reserva de Emergência, Livros ou Viagem e distribua seu saldo."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {allocations.map((a) => (
            <AllocationCard
              key={a.id}
              allocation={{
                id: a.id,
                name: a.name,
                currentCents: a.currentCents,
                targetCents: a.targetCents,
                color: a.color,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
