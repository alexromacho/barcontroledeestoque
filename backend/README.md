# Bar Backend

API em Node.js + Express + TypeScript para o sistema do bar. Usa `node:sqlite`
(módulo nativo do Node, sem dependências externas de banco) para persistir os
dados em `backend/data/bar.db`.

## Rodar

```bash
pnpm install
pnpm dev
```

Sobe em `http://0.0.0.0:8000` por padrão. Na primeira execução o banco é criado
e populado automaticamente com:

- um usuário admin (`admin` / `1234` — troque a senha em produção, veja abaixo);
- os 4 fornecedores e todos os produtos/itens de estoque que já existiam como
  mock no frontend (João Vero Imports, Caio Aragua, WR Embalagens, Mari Blumax).

Variáveis de ambiente opcionais:

| Variável              | Padrão               | Descrição                                  |
| --------------------- | --------------------- | ------------------------------------------- |
| `PORT`                 | `8000`                 | Porta HTTP                                   |
| `HOST`                 | `0.0.0.0`              | Host de bind                                 |
| `DB_DIR` / `DB_PATH`   | `backend/data/bar.db`  | Onde o arquivo SQLite é criado               |
| `SEED_ADMIN_PASSWORD`  | `1234`                 | Senha do usuário admin criado no primeiro boot |

## Build para produção

```bash
pnpm build
pnpm start
```

## Rotas

Todas retornam/recebem JSON. Erros vêm como `{ "error": "mensagem" }`.

- `GET /api/health` — healthcheck.
- `POST /api/login` — `{ username, password }` → `{ user }`.
- `GET /api/fornecedores` — lista fornecedores.
- `POST /api/fornecedores` — `{ name, category, whatsapp_phone, contact_name }` → `{ id, created }`.
- `GET /api/fornecedores/:id/produtos` — produtos de um fornecedor.
- `GET /api/produtos` — lista todos os produtos (com nome do fornecedor).
- `POST /api/produtos` — `{ supplier_id, name, unit, price }` → `{ id, created }`.
- `GET /api/estoque` — lista itens de estoque (com `is_low` calculado).
- `PATCH /api/estoque/:id` — `{ current_quantity }` → `{ id, updated }`.
- `POST /api/pedidos` — `{ supplier_id, items: [{ supplier_product_id, quantity }] }`
  → `{ id, supplier_id, total, whatsapp_phone, whatsapp_message }` (mensagem
  pronta para abrir o link `wa.me`).

## Estrutura

```
src/
  server.ts        # express app + rotas
  db.ts             # schema + seed inicial
  seed-data.ts      # dados de fornecedores/produtos usados no primeiro boot
  routes/
    auth.ts
    fornecedores.ts
    produtos.ts
    estoque.ts
    pedidos.ts
```

## Pendências conhecidas

- Preços dos produtos foram semeados com `0` (não existiam no mock original) —
  cadastre os preços reais pela tela de "Cadastro de produtos" ou direto no banco.
- Não há hash/rotação de senha pela API ainda — troca de senha é manual (via
  banco) ou recriando o usuário.
- `node:sqlite` ainda é experimental no Node — funciona bem para o uso local
  deste projeto, mas vale reavaliar se o projeto crescer para múltiplos bares/
  acesso concorrente pesado.
