export type ProdutoEstoque = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
};

export type SaidaEstoque = {
  id: string;
  time: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  previousStock: number;
  currentStock: number;
  supplier: string;
};

export type ItemCompra = ProdutoEstoque & {
  quantityToBuy: number;
};

export type Fornecedor = {
  name: string;
  phone: string;
  category: string;
  purchaseFrequency: string;
};
