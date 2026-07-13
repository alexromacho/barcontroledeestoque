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

export type TipoMovimentacao = "entrada" | "saida";

export type MovimentacaoEstoque = {
  id: string;
  tipo: TipoMovimentacao;
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

// Alias temporário para consumidores que ainda usam o nome histórico de saída.
export type SaidaEstoque = MovimentacaoEstoque;

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
