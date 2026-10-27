# Bar Estoque

Frontend em React + TypeScript + Supabase para gestão de estoque do bar.

**Produção:** https://bar-estoque-seven.vercel.app (deploy automático a cada push na `main`)

## Telas

- Login (sessão via Supabase)
- Fornecedores
- Entradas de estoque
- Saída do dia / histórico de saídas
- Estoque de produtos
- Lista de compra automática
- Pedido ao fornecedor com envio por WhatsApp

## Backend

Usa Supabase como backend (ver `supabase/`). Configure as credenciais em `.env.local` (veja `.env.example`).

## Rodar

```bash
pnpm install
pnpm dev
```
