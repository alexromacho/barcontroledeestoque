import { describe, expect, it } from "vitest";
import type { ProdutoRepository } from "./ProdutoRepository";
import {
  ProdutoRepositorySupabase,
  type ProdutoSupabaseGateway,
} from "./ProdutoRepositorySupabase";
import type { ProdutoComFornecedorRow, ProdutoInsert, ProdutoUpdate } from "../supabase/database.types";

const supplierId = "9f1b7e2a-2222-4a11-8a11-000000000002";

const row: ProdutoComFornecedorRow = {
  id: "9f1b7e2a-1111-4a11-8a11-000000000001",
  supplier_id: supplierId,
  name: "Água",
  category: "Bebidas",
  unit: "fardo",
  current_stock: 5,
  minimum_stock: 3,
  unit_price: 10,
  active: true,
  created_at: "2026-07-12T12:00:00Z",
  updated_at: "2026-07-12T12:00:00Z",
  suppliers: { name: "Fornecedor A" },
};

function criarGateway({
  lista = [row],
  item = row,
  fornecedorId = supplierId,
  itemCriado = row,
  erro = null,
}: {
  lista?: ProdutoComFornecedorRow[] | null;
  item?: ProdutoComFornecedorRow | null;
  fornecedorId?: string | null;
  itemCriado?: ProdutoComFornecedorRow | null;
  erro?: { message: string } | null;
} = {}) {
  const atualizacoes: Array<{ id: string; valores: ProdutoUpdate }> = [];
  const criacoes: ProdutoInsert[] = [];
  const exclusoes: string[] = [];
  const gateway: ProdutoSupabaseGateway = {
    async listar() { return { data: lista, error: erro }; },
    async buscarPorId() { return { data: item, error: erro }; },
    async buscarFornecedorIdPorNome() { return { data: fornecedorId, error: erro }; },
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

describe("ProdutoRepositorySupabase", () => {
  it("respeita a interface existente e lista produtos mapeados", async () => {
    const { gateway } = criarGateway();
    const repositorio: ProdutoRepository = new ProdutoRepositorySupabase(gateway);
    await expect(repositorio.listar()).resolves.toEqual([
      expect.objectContaining({ id: row.id, name: "Água", supplier: "Fornecedor A" }),
    ]);
  });

  it("transforma retorno vazio em lista vazia e item inexistente em null", async () => {
    const { gateway } = criarGateway({ lista: null, item: null });
    const repositorio = new ProdutoRepositorySupabase(gateway);
    await expect(repositorio.listar()).resolves.toEqual([]);
    await expect(repositorio.buscarPorId("inexistente")).resolves.toBeNull();
  });

  it("envia somente campos persistíveis ao atualizar", async () => {
    const { gateway, atualizacoes } = criarGateway();
    const repositorio = new ProdutoRepositorySupabase(gateway);
    const produto = await repositorio.buscarPorId(row.id);
    if (!produto) throw new Error("Produto de teste não encontrado.");

    await repositorio.atualizar({ ...produto, currentStock: 8 });
    expect(atualizacoes).toEqual([{
      id: row.id,
      valores: expect.objectContaining({ current_stock: 8, name: "Água" }),
    }]);
  });

  it("resolve o fornecedor pelo nome e cria o produto associado", async () => {
    const { gateway, criacoes } = criarGateway();
    const repositorio = new ProdutoRepositorySupabase(gateway);

    const produtoCriado = await repositorio.criar({
      name: "Água",
      category: "Bebidas",
      supplier: "Fornecedor A",
      unit: "fardo",
      currentStock: 5,
      minimumStock: 3,
      unitPrice: 10,
    });

    expect(criacoes).toEqual([expect.objectContaining({ supplier_id: supplierId, name: "Água" })]);
    expect(produtoCriado).toEqual(expect.objectContaining({ id: row.id, supplier: "Fornecedor A" }));
  });

  it("falha claramente quando o fornecedor informado não existe", async () => {
    const { gateway } = criarGateway({ fornecedorId: null });
    const repositorio = new ProdutoRepositorySupabase(gateway);

    await expect(repositorio.criar({
      name: "Água",
      category: "Bebidas",
      supplier: "Fornecedor Inexistente",
      unit: "fardo",
      currentStock: 5,
      minimumStock: 3,
    })).rejects.toThrow('Fornecedor "Fornecedor Inexistente" não encontrado.');
  });

  it("exclui (inativa) o produto pelo id", async () => {
    const { gateway, exclusoes } = criarGateway();
    const repositorio = new ProdutoRepositorySupabase(gateway);

    await repositorio.excluir(row.id);
    expect(exclusoes).toEqual([row.id]);
  });

  it("lança uma mensagem clara quando o Supabase retorna erro", async () => {
    const { gateway } = criarGateway({ erro: { message: "falha simulada" } });
    const repositorio = new ProdutoRepositorySupabase(gateway);
    await expect(repositorio.listar()).rejects.toThrow(
      "Não foi possível listar os produtos: falha simulada",
    );
  });
});
