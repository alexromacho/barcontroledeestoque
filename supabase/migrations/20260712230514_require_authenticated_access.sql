drop policy "prototype suppliers access" on public.suppliers;
drop policy "prototype products access" on public.products;
drop policy "prototype stock movements access" on public.stock_movements;
drop policy "prototype weekly lists access" on public.weekly_lists;
drop policy "prototype weekly list items access" on public.weekly_list_items;

create policy "authenticated suppliers access" on public.suppliers for all to authenticated using (true) with check (true);
create policy "authenticated products access" on public.products for all to authenticated using (true) with check (true);
create policy "authenticated stock movements access" on public.stock_movements for all to authenticated using (true) with check (true);
create policy "authenticated weekly lists access" on public.weekly_lists for all to authenticated using (true) with check (true);
create policy "authenticated weekly list items access" on public.weekly_list_items for all to authenticated using (true) with check (true);
