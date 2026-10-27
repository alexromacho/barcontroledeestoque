import { ListaSemanalRegistro } from "../../types/estoque";

export interface ListaSemanalRepository {
  listar(): Promise<ListaSemanalRegistro[]>;
  registrar(lista: ListaSemanalRegistro): Promise<void>;
}
