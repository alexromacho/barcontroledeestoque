-- Modelo inicial para futura persistência. Este arquivo não é executado automaticamente.
create extension if not exists pgcrypto;

create table if not exists public.fornecedores (
  id text primary key,
  nome text not null,
  telefone text not null default '',
  categoria text not null,
  frequencia_compra text not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.produtos (
  id text primary key,
  fornecedor_id text not null references public.fornecedores(id) on delete restrict,
  nome text not null,
  categoria text not null,
  unidade text not null,
  estoque_atual numeric(12, 3) not null default 0 check (estoque_atual >= 0),
  estoque_minimo numeric(12, 3) not null default 0 check (estoque_minimo >= 0),
  valor_unitario numeric(12, 2) not null default 0 check (valor_unitario >= 0),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fornecedor_id, nome)
);

create table if not exists public.movimentacoes_estoque (
  id text primary key,
  produto_id text not null references public.produtos(id) on delete restrict,
  fornecedor_id text not null references public.fornecedores(id) on delete restrict,
  tipo text not null check (tipo in ('entrada', 'saida')),
  quantidade numeric(12, 3) not null check (quantidade > 0),
  unidade text not null,
  estoque_anterior numeric(12, 3) not null check (estoque_anterior >= 0),
  estoque_atual numeric(12, 3) not null check (estoque_atual >= 0),
  data_movimentacao date not null,
  horario_movimentacao time not null,
  created_at timestamptz not null default now()
);

create index if not exists produtos_fornecedor_id_idx on public.produtos(fornecedor_id);
create index if not exists movimentacoes_produto_id_idx on public.movimentacoes_estoque(produto_id);
create index if not exists movimentacoes_fornecedor_id_idx on public.movimentacoes_estoque(fornecedor_id);
create index if not exists movimentacoes_tipo_idx on public.movimentacoes_estoque(tipo);
create index if not exists movimentacoes_data_idx on public.movimentacoes_estoque(data_movimentacao);

create or replace function public.atualizar_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists fornecedores_updated_at on public.fornecedores;
create trigger fornecedores_updated_at
before update on public.fornecedores
for each row execute function public.atualizar_updated_at();

drop trigger if exists produtos_updated_at on public.produtos;
create trigger produtos_updated_at
before update on public.produtos
for each row execute function public.atualizar_updated_at();
