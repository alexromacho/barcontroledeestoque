import { describe, expect, it } from "vitest";
import type { MovimentacaoEstoque } from "../../domain/entities/MovimentacaoEstoque";
import {
  MovimentacaoRepositorySupabase,
  type MovimentacaoSupabaseGateway,
} from "./MovimentacaoRepositorySupabase";
import type { MovimentacaoComRelacoesRow, MovimentacaoInsert } from "../supabase/database.types";

const row: MovimentacaoComRelacoesRow = {
  id: "9f1b7e2a-3333-4a11-8a11-000000000003",
  product_id: "9f1b7e2a-1111-4a11-8a11-000000000001",
  movement_type: "entrada",
  quantity: 3,
  previous_stock: 5,
  current_stock: 8,
  note: "",
  invoice_image_path: null,
  created_at: "2026-07-12T21:30:00Z",
  products: { name: "Água sem gás", category: "Água", unit: "fardos", suppliers: { name: "Caio Aragua" } },
};

function criarGateway({
  lista = [row],
  erro = null,
}: {
  lista?: MovimentacaoComRelacoesRow[] | null;
  erro?: { message: string } | null;
} = {}) {
  const inseridas: MovimentacaoInsert[] = [];
  const gateway: MovimentacaoSupabaseGateway = {
    async listar() { return { data: lista, error: erro }; },
    async inserir(valores) {
      inseridas.push(valores);
      return { data: null, error: erro };
    },
  };
  return { gateway, inseridas };
}

describe("MovimentacaoRepositorySupabase", () => {
  it("lista movimentações mapeadas para o domínio", async () => {
    const { gateway } = criarGateway();
    const repositorio = new MovimentacaoRepositorySupabase(gateway);
    await expect(repositorio.listar()).resolves.toEqual([
      expect.objectContaining({ id: row.id, productId: row.product_id, productName: "Água sem gás" }),
    ]);
  });

  it("transforma retorno vazio em lista vazia", async () => {
    const { gateway } = criarGateway({ lista: null });
    const repositorio = new MovimentacaoRepositorySupabase(gateway);
    await expect(repositorio.listar()).resolves.toEqual([]);
  });

  it("registra a movimentação associada ao produto", async () => {
    const { gateway, inseridas } = criarGateway();
    const repositorio = new MovimentacaoRepositorySupabase(gateway);
    const movimentacao = (await repositorio.listar())[0];

    await repositorio.registrar(movimentacao);
    expect(inseridas).toEqual([expect.objectContaining({ product_id: row.product_id, movement_type: "entrada" })]);
  });

  it("lança uma mensagem clara quando o Supabase retorna erro ao listar", async () => {
    const { gateway } = criarGateway({ erro: { message: "falha simulada" } });
    const repositorio = new MovimentacaoRepositorySupabase(gateway);
    await expect(repositorio.listar()).rejects.toThrow(
      "Não foi possível listar as movimentações: falha simulada",
    );
  });

  it("lança uma mensagem clara quando o Supabase retorna erro ao registrar", async () => {
    const { gateway } = criarGateway({ erro: { message: "falha simulada" } });
    const repositorio = new MovimentacaoRepositorySupabase(gateway);
    const movimentacaoValida: MovimentacaoEstoque = {
      id: "mov-1",
      productId: "produto-1",
      tipo: "entrada",
      date: "12/07/2026",
      time: "18:30",
      productName: "Água sem gás",
      category: "Água",
      quantity: 3,
      unit: "fardos",
      previousStock: 5,
      currentStock: 8,
      supplier: "Caio Aragua",
    };
    await expect(repositorio.registrar(movimentacaoValida)).rejects.toThrow(
      "Não foi possível registrar a movimentação: falha simulada",
    );
  });
});
