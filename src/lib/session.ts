import { auth } from "@/auth";

/** Retorna o id do usuário autenticado ou lança (rotas já são protegidas pelo middleware). */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user.id;
}
