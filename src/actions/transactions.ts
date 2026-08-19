"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { transactionSchema } from "@/lib/validations";

export type ActionResult = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function revalidateApp() {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/extrato");
  revalidatePath("/objetivos");
}

export async function createTransaction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await requireUserId();

  const parsed = transactionSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    status: formData.get("status"),
    category: formData.get("category") ?? "",
    dueDate: formData.get("dueDate") ?? "",
    allocationId: formData.get("allocationId") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Verifique os campos.",
    };
  }

  const { description, amount, status, category, dueDate, allocationId } =
    parsed.data;
  const amountCents = Math.round(amount * 100);

  await prisma.$transaction(async (db) => {
    await db.transaction.create({
      data: {
        userId,
        description,
        amountCents,
        status,
        category: category || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        allocationId: allocationId || null,
      },
    });

    // Um gasto já pago consome de fato a reserva do objetivo.
    // Enquanto está DEVENDO, o vínculo é só um sinal de intenção —
    // o dinheiro ainda não saiu, então o carimbado não muda.
    if (status === "PAGO" && allocationId) {
      await db.allocation.updateMany({
        where: { id: allocationId, userId },
        data: { currentCents: { decrement: amountCents } },
      });
    }
  });

  revalidateApp();
  return { ok: true };
}

/** Liquida uma pendência: DEVENDO → PAGO ou RECEBIMENTO_FUTURO → RECEBIDO. */
export async function settleTransaction(id: string): Promise<ActionResult> {
  const userId = await requireUserId();

  const tx = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!tx) return { ok: false, error: "Lançamento não encontrado." };

  const nextStatus =
    tx.status === "DEVENDO"
      ? "PAGO"
      : tx.status === "RECEBIMENTO_FUTURO"
        ? "RECEBIDO"
        : null;

  if (!nextStatus) {
    return { ok: false, error: "Este lançamento já foi liquidado." };
  }

  await prisma.$transaction(async (db) => {
    await db.transaction.update({
      where: { id },
      data: { status: nextStatus },
    });

    // Só ao efetivamente pagar (DEVENDO → PAGO) o valor sai do carimbado.
    if (nextStatus === "PAGO" && tx.allocationId) {
      await db.allocation.updateMany({
        where: { id: tx.allocationId, userId },
        data: { currentCents: { decrement: tx.amountCents } },
      });
    }
  });

  revalidateApp();
  return { ok: true };
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  const userId = await requireUserId();

  const tx = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!tx) return { ok: false, error: "Lançamento não encontrado." };

  await prisma.$transaction(async (db) => {
    await db.transaction.delete({ where: { id } });

    // Excluir um gasto já pago devolve o valor pro carimbado do objetivo.
    if (tx.status === "PAGO" && tx.allocationId) {
      await db.allocation.updateMany({
        where: { id: tx.allocationId, userId },
        data: { currentCents: { increment: tx.amountCents } },
      });
    }
  });

  revalidateApp();
  return { ok: true };
}
