import type { NextAuthConfig } from "next-auth";

/**
 * Configuração compartilhada e "edge-safe" (sem Prisma/bcrypt).
 * É usada pelo middleware para proteger rotas.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isAuthRoute = pathname === "/login" || pathname === "/register";

      // Usuário logado tentando acessar login/registro → manda pra Home.
      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // Demais rotas exigem autenticação.
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [], // definidos em auth.ts (Node runtime)
} satisfies NextAuthConfig;
