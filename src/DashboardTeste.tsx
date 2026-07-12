import { FormEvent, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { DashboardHeader } from "./components/DashboardHeader";
import { EstoqueProdutos } from "./components/EstoqueProdutos";
import { HistoricoSaidas } from "./components/HistoricoSaidas";
import { ListaCompraAutomatica } from "./components/ListaCompraAutomatica";
import { SaidaDoDia } from "./components/SaidaDoDia";
import { Sidebar } from "./components/Sidebar";
import { SummaryCards } from "./components/SummaryCards";
import { fornecedores, produtosEstoque } from "./data/produtosJoaoVero";
import { Fornecedor, ItemCompra, ItemCompraManual, ProdutoEstoque, SaidaEstoque } from "./types/estoque";
import "./styles.css";

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function DashboardTeste() {
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>(produtosEstoque);
  const [termoBusca, setTermoBusca] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(produtosEstoque[0].id);
  const [quantity, setQuantity] = useState("1");
  const [historicoSaidas, setHistoricoSaidas] = useState<SaidaEstoque[]>([]);
  const [itensCompraManual, setItensCompraManual] = useState<ItemCompraManual[]>([]);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(() =>
    new Date().toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }),
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentDateTime(
        new Date().toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
      );
    }, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  const produtosFiltrados = useMemo(() => {
    const busca = normalizarTexto(termoBusca);
    if (!busca) return produtos;

    return produtos.filter((produto) =>
      normalizarTexto(produto.name).includes(busca) ||
      normalizarTexto(produto.category).includes(busca) ||
      normalizarTexto(produto.supplier).includes(busca),
    );
  }, [produtos, termoBusca]);

  const selectedProduct = produtos.find((product) => product.id === selectedProductId);

  const itensCompra = useMemo<ItemCompra[]>(() => {
    return produtos.reduce<ItemCompra[]>((items, product) => {
      const quantidadeAutomatica = Math.max(0, product.minimumStock - product.currentStock);
      const itemManual = itensCompraManual.find((item) => item.produtoId === product.id);
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
  }, [itensCompraManual, produtos]);

  const itensCompraPorFornecedor = useMemo(() => {
    return itensCompra.reduce<Record<string, ItemCompra[]>>((groups, item) => {
      groups[item.supplier] = [...(groups[item.supplier] ?? []), item];
      return groups;
    }, {});
  }, [itensCompra]);

  const lowStockCount = produtos.filter((product) => product.currentStock < product.minimumStock).length;
  const estoqueTotal = produtos.reduce((total, product) => total + product.currentStock, 0);
  const selectedUnit = selectedProduct?.unit ?? "unidades";

  function registerExit(event: FormEvent) {
    event.preventDefault();

    const product = produtos.find((item) => item.id === selectedProductId);
    const exitQuantity = Number(quantity);

    if (!product || !Number.isFinite(exitQuantity) || exitQuantity <= 0) {
      setMessage("Selecione um produto e informe uma quantidade válida.");
      return;
    }

    if (exitQuantity > product.currentStock) {
      setMessage("A quantidade informada é maior que o estoque atual.");
      return;
    }

    const previousStock = product.currentStock;
    const nextStock = previousStock - exitQuantity;

    setProdutos((currentProducts) =>
      currentProducts.map((item) =>
        item.id === product.id ? { ...item, currentStock: nextStock } : item,
      ),
    );

    const novaSaida: SaidaEstoque = {
      id: `${Date.now()}-${product.id}-${crypto.randomUUID()}`,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      productName: product.name,
      category: product.category,
      quantity: exitQuantity,
      unit: product.unit,
      previousStock,
      currentStock: nextStock,
      supplier: product.supplier,
    };

    setHistoricoSaidas((saidasAnteriores) => [novaSaida, ...saidasAnteriores]);
    setQuantity("1");
    setMessage(
      nextStock < product.minimumStock
        ? `${product.name}: Comprar ${product.minimumStock - nextStock} ${product.unit}`
        : `${product.name}: saída registrada.`,
    );
  }

  function sendPurchaseOrder(fornecedor: Fornecedor, itensDoFornecedor: ItemCompra[]) {
    const linhasPedido = itensDoFornecedor.length > 0
      ? itensDoFornecedor.map((item) => `* ${item.quantityToBuy} ${item.unit} de ${item.name}`).join("\n")
      : "- Nenhum item abaixo do mínimo no momento.";
    const mensagem = encodeURIComponent(
      `Olá, tudo bem? Boa tarde, preciso de:\n\n${linhasPedido}\n\nObrigado.`,
    );
    const url = `https://wa.me/${fornecedor.phone}?text=${mensagem}`;

    setMessage(`Pedido enviado para ${fornecedor.name}`);
    window.open(url, "_blank");
  }

  function addManualPurchaseItem(product: ProdutoEstoque, quantidade: number) {
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      setMessage("Informe uma quantidade maior que zero.");
      return;
    }

    setItensCompraManual((items) => {
      const itemAtual = items.find((item) => item.produtoId === product.id);

      if (itemAtual) {
        return items.map((item) =>
          item.produtoId === product.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item,
        );
      }

      return [
        ...items,
        {
          produtoId: product.id,
          fornecedorId: product.supplier,
          quantidade,
        },
      ];
    });

    setMessage(`${product.name}: adicionado à lista de compra.`);
  }

  function editPurchaseItem(product: ProdutoEstoque, quantidade: number) {
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      setMessage("Informe uma quantidade maior que zero.");
      return;
    }

    const quantidadeAutomatica = Math.max(0, product.minimumStock - product.currentStock);

    if (quantidadeAutomatica > 0 && quantidade < quantidadeAutomatica) {
      setMessage(`A quantidade mínima automática para ${product.name} é ${quantidadeAutomatica} ${product.unit}.`);
      return;
    }

    setItensCompraManual((items) => {
      const itemAtual = items.find((item) => item.produtoId === product.id);

      if (itemAtual) {
        return items.map((item) =>
          item.produtoId === product.id ? { ...item, quantidade } : item,
        );
      }

      return [
        ...items,
        {
          produtoId: product.id,
          fornecedorId: product.supplier,
          quantidade,
        },
      ];
    });

    setMessage(`${product.name}: quantidade atualizada na lista.`);
  }

  function removeManualPurchaseItem(productId: string) {
    setItensCompraManual((items) => items.filter((item) => item.produtoId !== productId));
    setMessage("Item manual removido da lista de compra.");
  }

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Fechar menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <div className="dashboard-watermark" aria-hidden="true" />
        <div className="dashboard-content">
          <DashboardHeader
            currentDateTime={currentDateTime}
            onOpenMenu={() => setSidebarOpen(true)}
          />

          <SummaryCards
            produtosCadastrados={produtos.length}
            estoqueTotal={estoqueTotal}
            abaixoDoMinimo={lowStockCount}
            itensParaComprar={itensCompra.length}
          />

          {message && (
            <button className="teste-notice" type="button" onClick={() => setMessage("")}>
              {message}
            </button>
          )}

          <section className="teste-grid">
            <SaidaDoDia
              termoBusca={termoBusca}
              setTermoBusca={setTermoBusca}
              produtosFiltrados={produtosFiltrados}
              selectedProductId={selectedProductId}
              setSelectedProductId={setSelectedProductId}
              selectedProduct={selectedProduct}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedUnit={selectedUnit}
              onSubmit={registerExit}
            />

            <ListaCompraAutomatica
              fornecedores={fornecedores}
              produtos={produtos}
              itensCompraPorFornecedor={itensCompraPorFornecedor}
              onAdicionarManual={addManualPurchaseItem}
              onEditarItem={editPurchaseItem}
              onRemoverManual={removeManualPurchaseItem}
              onEnviarPedido={sendPurchaseOrder}
            />
          </section>

          <EstoqueProdutos produtos={produtos} />
          <HistoricoSaidas historicoSaidas={historicoSaidas} />
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<DashboardTeste />);
