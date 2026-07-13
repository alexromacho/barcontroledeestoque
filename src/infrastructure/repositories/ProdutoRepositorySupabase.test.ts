import { describe, expect, it } from "vitest";
import type { ProdutoRepository } from "./ProdutoRepository";
import {
  ProdutoRepositorySupabase,
  type ProdutoSupabaseGateway,
} from "./ProdutoRepositorySupabase";
import type { ProdutoComFornecedorRow, ProdutoUpdate } from "../supabase/database.types";

const row: ProdutoComFornecedorRow = {
  id: "agua",
  fornecedor_id: "fornecedor-a",
  nome: "Água",
  categoria: "Bebidas",
  unidade: "fardo",
  estoque_atual: 5,
  estoque_minimo: 3,
  valor_unitario: 10,
  ativo: true,
  created_at: "2026-07-12T12:00:00Z",
  updated_at: "2026-07-12T12:00:00Z",
  fornecedores: { nome: "Fornecedor A" },
};

function criarGateway({
  lista = [row],
  item = row,
  erro = null,
}: {
  lista?: ProdutoComFornecedorRow[] | null;
  item?: ProdutoComFornecedorRow | null;
  erro?: { message: string } | null;
} = {}) {
  const atualizacoes: Array<{ id: string; valores: ProdutoUpdate }> = [];
  const gateway: ProdutoSupabaseGateway = {
    async listar() { return { data: lista, error: erro }; },
    async buscarPorId() { return { data: item, error: erro }; },
    async atualizar(id, valores) {
      atualizacoes.push({ id, valores });
      return { data: null, error: erro };
    },
  };
  return { gateway, atualizacoes };
}

describe("ProdutoRepositorySupabase", () => {
  it("respeita a interface existente e lista produtos mapeados", async () => {
    const { gateway } = criarGateway();
    const repositorio: ProdutoRepository = new ProdutoRepositorySupabase(gateway);
    await expect(repositorio.listar()).resolves.toEqual([
      expect.objectContaining({ id: "agua", name: "Água", supplier: "Fornecedor A" }),
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
    const produto = await repositorio.buscarPorId("agua");
    if (!produto) throw new Error("Produto de teste não encontrado.");

    await repositorio.atualizar({ ...produto, currentStock: 8 });
    expect(atualizacoes).toEqual([{
      id: "agua",
      valores: expect.objectContaining({ estoque_atual: 8, nome: "Água" }),
    }]);
  });

  it("lança uma mensagem clara quando o Supabase retorna erro", async () => {
    const { gateway } = criarGateway({ erro: { message: "falha simulada" } });
    const repositorio = new ProdutoRepositorySupabase(gateway);
    await expect(repositorio.listar()).rejects.toThrow(
      "Não foi possível listar os produtos: falha simulada",
    );
  });
});
