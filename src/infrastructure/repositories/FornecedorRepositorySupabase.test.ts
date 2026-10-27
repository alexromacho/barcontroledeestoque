import { describe, expect, it } from "vitest";
import type { FornecedorRepository } from "./FornecedorRepository";
import {
  FornecedorRepositorySupabase,
  type FornecedorSupabaseGateway,
} from "./FornecedorRepositorySupabase";
import type { SupplierInsert, SupplierRow, SupplierUpdate } from "../supabase/database.types";

const supplierId = "9f1b7e2a-4444-4a11-8a11-000000000004";

const row: SupplierRow = {
  id: supplierId,
  name: "Fornecedor A",
  phone: "5514900000001",
  category: "Bebidas",
  purchase_frequency: "Semanal",
  created_at: "2026-07-12T12:00:00Z",
  updated_at: "2026-07-12T12:00:00Z",
};

function criarGateway({
  lista = [row],
  fornecedorId = supplierId,
  itemCriado = row,
  erro = null,
}: {
  lista?: SupplierRow[] | null;
  fornecedorId?: string | null;
  itemCriado?: SupplierRow | null;
  erro?: { message: string } | null;
} = {}) {
  const atualizacoes: Array<{ id: string; valores: SupplierUpdate }> = [];
  const criacoes: SupplierInsert[] = [];
  const exclusoes: string[] = [];
  const gateway: FornecedorSupabaseGateway = {
    async listar() { return { data: lista, error: erro }; },
    async buscarIdPorNome() { return { data: fornecedorId, error: erro }; },
    async criar(valores) {
      criacoes.push(valores);
      return { data: itemCriado, error: erro };
    },
    async atualizar(id, valores) {
      atualizacoes.push({ id, valores });
      return { data: null, error: erro };
    },
    async excluir(id) {
      exclusoes.push(id);
      return { data: null, error: erro };
    },
  };
  return { gateway, atualizacoes, criacoes, exclusoes };
}

describe("FornecedorRepositorySupabase", () => {
  it("respeita a interface existente e lista fornecedores mapeados", async () => {
    const { gateway } = criarGateway();
    const repositorio: FornecedorRepository = new FornecedorRepositorySupabase(gateway);
    await expect(repositorio.listar()).resolves.toEqual([
      expect.objectContaining({ name: "Fornecedor A", phone: "5514900000001" }),
    ]);
  });

  it("cria um novo fornecedor", async () => {
    const { gateway, criacoes } = criarGateway();
    const repositorio = new FornecedorRepositorySupabase(gateway);

    const criado = await repositorio.criar({ name: "Fornecedor A", phone: "5514900000001", category: "Bebidas", purchaseFrequency: "Semanal" });
    expect(criacoes).toEqual([expect.objectContaining({ name: "Fornecedor A" })]);
    expect(criado).toEqual(expect.objectContaining({ name: "Fornecedor A" }));
  });

  it("resolve o id pelo nome e envia somente campos persistíveis ao atualizar", async () => {
    const { gateway, atualizacoes } = criarGateway();
    const repositorio = new FornecedorRepositorySupabase(gateway);

    await repositorio.atualizar("Fornecedor A", { name: "Fornecedor A", phone: "5514911111111", category: "Bebidas", purchaseFrequency: "Semanal" });
    expect(atualizacoes).toEqual([{ id: supplierId, valores: expect.objectContaining({ phone: "5514911111111" }) }]);
  });

  it("falha claramente quando o fornecedor informado não existe", async () => {
    const { gateway } = criarGateway({ fornecedorId: null });
    const repositorio = new FornecedorRepositorySupabase(gateway);

    await expect(repositorio.excluir("Inexistente")).rejects.toThrow('Fornecedor "Inexistente" não encontrado.');
  });

  it("exclui o fornecedor pelo nome", async () => {
    const { gateway, exclusoes } = criarGateway();
    const repositorio = new FornecedorRepositorySupabase(gateway);

    await repositorio.excluir("Fornecedor A");
    expect(exclusoes).toEqual([supplierId]);
  });

  it("lança uma mensagem clara quando o Supabase retorna erro", async () => {
    const { gateway } = criarGateway({ erro: { message: "falha simulada" } });
    const repositorio = new FornecedorRepositorySupabase(gateway);
    await expect(repositorio.listar()).rejects.toThrow(
      "Não foi possível listar os fornecedores: falha simulada",
    );
  });
});
