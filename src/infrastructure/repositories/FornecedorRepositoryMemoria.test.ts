import { describe, expect, it } from "vitest";
import type { Fornecedor } from "../../types/estoque";
import { FornecedorRepositoryMemoria } from "./FornecedorRepositoryMemoria";

const fornecedores: Fornecedor[] = [
  { name: "Fornecedor A", phone: "5514900000001", category: "Bebidas", purchaseFrequency: "Semanal" },
  { name: "Fornecedor B", phone: "5514900000002", category: "Limpeza", purchaseFrequency: "Sob demanda" },
];

describe("FornecedorRepositoryMemoria", () => {
  it("lista todos os fornecedores cadastrados", async () => {
    const repositorio = new FornecedorRepositoryMemoria(fornecedores);
    await expect(repositorio.listar()).resolves.toHaveLength(2);
  });

  it("cria um novo fornecedor", async () => {
    const repositorio = new FornecedorRepositoryMemoria(fornecedores);
    await repositorio.criar({ name: "Fornecedor C", phone: "", category: "Mercearia", purchaseFrequency: "Mensal" });

    const resultado = await repositorio.listar();
    expect(resultado).toHaveLength(3);
    expect(resultado.find((f) => f.name === "Fornecedor C")).toBeDefined();
  });

  it("atualiza somente o fornecedor informado", async () => {
    const repositorio = new FornecedorRepositoryMemoria(fornecedores);
    await repositorio.atualizar("Fornecedor A", { name: "Fornecedor A", phone: "5514911111111", category: "Bebidas", purchaseFrequency: "Semanal" });

    const resultado = await repositorio.listar();
    expect(resultado.find((f) => f.name === "Fornecedor A")?.phone).toBe("5514911111111");
    expect(resultado.find((f) => f.name === "Fornecedor B")?.phone).toBe("5514900000002");
  });

  it("exclui um fornecedor existente", async () => {
    const repositorio = new FornecedorRepositoryMemoria(fornecedores);
    await repositorio.excluir("Fornecedor B");

    const resultado = await repositorio.listar();
    expect(resultado).toHaveLength(1);
    expect(resultado.find((f) => f.name === "Fornecedor B")).toBeUndefined();
  });
});
