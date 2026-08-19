import { TrendingDown, TrendingUp } from "lucide-react";

import type { WalletSummary } from "@/lib/queries";
import { cn, formatBRL } from "@/lib/utils";

export function ProjectedBalanceCard({ summary }: { summary: WalletSummary }) {
  const isNegative = summary.projected < 0;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3.5",
        isNegative
          ? "border-danger/25 bg-danger/8"
          : "border-primary/20 bg-primary/6",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full",
            isNegative
              ? "bg-danger/15 text-danger"
              : "bg-primary/15 text-primary",
          )}
        >
          {isNegative ? (
            <TrendingDown className="size-4" />
          ) : (
            <TrendingUp className="size-4" />
          )}
        </span>
        <div>
          <p className="text-sm font-medium">Saldo projetado</p>
          <p className="text-xs text-muted-foreground">
            Disponível − a pagar + a receber
          </p>
        </div>
      </div>

      <p
        className={cn(
          "font-numeric text-lg font-bold",
          isNegative ? "text-danger" : "text-primary",
        )}
      >
        {isNegative && "−"}
        {formatBRL(Math.abs(summary.projected))}
      </p>
    </div>
  );
}
