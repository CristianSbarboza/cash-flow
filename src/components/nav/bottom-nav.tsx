"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PieChart, Target, ReceiptText } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/dashboard", label: "Painel", icon: PieChart },
  { href: "/objetivos", label: "Objetivos", icon: Target },
  { href: "/extrato", label: "Extrato", icon: ReceiptText },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/85 backdrop-blur-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid place-items-center rounded-full px-4 py-1 transition-colors",
                    active && "bg-primary/12",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
