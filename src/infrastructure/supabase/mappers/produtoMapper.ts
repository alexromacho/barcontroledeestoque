import type { Produto } from "../../../domain/entities/Produto";
import type { ProdutoComFornecedorRow, ProdutoUpdate } from "../database.types";

export function mapProdutoRowToDomain(row: ProdutoComFornecedorRow): Produto {
  if (!row.fornecedores) {
    throw new Error(`Fornecedor não encontrado para o produto ${row.id}.`);
  }

  return {
    id: row.id,
    name: row.nome,
    category: row.categoria,
    supplier: row.fornecedores.nome,
    unit: row.unidade,
    currentStock: row.estoque_atual,
    minimumStock: row.estoque_minimo,
    unitPrice: row.valor_unitario,
  };
}

export function mapProdutoDomainToUpdate(produto: Produto): ProdutoUpdate {
  return {
    nome: produto.name,
    categoria: produto.category,
    unidade: produto.unit,
    estoque_atual: produto.currentStock,
    estoque_minimo: produto.minimumStock,
    valor_unitario: produto.unitPrice ?? 0,
  };
}
