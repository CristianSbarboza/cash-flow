"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { monthlyPlanSchema } from "@/lib/validations";
import type { ActionResult } from "@/actions/transactions";

export async function upsertMonthlyPlan(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await requireUserId();

  const parsed = monthlyPlanSchema.safeParse({
    month: formData.get("month"),
    plannedSpend: formData.get("plannedSpend") ?? 0,
    requiredSpend: formData.get("requiredSpend") ?? 0,
    expectedIncome: formData.get("expectedIncome") ?? 0,
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Verifique os campos.",
    };
  }

  const { month, plannedSpend, requiredSpend, expectedIncome } = parsed.data;

  const data = {
    plannedSpendCents: Math.round(plannedSpend * 100),
    requiredSpendCents: Math.round(requiredSpend * 100),
    expectedIncomeCents: Math.round(expectedIncome * 100),
  };

  await prisma.monthlyPlan.upsert({
    where: { userId_month: { userId, month } },
    create: { userId, month, ...data },
    update: data,
  });

  revalidatePath("/dashboard");
  return { ok: true };
}
