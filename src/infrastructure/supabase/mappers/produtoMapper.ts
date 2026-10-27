import type { Produto } from "../../../domain/entities/Produto";
import type { ProdutoComFornecedorRow, ProdutoInsert, ProdutoUpdate } from "../database.types";

export function mapProdutoRowToDomain(row: ProdutoComFornecedorRow): Produto {
  if (!row.suppliers) {
    throw new Error(`Fornecedor não encontrado para o produto ${row.id}.`);
  }

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    supplier: row.suppliers.name,
    unit: row.unit,
    currentStock: row.current_stock,
    minimumStock: row.minimum_stock,
    unitPrice: row.unit_price,
  };
}

export function mapProdutoDomainToUpdate(produto: Produto): ProdutoUpdate {
  return {
    name: produto.name,
    category: produto.category,
    unit: produto.unit,
    current_stock: produto.currentStock,
    minimum_stock: produto.minimumStock,
    unit_price: produto.unitPrice ?? 0,
  };
}

export function mapProdutoDomainToInsert(produto: Omit<Produto, "id">, supplierId: string): ProdutoInsert {
  return {
    supplier_id: supplierId,
    name: produto.name,
    category: produto.category,
    unit: produto.unit,
    current_stock: produto.currentStock,
    minimum_stock: produto.minimumStock,
    unit_price: produto.unitPrice ?? 0,
  };
}
