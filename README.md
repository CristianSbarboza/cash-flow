# Fluxo — Gestão Financeira Pessoal

Web App **mobile-first** de gestão financeira individual. Controle sua liquidez,
planeje o mês e "carimbe" seu dinheiro por objetivo.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions) + TypeScript
- **Tailwind CSS v4** (tokens via CSS `@theme`) + componentes shadcn-style + Lucide
- **Prisma ORM** + **PostgreSQL** (Supabase)
- **Auth.js (NextAuth v5)** — credenciais Nome + Senha, sessão JWT
- **Recharts** para o gráfico do painel
- **Zod** para validação (inclui regra de senha forte)

## Funcionalidades

| Tela | O que faz |
|------|-----------|
| **Início** | Saldo disponível em destaque, ações rápidas (gasto/dívida e recebimento), últimos lançamentos com badges de status |
| **Painel** | Gráfico Gastos × Ganhos, indicador de Economia/Estouro, planejamento mensal (Pretendido, Necessário, Sobra/Falta) |
| **Objetivos** | Envelopes de dinheiro com barras de progresso ("Para que serve este dinheiro") |
| **Extrato** | Lista filtrável por situação: Pagou, Recebeu, Devendo, A receber |

### Regras de negócio

- **Saldo Disponível** = saldo inicial + `RECEBIDO` − `PAGO`. Apenas transações
  liquidadas afetam a liquidez; `DEVENDO` e `RECEBIMENTO_FUTURO` são pendências.
- Liquidar uma pendência (`DEVENDO → PAGO`, `RECEBIMENTO_FUTURO → RECEBIDO`)
  atualiza o saldo automaticamente.
- Valores são armazenados em **centavos (Int)** para evitar erros de ponto flutuante.

## Como rodar

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure o ambiente

Copie `.env.example` para `.env` e preencha com os dados do seu projeto Supabase:

```bash
cp .env.example .env
```

- `DATABASE_URL` — conexão **pooling** (porta 6543, PgBouncer)
- `DIRECT_URL` — conexão **direta** (porta 5432, usada nas migrations)
- `AUTH_SECRET` — gere com `npx auth secret`

> No painel do Supabase: **Project Settings → Database → Connection string**.

### 3. Crie as tabelas no banco

```bash
npm run db:push       # aplica o schema diretamente (ideal para começar)
# ou
npm run db:migrate    # cria uma migration versionada
```

### 4. Rode em desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000 — você será redirecionado para o login. Crie uma
conta em **/register**.

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run db:push` | Sincroniza o schema com o banco |
| `npm run db:studio` | Abre o Prisma Studio |

## Estrutura

```
src/
├── app/
│   ├── (auth)/            # login, register (públicas)
│   ├── (app)/             # home, dashboard, objetivos, extrato (protegidas)
│   └── api/auth/          # handler do NextAuth
├── actions/               # Server Actions (auth, transactions, allocations, planning)
├── components/            # ui/ (shadcn-style), nav/, transactions/, allocations/, dashboard/
├── lib/                   # prisma, queries, validations (Zod), utils
├── auth.ts / auth.config.ts
└── proxy.ts               # proteção de rotas (Next 16 "proxy" = middleware)
```

## Deploy

- **Frontend:** Vercel (defina as variáveis de ambiente no projeto)
- **Banco:** Supabase Free Tier

> Adicione `AUTH_URL` com o domínio de produção e mantenha `AUTH_SECRET` seguro.
