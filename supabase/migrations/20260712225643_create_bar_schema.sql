create extension if not exists pgcrypto;

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  phone text not null default '',
  category text not null default '',
  purchase_frequency text not null default 'Sob demanda',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  name text not null,
  category text not null default '',
  unit text not null default 'unidade',
  current_stock numeric(12, 3) not null default 0 check (current_stock >= 0),
  minimum_stock numeric(12, 3) not null default 0 check (minimum_stock >= 0),
  unit_price numeric(12, 2) not null default 0 check (unit_price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (supplier_id, name)
);

create type public.stock_movement_type as enum ('entrada', 'saida', 'ajuste');

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  movement_type public.stock_movement_type not null,
  quantity numeric(12, 3) not null check (quantity > 0),
  previous_stock numeric(12, 3) not null check (previous_stock >= 0),
  current_stock numeric(12, 3) not null check (current_stock >= 0),
  note text not null default '',
  invoice_image_path text,
  created_at timestamptz not null default now()
);

create table public.weekly_lists (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'LISTA DA SEMANA',
  total_amount numeric(12, 2) not null default 0 check (total_amount >= 0),
  created_at timestamptz not null default now()
);

create table public.weekly_list_items (
  id uuid primary key default gen_random_uuid(),
  weekly_list_id uuid not null references public.weekly_lists(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity numeric(12, 3) not null check (quantity > 0),
  unit text not null,
  unit_price numeric(12, 2) not null default 0 check (unit_price >= 0),
  total_amount numeric(12, 2) generated always as (quantity * unit_price) stored
);

create index products_supplier_id_idx on public.products(supplier_id);
create index stock_movements_product_created_idx on public.stock_movements(product_id, created_at desc);
create index weekly_lists_created_at_idx on public.weekly_lists(created_at desc);
create index weekly_list_items_list_idx on public.weekly_list_items(weekly_list_id);
create index weekly_list_items_supplier_idx on public.weekly_list_items(supplier_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger suppliers_set_updated_at
before update on public.suppliers
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.suppliers enable row level security;
alter table public.products enable row level security;
alter table public.stock_movements enable row level security;
alter table public.weekly_lists enable row level security;
alter table public.weekly_list_items enable row level security;

create policy "prototype suppliers access" on public.suppliers for all to anon, authenticated using (true) with check (true);
create policy "prototype products access" on public.products for all to anon, authenticated using (true) with check (true);
create policy "prototype stock movements access" on public.stock_movements for all to anon, authenticated using (true) with check (true);
create policy "prototype weekly lists access" on public.weekly_lists for all to anon, authenticated using (true) with check (true);
create policy "prototype weekly list items access" on public.weekly_list_items for all to anon, authenticated using (true) with check (true);
