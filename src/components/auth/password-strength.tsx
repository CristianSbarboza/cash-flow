"use client";

import { Check, Circle } from "lucide-react";

import { passwordRules } from "@/lib/validations";
import { cn } from "@/lib/utils";

export function PasswordStrength({ value }: { value: string }) {
  const passed = passwordRules.filter((r) => r.test(value)).length;
  const total = passwordRules.length;
  const pct = value.length === 0 ? 0 : (passed / total) * 100;

  const barColor =
    passed <= 2 ? "bg-danger" : passed < total ? "bg-gold" : "bg-success";

  const label =
    value.length === 0
      ? "Crie uma senha forte"
      : passed <= 2
        ? "Senha fraca"
        : passed < total
          ? "Quase lá"
          : "Senha forte";

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="ml-3 shrink-0 text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {passwordRules.map((rule) => {
          const ok = rule.test(value);
          return (
            <li
              key={rule.id}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-colors",
                ok ? "text-success" : "text-muted-foreground",
              )}
            >
              {ok ? (
                <Check className="size-3.5 shrink-0" />
              ) : (
                <Circle className="size-3.5 shrink-0 opacity-50" />
              )}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
