import { FormEvent, ReactNode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AlertTriangle, ArrowDownCircle, ClipboardList, Truck } from "lucide-react";
import { EstoqueProdutos } from "./components/EstoqueProdutos";
import { HistoricoSaidas } from "./components/HistoricoSaidas";
import { ListaCompraAutomatica } from "./components/ListaCompraAutomatica";
import { SaidaDoDia } from "./components/SaidaDoDia";
import { fornecedores, produtosEstoque } from "./data/produtosJoaoVero";
import { Fornecedor, ItemCompra, ProdutoEstoque, SaidaEstoque } from "./types/estoque";
import "./styles.css";

function DashboardTeste() {
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>(produtosEstoque);
  const [termoBusca, setTermoBusca] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(produtosEstoque[0].id);
  const [quantity, setQuantity] = useState("1");
  const [historicoSaidas, setHistoricoSaidas] = useState<SaidaEstoque[]>([]);
  const [message, setMessage] = useState("");

  const produtosFiltrados = useMemo(() => {
    const busca = termoBusca.trim().toLowerCase();
    if (!busca) return produtos;

    return produtos.filter((produto) =>
      produto.name.toLowerCase().includes(busca) ||
      produto.category.toLowerCase().includes(busca) ||
      produto.supplier.toLowerCase().includes(busca),
    );
  }, [produtos, termoBusca]);

  const selectedProduct = produtos.find((product) => product.id === selectedProductId);

  const itensCompra = useMemo<ItemCompra[]>(() => {
    return produtos
      .filter((product) => product.currentStock < product.minimumStock)
      .map((product) => ({
        ...product,
        quantityToBuy: product.minimumStock - product.currentStock,
      }));
  }, [produtos]);

  const itensCompraPorFornecedor = useMemo(() => {
    return itensCompra.reduce<Record<string, ItemCompra[]>>((groups, item) => {
      groups[item.supplier] = [...(groups[item.supplier] ?? []), item];
      return groups;
    }, {});
  }, [itensCompra]);

  const lowStockCount = itensCompra.length;
  const activeSuppliers = fornecedores.length;
  const todayExits = historicoSaidas.reduce((total, record) => total + record.quantity, 0);
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

  function sendPurchaseOrder(fornecedor: Fornecedor) {
    setMessage(`Pedido enviado para ${fornecedor.name}`);
  }

  return (
    <main className="teste-shell">
      <header className="teste-header">
        <div>
          <span className="teste-eyebrow">Sistema interno</span>
          <h1>Dashboard - Bar do Português</h1>
          <p>Controle de saídas, estoque e pedidos de compra</p>
        </div>
        <div className="teste-badge">Mock front-end</div>
      </header>

      <section className="teste-section-block" aria-labelledby="resumo-title">
        <div className="teste-section-title">
          <span className="teste-eyebrow">Dashboard</span>
          <h2 id="resumo-title">Resumo</h2>
        </div>
        <div className="teste-metrics" aria-label="Indicadores">
          <MetricCard icon={<AlertTriangle />} label="Produtos com estoque baixo" value={lowStockCount.toString()} tone="danger" />
          <MetricCard icon={<ArrowDownCircle />} label="Saídas registradas hoje" value={todayExits.toString()} tone="neutral" />
          <MetricCard icon={<Truck />} label="Fornecedores ativos" value={activeSuppliers.toString()} tone="good" />
          <MetricCard icon={<ClipboardList />} label="Itens na lista de compra" value={itensCompra.length.toString()} tone="warning" />
        </div>
      </section>

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
          itensCompraPorFornecedor={itensCompraPorFornecedor}
          onEnviarPedido={sendPurchaseOrder}
        />
      </section>

      <EstoqueProdutos produtos={produtos} />
      <HistoricoSaidas historicoSaidas={historicoSaidas} />
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "danger" | "warning" | "good" | "neutral";
}) {
  return (
    <article className={`teste-metric ${tone}`}>
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

createRoot(document.getElementById("root")!).render(<DashboardTeste />);
