import type { SupabaseClient } from "@supabase/supabase-js";
import type { Fornecedor } from "../../domain/entities/Fornecedor";
import type { FornecedorRepository } from "./FornecedorRepository";
import { obterClienteSupabase } from "../supabase/client";
import type { Database, SupplierInsert, SupplierRow, SupplierUpdate } from "../supabase/database.types";
import { mapFornecedorDomainToInsert, mapFornecedorRowToDomain } from "../supabase/mappers/fornecedorMapper";

type ErroPersistencia = { message: string };
type Resultado<T> = { data: T; error: ErroPersistencia | null };

export interface FornecedorSupabaseGateway {
  listar(): Promise<Resultado<SupplierRow[] | null>>;
  buscarIdPorNome(nome: string): Promise<Resultado<string | null>>;
  criar(valores: SupplierInsert): Promise<Resultado<SupplierRow | null>>;
  atualizar(id: string, valores: SupplierUpdate): Promise<Resultado<null>>;
  excluir(id: string): Promise<Resultado<null>>;
}

export function criarFornecedorSupabaseGateway(
  cliente: SupabaseClient<Database> = obterClienteSupabase(),
): FornecedorSupabaseGateway {
  return {
    async listar() {
      const { data, error } = await cliente.from("suppliers").select("*").order("name");
      return { data, error };
    },

    async buscarIdPorNome(nome) {
      const { data, error } = await cliente.from("suppliers").select("id").eq("name", nome).maybeSingle();
      return { data: data?.id ?? null, error };
    },

    async criar(valores) {
      const { data, error } = await cliente.from("suppliers").insert(valores).select("*").single();
      return { data, error };
    },

    async atualizar(id, valores) {
      const { error } = await cliente.from("suppliers").update(valores).eq("id", id);
      return { data: null, error };
    },

    async excluir(id) {
      const { error } = await cliente.from("suppliers").delete().eq("id", id);
      return { data: null, error };
    },
  };
}

export class FornecedorRepositorySupabase implements FornecedorRepository {
  constructor(private readonly gateway: FornecedorSupabaseGateway = criarFornecedorSupabaseGateway()) {}

  async listar(): Promise<Fornecedor[]> {
    const { data, error } = await this.gateway.listar();
    if (error) throw new Error(`Não foi possível listar os fornecedores: ${error.message}`);
    return (data ?? []).map(mapFornecedorRowToDomain);
  }

  async criar(fornecedor: Fornecedor): Promise<Fornecedor> {
    const { data, error } = await this.gateway.criar(mapFornecedorDomainToInsert(fornecedor));
    if (error) throw new Error(`Não foi possível criar o fornecedor: ${error.message}`);
    if (!data) throw new Error("Não foi possível criar o fornecedor: resposta vazia.");
    return mapFornecedorRowToDomain(data);
  }

  async atualizar(nome: string, fornecedor: Fornecedor): Promise<void> {
    const { data: id, error: erroId } = await this.gateway.buscarIdPorNome(nome);
    if (erroId) throw new Error(`Não foi possível localizar o fornecedor ${nome}: ${erroId.message}`);
    if (!id) throw new Error(`Fornecedor "${nome}" não encontrado.`);

    const { error } = await this.gateway.atualizar(id, mapFornecedorDomainToInsert(fornecedor));
    if (error) throw new Error(`Não foi possível atualizar o fornecedor ${nome}: ${error.message}`);
  }

  async excluir(nome: string): Promise<void> {
    const { data: id, error: erroId } = await this.gateway.buscarIdPorNome(nome);
    if (erroId) throw new Error(`Não foi possível localizar o fornecedor ${nome}: ${erroId.message}`);
    if (!id) throw new Error(`Fornecedor "${nome}" não encontrado.`);

    const { error } = await this.gateway.excluir(id);
    if (error) throw new Error(`Não foi possível excluir o fornecedor ${nome}: ${error.message}`);
  }
}
