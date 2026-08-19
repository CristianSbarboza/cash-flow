import {
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Lock,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import type { WalletSummary } from "@/lib/queries";
import { formatBRL } from "@/lib/utils";
import { MetricStat } from "@/components/wallet/metric-stat";
import { HeroBalance } from "@/components/wallet/hero-balance";

export function BalanceCard({ summary }: { summary: WalletSummary }) {
  const isNegative = summary.projected < 0;

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
        <HeroBalance
          value={formatBRL(summary.available)}
          formula="Saldo inicial + Recebido − Pago."
        />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MetricStat
            icon={<Lock className="size-3.5" />}
            label="Carimbado"
            value={formatBRL(summary.allocated)}
            formula="Soma do valor carimbado em todos os seus objetivos."
          />
          <MetricStat
            icon={<Wallet className="size-3.5" />}
            label="Livre"
            value={formatBRL(summary.unallocated)}
            formula="Saldo disponível − Carimbado."
          />
          <MetricStat
            icon={<ArrowDownLeft className="size-3.5" />}
            label="A receber"
            value={formatBRL(summary.pendingIn)}
            formula="Soma das transações com status 'Recebimento futuro'."
          />
          <MetricStat
            icon={<ArrowUpRight className="size-3.5" />}
            label="A pagar"
            value={formatBRL(summary.pendingOut)}
            formula="Soma das transações com status 'Devendo'."
          />
          <MetricStat
            danger={isNegative}
            icon={
              isNegative ? (
                <TrendingDown className="size-3.5" />
              ) : (
                <TrendingUp className="size-3.5" />
              )
            }
            label="Saldo projetado"
            value={`${isNegative ? "−" : ""}${formatBRL(Math.abs(summary.projected))}`}
            formula="Saldo disponível − Carimbado − A pagar + A receber."
          />
          <MetricStat
            icon={<Coins className="size-3.5" />}
            label="Total recebido"
            value={formatBRL(summary.totalReceived)}
            formula="Soma de tudo que você já recebeu (transações com status 'Recebido') desde o início, sem descontar gastos."
          />
        </div>
      </div>
    </section>
  );
}
