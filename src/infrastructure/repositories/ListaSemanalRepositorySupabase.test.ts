import { describe, expect, it } from "vitest";
import type { ListaSemanalRegistro } from "../../types/estoque";
import {
  ListaSemanalRepositorySupabase,
  type ListaSemanalSupabaseGateway,
} from "./ListaSemanalRepositorySupabase";
import type { WeeklyListComItensRow, WeeklyListInsert, WeeklyListItemInsert, WeeklyListRow } from "../supabase/database.types";

const listaId = "9f1b7e2a-5555-4a11-8a11-000000000005";
const supplierId = "9f1b7e2a-6666-4a11-8a11-000000000006";

const row: WeeklyListComItensRow = {
  id: listaId,
  title: "LISTA DA SEMANA",
  total_amount: 3.6,
  created_at: "2026-07-12T21:30:00Z",
  weekly_list_items: [
    { product_name: "Água sem gás", quantity: 2, unit: "fardo", unit_price: 1.8, suppliers: { name: "Caio Aragua" } },
  ],
};

const registro: ListaSemanalRegistro = {
  id: listaId,
  createdAt: "2026-07-12T21:30:00.000Z",
  date: "12/07/2026",
  time: "18:30",
  fornecedores: [{ name: "Caio Aragua", itens: [{ name: "Água sem gás", quantity: 2, unit: "fardo", unitPrice: 1.8 }] }],
};

function criarGateway({
  lista = [row],
  fornecedorId = supplierId,
  listaCriadaRow = { id: listaId, title: "LISTA DA SEMANA", total_amount: 3.6, created_at: "2026-07-12T21:30:00Z" },
  erro = null,
}: {
  lista?: WeeklyListComItensRow[] | null;
  fornecedorId?: string | null;
  listaCriadaRow?: WeeklyListRow | null;
  erro?: { message: string } | null;
} = {}) {
  const itensCriados: WeeklyListItemInsert[][] = [];
  const listasCriadas: WeeklyListInsert[] = [];
  const gateway: ListaSemanalSupabaseGateway = {
    async listar() { return { data: lista, error: erro }; },
    async buscarFornecedorIdPorNome() { return { data: fornecedorId, error: erro }; },
    async criarLista(valores) {
      listasCriadas.push(valores);
      return { data: listaCriadaRow, error: erro };
    },
    async criarItens(valores) {
      itensCriados.push(valores);
      return { data: null, error: erro };
    },
  };
  return { gateway, itensCriados, listasCriadas };
}

describe("ListaSemanalRepositorySupabase", () => {
  it("lista registros mapeados para o domínio", async () => {
    const { gateway } = criarGateway();
    const repositorio = new ListaSemanalRepositorySupabase(gateway);
    await expect(repositorio.listar()).resolves.toEqual([
      expect.objectContaining({ id: listaId, fornecedores: [expect.objectContaining({ name: "Caio Aragua" })] }),
    ]);
  });

  it("cria a lista e os itens associados ao fornecedor resolvido pelo nome", async () => {
    const { gateway, itensCriados, listasCriadas } = criarGateway();
    const repositorio = new ListaSemanalRepositorySupabase(gateway);

    await repositorio.registrar(registro);

    expect(listasCriadas).toEqual([{ total_amount: 3.6 }]);
    expect(itensCriados).toEqual([[
      expect.objectContaining({
        weekly_list_id: listaId,
        supplier_id: supplierId,
        product_name: "Água sem gás",
        quantity: 2,
        unit: "fardo",
        unit_price: 1.8,
      }),
    ]]);
  });

  it("falha claramente quando o fornecedor informado não existe", async () => {
    const { gateway } = criarGateway({ fornecedorId: null });
    const repositorio = new ListaSemanalRepositorySupabase(gateway);

    await expect(repositorio.registrar(registro)).rejects.toThrow('Fornecedor "Caio Aragua" não encontrado.');
  });

  it("lança uma mensagem clara quando o Supabase retorna erro ao listar", async () => {
    const { gateway } = criarGateway({ erro: { message: "falha simulada" } });
    const repositorio = new ListaSemanalRepositorySupabase(gateway);
    await expect(repositorio.listar()).rejects.toThrow(
      "Não foi possível listar as listas semanais: falha simulada",
    );
  });
});
