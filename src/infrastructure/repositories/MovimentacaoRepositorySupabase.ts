import type { SupabaseClient } from "@supabase/supabase-js";
import type { MovimentacaoEstoque } from "../../domain/entities/MovimentacaoEstoque";
import type { MovimentacaoRepository } from "../../domain/repositories/MovimentacaoRepository";
import { obterClienteSupabase } from "../supabase/client";
import type { Database, MovimentacaoComRelacoesRow, MovimentacaoInsert } from "../supabase/database.types";
import { mapMovimentacaoDomainToInsert, mapMovimentacaoRowToDomain } from "../supabase/mappers/movimentacaoMapper";

type ErroPersistencia = { message: string };
type Resultado<T> = { data: T; error: ErroPersistencia | null };

export interface MovimentacaoSupabaseGateway {
  listar(): Promise<Resultado<MovimentacaoComRelacoesRow[] | null>>;
  inserir(valores: MovimentacaoInsert): Promise<Resultado<null>>;
}

const camposMovimentacao = `
  id,
  product_id,
  movement_type,
  quantity,
  previous_stock,
  current_stock,
  note,
  invoice_image_path,
  created_at,
  products!inner(name, category, unit, suppliers!inner(name))
`;

export function criarMovimentacaoSupabaseGateway(
  cliente: SupabaseClient<Database> = obterClienteSupabase(),
): MovimentacaoSupabaseGateway {
  return {
    async listar() {
      const { data, error } = await cliente
        .from("stock_movements")
        .select(camposMovimentacao)
        .order("created_at", { ascending: false });
      return { data: data as MovimentacaoComRelacoesRow[] | null, error };
    },

    async inserir(valores) {
      const { error } = await cliente.from("stock_movements").insert(valores);
      return { data: null, error };
    },
  };
}

export class MovimentacaoRepositorySupabase implements MovimentacaoRepository {
  constructor(private readonly gateway: MovimentacaoSupabaseGateway = criarMovimentacaoSupabaseGateway()) {}

  async listar(): Promise<MovimentacaoEstoque[]> {
    const { data, error } = await this.gateway.listar();
    if (error) throw new Error(`Não foi possível listar as movimentações: ${error.message}`);
    return (data ?? []).map(mapMovimentacaoRowToDomain);
  }

  async registrar(movimentacao: MovimentacaoEstoque): Promise<void> {
    const { error } = await this.gateway.inserir(mapMovimentacaoDomainToInsert(movimentacao));
    if (error) throw new Error(`Não foi possível registrar a movimentação: ${error.message}`);
  }
}
