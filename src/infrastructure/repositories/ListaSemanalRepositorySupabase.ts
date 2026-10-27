import type { SupabaseClient } from "@supabase/supabase-js";
import type { ListaSemanalRegistro } from "../../types/estoque";
import type { ListaSemanalRepository } from "./ListaSemanalRepository";
import { obterClienteSupabase } from "../supabase/client";
import type {
  Database,
  WeeklyListComItensRow,
  WeeklyListInsert,
  WeeklyListItemInsert,
  WeeklyListRow,
} from "../supabase/database.types";
import { mapListaSemanalRowToDomain } from "../supabase/mappers/listaSemanalMapper";

type ErroPersistencia = { message: string };
type Resultado<T> = { data: T; error: ErroPersistencia | null };

export interface ListaSemanalSupabaseGateway {
  listar(): Promise<Resultado<WeeklyListComItensRow[] | null>>;
  buscarFornecedorIdPorNome(nome: string): Promise<Resultado<string | null>>;
  criarLista(valores: WeeklyListInsert): Promise<Resultado<WeeklyListRow | null>>;
  criarItens(valores: WeeklyListItemInsert[]): Promise<Resultado<null>>;
}

const camposLista = "*, weekly_list_items(product_name, quantity, unit, unit_price, suppliers(name))";

export function criarListaSemanalSupabaseGateway(
  cliente: SupabaseClient<Database> = obterClienteSupabase(),
): ListaSemanalSupabaseGateway {
  return {
    async listar() {
      const { data, error } = await cliente
        .from("weekly_lists")
        .select(camposLista)
        .order("created_at", { ascending: false });
      return { data: data as WeeklyListComItensRow[] | null, error };
    },

    async buscarFornecedorIdPorNome(nome) {
      const { data, error } = await cliente.from("suppliers").select("id").eq("name", nome).maybeSingle();
      return { data: data?.id ?? null, error };
    },

    async criarLista(valores) {
      const { data, error } = await cliente.from("weekly_lists").insert(valores).select("*").single();
      return { data, error };
    },

    async criarItens(valores) {
      const { error } = await cliente.from("weekly_list_items").insert(valores);
      return { data: null, error };
    },
  };
}

export class ListaSemanalRepositorySupabase implements ListaSemanalRepository {
  constructor(private readonly gateway: ListaSemanalSupabaseGateway = criarListaSemanalSupabaseGateway()) {}

  async listar(): Promise<ListaSemanalRegistro[]> {
    const { data, error } = await this.gateway.listar();
    if (error) throw new Error(`Não foi possível listar as listas semanais: ${error.message}`);
    return (data ?? []).map(mapListaSemanalRowToDomain);
  }

  async registrar(lista: ListaSemanalRegistro): Promise<void> {
    const totalAmount = lista.fornecedores.reduce(
      (total, fornecedor) => total + fornecedor.itens.reduce((subtotal, item) => subtotal + item.quantity * item.unitPrice, 0),
      0,
    );

    const { data: listaCriada, error: erroLista } = await this.gateway.criarLista({ total_amount: totalAmount });
    if (erroLista) throw new Error(`Não foi possível criar a lista semanal: ${erroLista.message}`);
    if (!listaCriada) throw new Error("Não foi possível criar a lista semanal: resposta vazia.");

    const itens: WeeklyListItemInsert[] = [];
    for (const fornecedor of lista.fornecedores) {
      const { data: supplierId, error: erroFornecedor } = await this.gateway.buscarFornecedorIdPorNome(fornecedor.name);
      if (erroFornecedor) throw new Error(`Não foi possível localizar o fornecedor ${fornecedor.name}: ${erroFornecedor.message}`);
      if (!supplierId) throw new Error(`Fornecedor "${fornecedor.name}" não encontrado.`);

      fornecedor.itens.forEach((item) => {
        itens.push({
          weekly_list_id: listaCriada.id,
          supplier_id: supplierId,
          product_name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unitPrice,
        });
      });
    }

    if (itens.length === 0) return;
    const { error: erroItens } = await this.gateway.criarItens(itens);
    if (erroItens) throw new Error(`Não foi possível salvar os itens da lista semanal: ${erroItens.message}`);
  }
}
