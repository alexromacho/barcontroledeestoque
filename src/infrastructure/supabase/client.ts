import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let cliente: SupabaseClient<Database> | null = null;

export function obterClienteSupabase() {
  if (cliente) return cliente;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram configuradas.",
    );
  }

  cliente = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return cliente;
}
