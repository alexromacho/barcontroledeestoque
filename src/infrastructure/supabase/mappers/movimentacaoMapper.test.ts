import { describe, expect, it } from "vitest";
import type { MovimentacaoEstoque } from "../../../domain/entities/MovimentacaoEstoque";
import type { MovimentacaoComRelacoesRow } from "../database.types";
import { mapMovimentacaoDomainToInsert, mapMovimentacaoRowToDomain } from "./movimentacaoMapper";

const row: MovimentacaoComRelacoesRow = {
  id: "mov-1",
  produto_id: "agua-sem-gas",
  fornecedor_id: "caio-aragua",
  tipo: "entrada",
  quantidade: 3,
  unidade: "fardos",
  estoque_anterior: 5,
  estoque_atual: 8,
  data_movimentacao: "12/07/2026",
  horario_movimentacao: "18:30",
  created_at: "2026-07-12T21:30:00Z",
  produtos: { nome: "Água sem gás", categoria: "Água" },
  fornecedores: { nome: "Caio Aragua" },
};

describe("movimentacaoMapper", () => {
  it("converte uma movimentação persistida para o domínio", () => {
    expect(mapMovimentacaoRowToDomain(row)).toEqual({
      id: "mov-1",
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
    });
  });

  it("converte o domínio para inserção sem espalhar snake_case", () => {
    const movimentacao: MovimentacaoEstoque = mapMovimentacaoRowToDomain(row);
    expect(mapMovimentacaoDomainToInsert(movimentacao, "agua-sem-gas", "caio-aragua")).toEqual({
      id: "mov-1",
      produto_id: "agua-sem-gas",
      fornecedor_id: "caio-aragua",
      tipo: "entrada",
      quantidade: 3,
      unidade: "fardos",
      estoque_anterior: 5,
      estoque_atual: 8,
      data_movimentacao: "12/07/2026",
      horario_movimentacao: "18:30",
    });
  });
});
