import { Fornecedor } from "../../types/estoque";

export interface FornecedorRepository {
  listar(): Promise<Fornecedor[]>;
  criar(fornecedor: Fornecedor): Promise<Fornecedor>;
  atualizar(nome: string, fornecedor: Fornecedor): Promise<void>;
  excluir(nome: string): Promise<void>;
}
