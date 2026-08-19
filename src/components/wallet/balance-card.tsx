import { ArrowDownLeft, ArrowUpRight, Lock, Wallet } from "lucide-react";

import type { WalletSummary } from "@/lib/queries";
import { formatBRL } from "@/lib/utils";

export function BalanceCard({ summary }: { summary: WalletSummary }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#065F46] p-6 text-emerald-50 shadow-lg dark:bg-[#064e3b]">
      {/* textura de fluxo ao fundo */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-48 w-64 opacity-20"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M0 120c40 0 40-60 80-60s40 60 80 60 40-60 80-60"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M0 80c40 0 40-60 80-60s40 60 80 60 40-60 80-60"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      <div className="relative">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-100/80">
          <Wallet className="size-4" />
          Saldo disponível
        </div>
        <p className="mt-1 font-numeric text-4xl font-bold tracking-tight">
          {formatBRL(summary.available)}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniStat
            icon={<Lock className="size-3.5" />}
            label="Carimbado"
            value={formatBRL(summary.allocated)}
          />
          <MiniStat
            icon={<Wallet className="size-3.5" />}
            label="Livre"
            value={formatBRL(summary.unallocated)}
          />
          <MiniStat
            icon={<ArrowDownLeft className="size-3.5" />}
            label="A receber"
            value={formatBRL(summary.pendingIn)}
          />
          <MiniStat
            icon={<ArrowUpRight className="size-3.5" />}
            label="A pagar"
            value={formatBRL(summary.pendingOut)}
          />
        </div>
      </div>
    </section>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-100/75">
        {icon}
        {label}
      </div>
      <p className="mt-0.5 font-numeric text-sm font-semibold">{value}</p>
    </div>
  );
}
