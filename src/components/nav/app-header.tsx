import { LogOut } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/nav/theme-toggle";

export function AppHeader({ userName }: { userName?: string | null }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Brand />
        <div className="flex items-center gap-1">
          {userName && (
            <span className="mr-1 hidden text-sm text-muted-foreground sm:inline">
              Olá, <span className="font-medium text-foreground">{userName}</span>
            </span>
          )}
          <ThemeToggle />
          <form action={logoutAction}>
            <Button variant="ghost" size="icon" aria-label="Sair" type="submit">
              <LogOut className="size-5" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
