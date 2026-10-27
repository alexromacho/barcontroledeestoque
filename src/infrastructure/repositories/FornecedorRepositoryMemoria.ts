import { Fornecedor } from "../../types/estoque";
import { FornecedorRepository } from "./FornecedorRepository";

export class FornecedorRepositoryMemoria implements FornecedorRepository {
  private fornecedores: Fornecedor[];

  constructor(fornecedoresIniciais: Fornecedor[]) {
    this.fornecedores = fornecedoresIniciais.map((fornecedor) => ({ ...fornecedor }));
  }

  async listar() {
    return this.fornecedores.map((fornecedor) => ({ ...fornecedor }));
  }

  async criar(fornecedor: Fornecedor) {
    const novoFornecedor = { ...fornecedor };
    this.fornecedores = [...this.fornecedores, novoFornecedor];
    return { ...novoFornecedor };
  }

  async atualizar(nome: string, fornecedorAtualizado: Fornecedor) {
    this.fornecedores = this.fornecedores.map((fornecedor) =>
      fornecedor.name === nome ? { ...fornecedorAtualizado } : fornecedor,
    );
  }

  async excluir(nome: string) {
    this.fornecedores = this.fornecedores.filter((fornecedor) => fornecedor.name !== nome);
  }
}
