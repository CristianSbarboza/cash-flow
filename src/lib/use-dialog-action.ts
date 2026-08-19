"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/actions/transactions";

type ServerAction = (
  prev: ActionResult,
  formData: FormData,
) => Promise<ActionResult>;

/**
 * Executa uma Server Action a partir de um formulário e fecha o diálogo
 * quando ela retorna sucesso — sem usar setState dentro de useEffect.
 */
export function useDialogAction(action: ServerAction, onSuccess: () => void) {
  const [state, setState] = useState<ActionResult>({ ok: false });
  const [pending, startTransition] = useTransition();

  const formAction = (formData: FormData) => {
    startTransition(async () => {
      const result = await action({ ok: false }, formData);
      setState(result);
      if (result.ok) onSuccess();
    });
  };

  return { state, pending, formAction };
}
