import { calcularEstoqueAposEntrada } from "../../domain/rules/calcularEstoque";
import { ProdutoEstoque, SaidaEstoque } from "../../types/estoque";

export function registrarEntradaEstoque(
  produtos: ProdutoEstoque[],
  produtoId: string,
  quantidade: number,
  data = new Date(),
  gerarId: () => string = () => crypto.randomUUID(),
) {
  const produto = produtos.find((item) => item.id === produtoId);
  if (!produto) {
    throw new Error("Produto não encontrado.");
  }

  const estoqueAnterior = produto.currentStock;
  const estoqueAtual = calcularEstoqueAposEntrada(estoqueAnterior, quantidade);
  const produtoAtualizado = { ...produto, currentStock: estoqueAtual };
  const produtosAtualizados = produtos.map((item) => item.id === produtoId ? produtoAtualizado : item);
  const movimentacao: SaidaEstoque = {
    id: `${data.getTime()}-${produto.id}-${gerarId()}`,
    tipo: "entrada",
    date: data.toLocaleDateString("pt-BR"),
    time: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    productName: produto.name,
    category: produto.category,
    quantity: quantidade,
    unit: produto.unit,
    previousStock: estoqueAnterior,
    currentStock: estoqueAtual,
    supplier: produto.supplier,
  };

  return {
    produto,
    produtoAtualizado,
    produtosAtualizados,
    movimentacao,
  };
}
