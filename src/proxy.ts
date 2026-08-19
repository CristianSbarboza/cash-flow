import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Next.js 16 renomeou a convenção "middleware" para "proxy".
// Usa apenas a config edge-safe (sem Prisma/bcrypt) para proteger rotas.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Protege todas as rotas exceto assets estáticos, o manifest do PWA e a API de auth.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
