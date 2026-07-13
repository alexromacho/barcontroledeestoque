import type { SupabaseClient } from "@supabase/supabase-js";
import type { Produto } from "../../domain/entities/Produto";
import type { ProdutoRepository } from "./ProdutoRepository";
import { obterClienteSupabase } from "../supabase/client";
import type { Database, ProdutoComFornecedorRow, ProdutoUpdate } from "../supabase/database.types";
import { mapProdutoDomainToUpdate, mapProdutoRowToDomain } from "../supabase/mappers/produtoMapper";

type ErroPersistencia = { message: string };
type Resultado<T> = { data: T; error: ErroPersistencia | null };

export interface ProdutoSupabaseGateway {
  listar(): Promise<Resultado<ProdutoComFornecedorRow[] | null>>;
  buscarPorId(id: string): Promise<Resultado<ProdutoComFornecedorRow | null>>;
  atualizar(id: string, valores: ProdutoUpdate): Promise<Resultado<null>>;
}

const camposProduto = `
  id,
  fornecedor_id,
  nome,
  categoria,
  unidade,
  estoque_atual,
  estoque_minimo,
  valor_unitario,
  ativo,
  created_at,
  updated_at,
  fornecedores!inner(nome)
`;

export function criarProdutoSupabaseGateway(
  cliente: SupabaseClient<Database> = obterClienteSupabase(),
): ProdutoSupabaseGateway {
  return {
    async listar() {
      const { data, error } = await cliente
        .from("produtos")
        .select(camposProduto)
        .eq("ativo", true)
        .order("nome");
      return { data: data as ProdutoComFornecedorRow[] | null, error };
    },

    async buscarPorId(id) {
      const { data, error } = await cliente
        .from("produtos")
        .select(camposProduto)
        .eq("id", id)
        .eq("ativo", true)
        .maybeSingle();
      return { data: data as ProdutoComFornecedorRow | null, error };
    },

    async atualizar(id, valores) {
      const { error } = await cliente.from("produtos").update(valores).eq("id", id);
      return { data: null, error };
    },
  };
}

export class ProdutoRepositorySupabase implements ProdutoRepository {
  constructor(private readonly gateway: ProdutoSupabaseGateway = criarProdutoSupabaseGateway()) {}

  async listar(): Promise<Produto[]> {
    const { data, error } = await this.gateway.listar();
    if (error) throw new Error(`Não foi possível listar os produtos: ${error.message}`);
    return (data ?? []).map(mapProdutoRowToDomain);
  }

  async buscarPorId(id: string): Promise<Produto | null> {
    const { data, error } = await this.gateway.buscarPorId(id);
    if (error) throw new Error(`Não foi possível buscar o produto ${id}: ${error.message}`);
    return data ? mapProdutoRowToDomain(data) : null;
  }

  async atualizar(produto: Produto): Promise<void> {
    const { error } = await this.gateway.atualizar(produto.id, mapProdutoDomainToUpdate(produto));
    if (error) throw new Error(`Não foi possível atualizar o produto ${produto.id}: ${error.message}`);
  }
}
