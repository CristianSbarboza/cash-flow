import { auth } from "@/auth";
import { AppHeader } from "@/components/nav/app-header";
import { BottomNav } from "@/components/nav/bottom-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader userName={session?.user?.name} />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-28 pt-5">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
