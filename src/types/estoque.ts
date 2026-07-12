export type ProdutoEstoque = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  unitPrice?: number;
};

export type SaidaEstoque = {
  id: string;
  date: string;
  time: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  previousStock: number;
  currentStock: number;
  supplier: string;
};

export type OrigemItemCompra = "automatico" | "manual";

export type ItemCompraManual = {
  produtoId: string;
  fornecedorId: string;
  quantidade: number;
};

export type ItemCompra = ProdutoEstoque & {
  quantityToBuy: number;
  origem: OrigemItemCompra;
  quantidadeAutomatica: number;
  quantidadeManual: number;
};

export type Fornecedor = {
  name: string;
  phone: string;
  category: string;
  purchaseFrequency: string;
};

export type ListaSemanalRegistro = {
  id: string;
  createdAt: string;
  date: string;
  time: string;
  fornecedores: Array<{
    name: string;
    itens: Array<{
      name: string;
      quantity: number;
      unit: string;
      unitPrice: number;
    }>;
  }>;
};
