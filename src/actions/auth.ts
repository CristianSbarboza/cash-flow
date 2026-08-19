"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema, loginSchema } from "@/lib/validations";

export type AuthState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/** Cadastro: apenas Nome + Senha (com regra de senha forte). */
export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    openingBalance: formData.get("openingBalance") ?? 0,
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Verifique os campos destacados.",
    };
  }

  const { name, password, openingBalance } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { name } });
  if (existing) {
    return {
      ok: false,
      fieldErrors: { name: ["Este nome já está em uso."] },
      error: "Este nome já está em uso.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      passwordHash,
      openingBalanceCents: Math.round(openingBalance * 100),
    },
  });

  // Autentica automaticamente após o cadastro.
  try {
    await signIn("credentials", { name, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Conta criada, mas falha ao entrar." };
    }
    throw error; // redirect do Next precisa propagar
  }

  return { ok: true };
}

/** Login: Nome + Senha. */
export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Verifique os campos destacados.",
    };
  }

  try {
    await signIn("credentials", {
      name: parsed.data.name,
      password: parsed.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Nome ou senha inválidos." };
    }
    throw error;
  }

  return { ok: true };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
