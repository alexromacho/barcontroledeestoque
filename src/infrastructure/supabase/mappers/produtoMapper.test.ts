import { describe, expect, it } from "vitest";
import type { Produto } from "../../../domain/entities/Produto";
import type { ProdutoComFornecedorRow } from "../database.types";
import { mapProdutoDomainToUpdate, mapProdutoRowToDomain } from "./produtoMapper";

const row: ProdutoComFornecedorRow = {
  id: "agua-sem-gas",
  fornecedor_id: "caio-aragua",
  nome: "Água sem gás",
  categoria: "Água",
  unidade: "fardo",
  estoque_atual: 5,
  estoque_minimo: 10,
  valor_unitario: 12.5,
  ativo: true,
  created_at: "2026-07-12T12:00:00Z",
  updated_at: "2026-07-12T12:00:00Z",
  fornecedores: { nome: "Caio Aragua" },
};

describe("produtoMapper", () => {
  it("converte snake_case do banco para o domínio", () => {
    expect(mapProdutoRowToDomain(row)).toEqual({
      id: "agua-sem-gas",
      name: "Água sem gás",
      category: "Água",
      supplier: "Caio Aragua",
      unit: "fardo",
      currentStock: 5,
      minimumStock: 10,
      unitPrice: 12.5,
    });
  });

  it("converte o domínio para os campos atualizáveis do banco", () => {
    const produto: Produto = mapProdutoRowToDomain(row);
    expect(mapProdutoDomainToUpdate({ ...produto, currentStock: 8 })).toEqual({
      nome: "Água sem gás",
      categoria: "Água",
      unidade: "fardo",
      estoque_atual: 8,
      estoque_minimo: 10,
      valor_unitario: 12.5,
    });
  });

  it("falha claramente quando a relação do fornecedor não foi retornada", () => {
    expect(() => mapProdutoRowToDomain({ ...row, fornecedores: null })).toThrow(
      "Fornecedor não encontrado para o produto agua-sem-gas.",
    );
  });
});
