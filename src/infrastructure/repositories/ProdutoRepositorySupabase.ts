import type { SupabaseClient } from "@supabase/supabase-js";
import type { Produto } from "../../domain/entities/Produto";
import type { ProdutoRepository } from "./ProdutoRepository";
import { obterClienteSupabase } from "../supabase/client";
import type { Database, ProdutoComFornecedorRow, ProdutoInsert, ProdutoUpdate } from "../supabase/database.types";
import { mapProdutoDomainToInsert, mapProdutoDomainToUpdate, mapProdutoRowToDomain } from "../supabase/mappers/produtoMapper";

type ErroPersistencia = { message: string };
type Resultado<T> = { data: T; error: ErroPersistencia | null };

export interface ProdutoSupabaseGateway {
  listar(): Promise<Resultado<ProdutoComFornecedorRow[] | null>>;
  buscarPorId(id: string): Promise<Resultado<ProdutoComFornecedorRow | null>>;
  buscarFornecedorIdPorNome(nome: string): Promise<Resultado<string | null>>;
  criar(valores: ProdutoInsert): Promise<Resultado<ProdutoComFornecedorRow | null>>;
  atualizar(id: string, valores: ProdutoUpdate): Promise<Resultado<null>>;
  excluir(id: string): Promise<Resultado<null>>;
}

const camposProduto = `
  id,
  supplier_id,
  name,
  category,
  unit,
  current_stock,
  minimum_stock,
  unit_price,
  active,
  created_at,
  updated_at,
  suppliers!inner(name)
`;

export function criarProdutoSupabaseGateway(
  cliente: SupabaseClient<Database> = obterClienteSupabase(),
): ProdutoSupabaseGateway {
  return {
    async listar() {
      const { data, error } = await cliente
        .from("products")
        .select(camposProduto)
        .eq("active", true)
        .order("name");
      return { data: data as ProdutoComFornecedorRow[] | null, error };
    },

    async buscarPorId(id) {
      const { data, error } = await cliente
        .from("products")
        .select(camposProduto)
        .eq("id", id)
        .eq("active", true)
        .maybeSingle();
      return { data: data as ProdutoComFornecedorRow | null, error };
    },

    async buscarFornecedorIdPorNome(nome) {
      const { data, error } = await cliente
        .from("suppliers")
        .select("id")
        .eq("name", nome)
        .maybeSingle();
      return { data: data?.id ?? null, error };
    },

    async criar(valores) {
      const { data, error } = await cliente
        .from("products")
        .insert(valores)
        .select(camposProduto)
        .single();
      return { data: data as ProdutoComFornecedorRow | null, error };
    },

    async atualizar(id, valores) {
      const { error } = await cliente.from("products").update(valores).eq("id", id);
      return { data: null, error };
    },

    async excluir(id) {
      const { error } = await cliente.from("products").update({ active: false }).eq("id", id);
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

  async criar(produto: Omit<Produto, "id">): Promise<Produto> {
    const { data: supplierId, error: erroFornecedor } = await this.gateway.buscarFornecedorIdPorNome(produto.supplier);
    if (erroFornecedor) {
      throw new Error(`Não foi possível localizar o fornecedor ${produto.supplier}: ${erroFornecedor.message}`);
    }
    if (!supplierId) {
      throw new Error(`Fornecedor "${produto.supplier}" não encontrado.`);
    }

    const { data, error } = await this.gateway.criar(mapProdutoDomainToInsert(produto, supplierId));
    if (error) throw new Error(`Não foi possível criar o produto: ${error.message}`);
    if (!data) throw new Error("Não foi possível criar o produto: resposta vazia.");
    return mapProdutoRowToDomain(data);
  }

  async atualizar(produto: Produto): Promise<void> {
    const { error } = await this.gateway.atualizar(produto.id, mapProdutoDomainToUpdate(produto));
    if (error) throw new Error(`Não foi possível atualizar o produto ${produto.id}: ${error.message}`);
  }

  async excluir(id: string): Promise<void> {
    const { error } = await this.gateway.excluir(id);
    if (error) throw new Error(`Não foi possível excluir o produto ${id}: ${error.message}`);
  }
}
