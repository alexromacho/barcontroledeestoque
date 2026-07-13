import { calcularEstoqueAposSaida } from "../../domain/rules/calcularEstoque";
import { validarSaidaEstoque } from "../../domain/rules/validarMovimentacao";
import { MovimentacaoEstoque, ProdutoEstoque } from "../../types/estoque";

export function validarSaidaPendente(produto: ProdutoEstoque, quantidade: number, quantidadeJaPendente: number) {
  validarSaidaEstoque(produto.currentStock - quantidadeJaPendente, quantidade);
}

export function registrarSaidasEstoque(
  produtos: ProdutoEstoque[],
  totaisPorProduto: Record<string, number>,
  data: Date,
  gerarId: () => string,
) {
  const movimentacoes: MovimentacaoEstoque[] = [];
  const produtosAtualizados = produtos.map((produto) => {
    const quantidade = totaisPorProduto[produto.id] ?? 0;
    if (quantidade === 0) return produto;

    const estoqueAnterior = produto.currentStock;
    const estoqueAtual = calcularEstoqueAposSaida(estoqueAnterior, quantidade);

    movimentacoes.push({
      id: `${Date.now()}-${produto.id}-${gerarId()}`,
      tipo: "saida",
      date: data.toLocaleDateString("pt-BR"),
      time: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      productName: produto.name,
      category: produto.category,
      quantity: quantidade,
      unit: produto.unit,
      previousStock: estoqueAnterior,
      currentStock: estoqueAtual,
      supplier: produto.supplier,
    });

    return { ...produto, currentStock: estoqueAtual };
  });

  return {
    produtosAtualizados,
    movimentacoes,
  };
}
