import { describe, expect, it } from "vitest";
import type { SupplierRow } from "../database.types";
import { mapFornecedorDomainToInsert, mapFornecedorRowToDomain } from "./fornecedorMapper";

const row: SupplierRow = {
  id: "9f1b7e2a-4444-4a11-8a11-000000000004",
  name: "Caio Aragua",
  phone: "5514981012021",
  category: "Água",
  purchase_frequency: "Sob demanda",
  created_at: "2026-07-12T12:00:00Z",
  updated_at: "2026-07-12T12:00:00Z",
};

describe("fornecedorMapper", () => {
  it("converte snake_case do banco para o domínio", () => {
    expect(mapFornecedorRowToDomain(row)).toEqual({
      name: "Caio Aragua",
      phone: "5514981012021",
      category: "Água",
      purchaseFrequency: "Sob demanda",
    });
  });

  it("converte o domínio para os campos persistíveis do banco", () => {
    const fornecedor = mapFornecedorRowToDomain(row);
    expect(mapFornecedorDomainToInsert(fornecedor)).toEqual({
      name: "Caio Aragua",
      phone: "5514981012021",
      category: "Água",
      purchase_frequency: "Sob demanda",
    });
  });
});
