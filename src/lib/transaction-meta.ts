import type { TransactionStatus } from "@prisma/client";

type BadgeVariant = "success" | "danger" | "future" | "gold";

export const STATUS_META: Record<
  TransactionStatus,
  {
    label: string;
    variant: BadgeVariant;
    direction: "in" | "out";
    /** true quando afeta o Saldo Disponível (liquidez atual). */
    settled: boolean;
  }
> = {
  PAGO: { label: "Pago", variant: "danger", direction: "out", settled: true },
  DEVENDO: {
    label: "Devendo",
    variant: "gold",
    direction: "out",
    settled: false,
  },
  RECEBIDO: {
    label: "Recebido",
    variant: "success",
    direction: "in",
    settled: true,
  },
  RECEBIMENTO_FUTURO: {
    label: "A receber",
    variant: "future",
    direction: "in",
    settled: false,
  },
};

export const EXPENSE_STATUSES: TransactionStatus[] = ["PAGO", "DEVENDO"];
export const INCOME_STATUSES: TransactionStatus[] = [
  "RECEBIDO",
  "RECEBIMENTO_FUTURO",
];
