import type { Fornecedor } from "../../../domain/entities/Fornecedor";
import type { SupplierInsert, SupplierRow } from "../database.types";

export function mapFornecedorRowToDomain(row: SupplierRow): Fornecedor {
  return {
    name: row.name,
    phone: row.phone,
    category: row.category,
    purchaseFrequency: row.purchase_frequency,
  };
}

export function mapFornecedorDomainToInsert(fornecedor: Fornecedor): SupplierInsert {
  return {
    name: fornecedor.name,
    phone: fornecedor.phone,
    category: fornecedor.category,
    purchase_frequency: fornecedor.purchaseFrequency,
  };
}
