import { z } from "zod";

// ------------------------------------------------------------------
//  Regra de senha forte (reutilizada na UI e no backend)
// ------------------------------------------------------------------

export const passwordRules = [
  {
    id: "length",
    label: "Mínimo de 8 caracteres",
    test: (v: string) => v.length >= 8,
  },
  {
    id: "uppercase",
    label: "Uma letra maiúscula",
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    id: "lowercase",
    label: "Uma letra minúscula",
    test: (v: string) => /[a-z]/.test(v),
  },
  {
    id: "number",
    label: "Um número",
    test: (v: string) => /[0-9]/.test(v),
  },
  {
    id: "special",
    label: "Um caractere especial (@, #, $, %…)",
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
] as const;

export const strongPassword = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.")
  .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula.")
  .regex(/[a-z]/, "Inclua ao menos uma letra minúscula.")
  .regex(/[0-9]/, "Inclua ao menos um número.")
  .regex(/[^A-Za-z0-9]/, "Inclua ao menos um caractere especial.");

// ------------------------------------------------------------------
//  Auth
// ------------------------------------------------------------------

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "O nome deve ter pelo menos 2 caracteres.")
      .max(40, "O nome deve ter no máximo 40 caracteres."),
    password: strongPassword,
    confirmPassword: z.string(),
    openingBalance: z.coerce
      .number()
      .min(0, "O saldo inicial não pode ser negativo.")
      .default(0),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome."),
  password: z.string().min(1, "Informe sua senha."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// ------------------------------------------------------------------
//  Domínio financeiro
// ------------------------------------------------------------------

export const transactionStatusEnum = z.enum([
  "PAGO",
  "RECEBIDO",
  "DEVENDO",
  "RECEBIMENTO_FUTURO",
]);

export const transactionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Descreva o lançamento.")
    .max(80, "Descrição muito longa."),
  amount: z.coerce
    .number()
    .positive("O valor deve ser maior que zero."),
  status: transactionStatusEnum,
  category: z.string().trim().max(40).optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
  allocationId: z.string().optional().or(z.literal("")),
});

export const allocationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Dê um nome ao objetivo.")
    .max(40, "Nome muito longo."),
  current: z.coerce.number().min(0, "Valor não pode ser negativo.").default(0),
  target: z.coerce.number().min(0).optional(),
  color: z.string().default("emerald"),
  icon: z.string().optional().or(z.literal("")),
});

export const monthlyPlanSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Mês inválido."),
  plannedSpend: z.coerce.number().min(0).default(0),
  requiredSpend: z.coerce.number().min(0).default(0),
  expectedIncome: z.coerce.number().min(0).default(0),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type AllocationInput = z.infer<typeof allocationSchema>;
export type MonthlyPlanInput = z.infer<typeof monthlyPlanSchema>;
