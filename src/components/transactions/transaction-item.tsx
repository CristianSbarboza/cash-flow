"use client";

import { useTransition } from "react";
import {
  CheckCircle2,
  MoreVertical,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import {
  deleteTransaction,
  settleTransaction,
} from "@/actions/transactions";
import { STATUS_META } from "@/lib/transaction-meta";
import { Badge } from "@/components/ui/badge";
import { cn, formatBRL } from "@/lib/utils";
import type { TransactionStatus } from "@prisma/client";

export type TransactionItemData = {
  id: string;
  description: string;
  amountCents: number;
  status: TransactionStatus;
  category: string | null;
  allocation: { name: string } | null;
  createdAt: Date;
};

export function TransactionItem({ tx }: { tx: TransactionItemData }) {
  const [pending, startTransition] = useTransition();
  const meta = STATUS_META[tx.status];
  const isOut = meta.direction === "out";
  const amount = tx.amountCents / 100;
  const canSettle = !meta.settled;

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3 transition-opacity",
        pending && "opacity-50",
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full",
          isOut ? "bg-danger/10 text-danger" : "bg-success/10 text-success",
        )}
      >
        {isOut ? (
          <ArrowUpRight className="size-5" />
        ) : (
          <ArrowDownLeft className="size-5" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{tx.description}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <Badge variant={meta.variant}>{meta.label}</Badge>
          {tx.allocation ? (
            <span className="truncate text-xs text-muted-foreground">
              · {tx.allocation.name}
            </span>
          ) : (
            tx.category && (
              <span className="truncate text-xs text-muted-foreground">
                · {tx.category}
              </span>
            )
          )}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={cn(
            "font-numeric font-semibold",
            isOut ? "text-danger" : "text-success",
          )}
        >
          {isOut ? "−" : "+"}
          {formatBRL(amount)}
        </p>
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Ações"
          >
            <MoreVertical className="size-4" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={4}
            className="z-50 min-w-44 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=open]:fade-in-0"
          >
            {canSettle && (
              <DropdownMenu.Item
                onSelect={() =>
                  startTransition(() => {
                    settleTransaction(tx.id);
                  })
                }
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-none focus:bg-accent"
              >
                <CheckCircle2 className="size-4 text-success" />
                {isOut ? "Marcar como pago" : "Confirmar recebimento"}
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item
              onSelect={() =>
                startTransition(() => {
                  deleteTransaction(tx.id);
                })
              }
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-danger outline-none focus:bg-danger/10"
            >
              <Trash2 className="size-4" />
              Excluir
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
