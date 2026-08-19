import type { Metadata } from "next";
import {
  TrendingDown,
  TrendingUp,
  Target,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import { requireUserId } from "@/lib/session";
import {
  getCurrentMonthTotals,
  getMonthlyPlan,
  getMonthlySeries,
} from "@/lib/queries";
import { formatBRL, formatMonthLabel, monthKey } from "@/lib/utils";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { PlanDialog } from "@/components/dashboard/plan-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Painel — Fluxo" };

export default async function DashboardPage() {
  const userId = await requireUserId();
  const now = new Date();
  const month = monthKey(now);
  const monthLabel = formatMonthLabel(now);

  const [series, totals, plan] = await Promise.all([
    getMonthlySeries(userId, 6),
    getCurrentMonthTotals(userId),
    getMonthlyPlan(userId, month),
  ]);

  const planned = (plan?.plannedSpendCents ?? 0) / 100;
  const required = (plan?.requiredSpendCents ?? 0) / 100;
  const expectedIncome = (plan?.expectedIncomeCents ?? 0) / 100;
  const leftover = expectedIncome - required;

  // Economia x Estouro (gasto realizado vs orçamento teto)
  const overspent = planned > 0 && totals.spent > planned;
  const overAmount = totals.spent - planned;
  const savedPct =
    planned > 0 ? Math.max(0, Math.round((1 - totals.spent / planned) * 100)) : 0;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel</h1>
          <p className="text-sm capitalize text-muted-foreground">{monthLabel}</p>
        </div>
        <PlanDialog
          month={month}
          monthLabel={monthLabel}
          defaults={{
            plannedSpend: planned,
            requiredSpend: required,
            expectedIncome,
          }}
        />
      </header>

      {/* Indicador Economia x Estouro */}
      {planned > 0 ? (
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border p-4",
            overspent
              ? "border-danger/25 bg-danger/8"
              : "border-success/25 bg-success/8",
          )}
        >
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full",
              overspent
                ? "bg-danger/15 text-danger"
                : "bg-success/15 text-success",
            )}
          >
            {overspent ? (
              <TrendingDown className="size-5" />
            ) : (
              <TrendingUp className="size-5" />
            )}
          </span>
          <div>
            {overspent ? (
              <>
                <p className="font-semibold text-danger">
                  Atenção: orçamento estourado
                </p>
                <p className="text-sm text-muted-foreground">
                  Você passou{" "}
                  <span className="font-numeric font-semibold text-danger">
                    {formatBRL(overAmount)}
                  </span>{" "}
                  do seu teto de {formatBRL(planned)}.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-success">
                  Economizando {savedPct}% este mês
                </p>
                <p className="text-sm text-muted-foreground">
                  Gastou {formatBRL(totals.spent)} de {formatBRL(planned)}{" "}
                  planejados.
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4">
          <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
            <Target className="size-5" />
          </span>
          <div>
            <p className="font-medium">Defina seu planejamento</p>
            <p className="text-sm text-muted-foreground">
              Toque em “Planejar” para prever gastos e ganhos do mês.
            </p>
          </div>
        </div>
      )}

      {/* Gráfico Gastos x Ganhos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Gastos x Ganhos</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyChart data={series} />
        </CardContent>
      </Card>

      {/* Totais do mês */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<ArrowDownRight className="size-4" />}
          tone="success"
          label="Recebido no mês"
          value={formatBRL(totals.earned)}
        />
        <MetricCard
          icon={<ArrowUpRight className="size-4" />}
          tone="danger"
          label="Gasto no mês"
          value={formatBRL(totals.spent)}
        />
      </div>

      {/* Planejamento do mês */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Planejamento do mês
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <PlanCard label="Pretendido" value={planned} tone="muted" />
          <PlanCard label="Necessário" value={required} tone="muted" />
          <PlanCard
            label={leftover >= 0 ? "Vai sobrar" : "Pode faltar"}
            value={Math.abs(leftover)}
            tone={leftover >= 0 ? "success" : "danger"}
          />
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "success" | "danger";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span className={tone === "success" ? "text-success" : "text-danger"}>
          {icon}
        </span>
        {label}
      </div>
      <p className="mt-1 font-numeric text-lg font-bold">{value}</p>
    </div>
  );
}

function PlanCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "muted" | "success" | "danger";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 font-numeric text-sm font-bold",
          tone === "success" && "text-success",
          tone === "danger" && "text-danger",
        )}
      >
        {formatBRL(value)}
      </p>
    </div>
  );
}
