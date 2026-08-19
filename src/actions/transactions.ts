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

  await prisma.transaction.create({
    data: {
      userId,
      description,
      amountCents: Math.round(amount * 100),
      status,
      category: category || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      allocationId: allocationId || null,
    },
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

  await prisma.transaction.update({
    where: { id },
    data: { status: nextStatus },
  });

  revalidateApp();
  return { ok: true };
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  const userId = await requireUserId();
  await prisma.transaction.deleteMany({ where: { id, userId } });
  revalidateApp();
  return { ok: true };
}
