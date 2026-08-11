# Bar React TS

Sistema do bar com frontend em React + TypeScript e backend em Node.js + Express.

## Telas

- Login
- Cadastro de fornecedores
- Cadastro de produtos
- Tela de pedido com envio por WhatsApp
- Estoque simples

> Observação: hoje `index.html` e `dashboard-teste.html` carregam `src/DashboardTeste.tsx`, uma versão de painel com dados em memória (sem login e sem persistência). A versão acima, com login e ligada à API (`src/main.tsx`), ainda não está conectada a um arquivo HTML — é o próximo passo depois do backend.

## API

Por padrão o app usa a API no mesmo host, porta `8000`.

Exemplo:

```text
http://localhost:8000
```

No iPhone, se o app abrir em `http://IP-DO-MAC:5174`, ele tentará acessar a API em `http://IP-DO-MAC:8000`.

O código do backend fica em [`backend/`](./backend) — veja o README de lá para detalhes das rotas.

## Rodar

Backend (porta 8000):

```bash
cd backend
pnpm install
pnpm dev
```

Frontend (porta 5175), em outro terminal:

```bash
pnpm install
pnpm dev
```
