import { Brand } from "@/components/brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      {/* brilho esmeralda sutil ao fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,var(--primary)/12%,transparent)]"
      />
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Brand className="scale-110" />
          <p className="text-sm text-muted-foreground">
            Sua liquidez, sob controle.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
