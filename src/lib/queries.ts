import "server-only";

import { prisma } from "@/lib/prisma";
import { monthKey } from "@/lib/utils";
import type { Transaction, Allocation, MonthlyPlan } from "@prisma/client";

export type WalletSummary = {
  /** Saldo Disponível (liquidez atual), em reais. */
  available: number;
  /** Total já "carimbado" em envelopes/objetivos. */
  allocated: number;
  /** Saldo livre (disponível − carimbado). */
  unallocated: number;
  /** Total a pagar (DEVENDO). */
  pendingOut: number;
  /** Total a receber (RECEBIMENTO_FUTURO). */
  pendingIn: number;
  /** Projeção de saldo caso tudo pendente se realize. */
  projected: number;
};

const toReais = (cents: number) => cents / 100;

/** Calcula o resumo da carteira: liquidez, carimbado, pendências e projeção. */
export async function getWalletSummary(userId: string): Promise<WalletSummary> {
  const [user, grouped, allocAgg] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { openingBalanceCents: true },
    }),
    prisma.transaction.groupBy({
      by: ["status"],
      where: { userId },
      _sum: { amountCents: true },
    }),
    prisma.allocation.aggregate({
      where: { userId },
      _sum: { currentCents: true },
    }),
  ]);

  const sums = Object.fromEntries(
    grouped.map((g) => [g.status, g._sum.amountCents ?? 0]),
  );

  const received = sums["RECEBIDO"] ?? 0;
  const paid = sums["PAGO"] ?? 0;
  const pendingOut = sums["DEVENDO"] ?? 0;
  const pendingIn = sums["RECEBIMENTO_FUTURO"] ?? 0;

  const availableCents = user.openingBalanceCents + received - paid;
  const allocatedCents = allocAgg._sum.currentCents ?? 0;

  return {
    available: toReais(availableCents),
    allocated: toReais(allocatedCents),
    unallocated: toReais(availableCents - allocatedCents),
    pendingOut: toReais(pendingOut),
    pendingIn: toReais(pendingIn),
    projected: toReais(availableCents - pendingOut + pendingIn),
  };
}

/** Últimos lançamentos (para a Home). */
export function getRecentTransactions(userId: string, take = 6) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    include: { allocation: { select: { name: true } } },
  });
}

export type TransactionWithAllocation = Transaction & {
  allocation: { name: string } | null;
};

/** Lançamentos, opcionalmente filtrados por status (para o Extrato). */
export function getTransactions(userId: string, status?: string) {
  return prisma.transaction.findMany({
    where: {
      userId,
      ...(status ? { status: status as Transaction["status"] } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { allocation: { select: { name: true } } },
  });
}

export function getAllocations(userId: string): Promise<Allocation[]> {
  return prisma.allocation.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

/** Plano do mês atual (ou null se ainda não preenchido). */
export function getMonthlyPlan(
  userId: string,
  month = monthKey(new Date()),
): Promise<MonthlyPlan | null> {
  return prisma.monthlyPlan.findUnique({
    where: { userId_month: { userId, month } },
  });
}

/** Série mensal de gastos x ganhos (para o gráfico do Dashboard). */
export async function getMonthlySeries(userId: string, months = 6) {
  const txs = await prisma.transaction.findMany({
    where: {
      userId,
      status: { in: ["PAGO", "RECEBIDO"] },
    },
    select: { amountCents: true, status: true, createdAt: true },
  });

  const now = new Date();
  const buckets: { key: string; label: string; gastos: number; ganhos: number }[] =
    [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: monthKey(d),
      label: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(d),
      gastos: 0,
      ganhos: 0,
    });
  }

  const index = new Map(buckets.map((b) => [b.key, b]));
  for (const tx of txs) {
    const b = index.get(monthKey(tx.createdAt));
    if (!b) continue;
    if (tx.status === "PAGO") b.gastos += tx.amountCents / 100;
    else if (tx.status === "RECEBIDO") b.ganhos += tx.amountCents / 100;
  }

  return buckets;
}

/** Totais do mês corrente (gasto x ganho realizados). */
export async function getCurrentMonthTotals(userId: string) {
  const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const grouped = await prisma.transaction.groupBy({
    by: ["status"],
    where: {
      userId,
      status: { in: ["PAGO", "RECEBIDO"] },
      createdAt: { gte: start },
    },
    _sum: { amountCents: true },
  });
  const sums = Object.fromEntries(
    grouped.map((g) => [g.status, (g._sum.amountCents ?? 0) / 100]),
  );
  return {
    spent: sums["PAGO"] ?? 0,
    earned: sums["RECEBIDO"] ?? 0,
  };
}
