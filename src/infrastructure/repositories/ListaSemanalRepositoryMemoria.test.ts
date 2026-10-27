import { describe, expect, it } from "vitest";
import type { ListaSemanalRegistro } from "../../types/estoque";
import { ListaSemanalRepositoryMemoria } from "./ListaSemanalRepositoryMemoria";

const registro: ListaSemanalRegistro = {
  id: "lista-1",
  createdAt: "2026-07-12T21:30:00.000Z",
  date: "12/07/2026",
  time: "18:30",
  fornecedores: [{ name: "Caio Aragua", itens: [{ name: "Água sem gás", quantity: 2, unit: "fardo", unitPrice: 1.8 }] }],
};

describe("ListaSemanalRepositoryMemoria", () => {
  it("lista vazio quando não há registros", async () => {
    const repositorio = new ListaSemanalRepositoryMemoria();
    await expect(repositorio.listar()).resolves.toEqual([]);
  });

  it("registra e lista com o mais recente primeiro", async () => {
    const repositorio = new ListaSemanalRepositoryMemoria();
    await repositorio.registrar(registro);
    await repositorio.registrar({ ...registro, id: "lista-2" });

    const resultado = await repositorio.listar();
    expect(resultado.map((item) => item.id)).toEqual(["lista-2", "lista-1"]);
  });
});
