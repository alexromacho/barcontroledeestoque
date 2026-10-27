import { ListaSemanalRegistro } from "../../types/estoque";
import { ListaSemanalRepository } from "./ListaSemanalRepository";

export class ListaSemanalRepositoryMemoria implements ListaSemanalRepository {
  private listas: ListaSemanalRegistro[];

  constructor(listasIniciais: ListaSemanalRegistro[] = []) {
    this.listas = listasIniciais.map((lista) => ({ ...lista }));
  }

  async listar() {
    return this.listas.map((lista) => ({ ...lista }));
  }

  async registrar(lista: ListaSemanalRegistro) {
    this.listas = [{ ...lista }, ...this.listas];
  }
}
