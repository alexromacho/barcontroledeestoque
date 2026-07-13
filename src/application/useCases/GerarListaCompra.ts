import { calcularNecessidadeCompra } from "../../domain/rules/calcularNecessidadeCompra";
import { ItemCompra, ItemCompraManual, ProdutoEstoque } from "../../types/estoque";

type GerarListaCompraParams = {
  produtos: ProdutoEstoque[];
  itensManuais: ItemCompraManual[];
  itensOcultos?: Set<string>;
};

export function gerarListaCompra({
  produtos,
  itensManuais,
  itensOcultos = new Set(),
}: GerarListaCompraParams) {
  return produtos.reduce<ItemCompra[]>((items, product) => {
    if (itensOcultos.has(product.id)) return items;

    const quantidadeAutomatica = calcularNecessidadeCompra(product.currentStock, product.minimumStock);
    const itemManual = itensManuais.find((item) => item.produtoId === product.id);
    const quantidadeManual = itemManual?.quantidade ?? 0;
    const quantityToBuy = Math.max(quantidadeAutomatica, quantidadeManual);

    if (quantityToBuy <= 0) return items;

    items.push({
      ...product,
      quantityToBuy,
      origem: quantidadeManual > quantidadeAutomatica ? "manual" : "automatico",
      quantidadeAutomatica,
      quantidadeManual,
    });

    return items;
  }, []);
}

export function agruparListaCompraPorFornecedor(itens: ItemCompra[]) {
  return itens.reduce<Record<string, ItemCompra[]>>((groups, item) => {
    groups[item.supplier] = [...(groups[item.supplier] ?? []), item];
    return groups;
  }, {});
}
