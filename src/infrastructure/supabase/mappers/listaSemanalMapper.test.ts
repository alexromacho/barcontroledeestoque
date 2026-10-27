import { describe, expect, it } from "vitest";
import type { WeeklyListComItensRow } from "../database.types";
import { mapListaSemanalRowToDomain } from "./listaSemanalMapper";

const createdAt = "2026-07-12T21:30:00Z";
const dataCriada = new Date(createdAt);

const row: WeeklyListComItensRow = {
  id: "9f1b7e2a-5555-4a11-8a11-000000000005",
  title: "LISTA DA SEMANA",
  total_amount: 25.8,
  created_at: createdAt,
  weekly_list_items: [
    { product_name: "Água sem gás", quantity: 2, unit: "fardo", unit_price: 1.8, suppliers: { name: "Caio Aragua" } },
    { product_name: "Água com gás", quantity: 1, unit: "fardo", unit_price: 2.8, suppliers: { name: "Caio Aragua" } },
    { product_name: "Copo 500 ml", quantity: 1, unit: "pacote", unit_price: 14.4, suppliers: { name: "WR Embalagens" } },
  ],
};

describe("listaSemanalMapper", () => {
  it("agrupa os itens por fornecedor", () => {
    const resultado = mapListaSemanalRowToDomain(row);

    expect(resultado).toEqual({
      id: row.id,
      createdAt,
      date: dataCriada.toLocaleDateString("pt-BR"),
      time: dataCriada.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      fornecedores: [
        {
          name: "Caio Aragua",
          itens: [
            { name: "Água sem gás", quantity: 2, unit: "fardo", unitPrice: 1.8 },
            { name: "Água com gás", quantity: 1, unit: "fardo", unitPrice: 2.8 },
          ],
        },
        {
          name: "WR Embalagens",
          itens: [{ name: "Copo 500 ml", quantity: 1, unit: "pacote", unitPrice: 14.4 }],
        },
      ],
    });
  });

  it("usa um nome de fallback quando o fornecedor do item não foi retornado", () => {
    const resultado = mapListaSemanalRowToDomain({
      ...row,
      weekly_list_items: [{ product_name: "Item sem fornecedor", quantity: 1, unit: "unidade", unit_price: 0, suppliers: null }],
    });
    expect(resultado.fornecedores[0].name).toBe("Fornecedor não identificado");
  });
});
