"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { allocationSchema } from "@/lib/validations";
import type { ActionResult } from "@/actions/transactions";

export async function upsertAllocation(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await requireUserId();
  const id = (formData.get("id") as string) || null;

  const parsed = allocationSchema.safeParse({
    name: formData.get("name"),
    current: formData.get("current") ?? 0,
    target: formData.get("target") || undefined,
    color: formData.get("color") || "emerald",
    icon: formData.get("icon") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Verifique os campos.",
    };
  }

  const { name, current, target, color, icon } = parsed.data;
  const data = {
    name,
    currentCents: Math.round(current * 100),
    targetCents: target != null ? Math.round(target * 100) : null,
    color,
    icon: icon || null,
  };

  if (id) {
    await prisma.allocation.updateMany({ where: { id, userId }, data });
  } else {
    await prisma.allocation.create({ data: { ...data, userId } });
  }

  revalidatePath("/objetivos");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteAllocation(id: string): Promise<ActionResult> {
  const userId = await requireUserId();
  await prisma.allocation.deleteMany({ where: { id, userId } });
  revalidatePath("/objetivos");
  revalidatePath("/");
  return { ok: true };
}
