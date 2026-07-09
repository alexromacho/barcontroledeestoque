import { FormEvent, ReactNode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  ArrowDownCircle,
  Boxes,
  ClipboardList,
  Send,
  ShoppingBasket,
  Truck,
} from "lucide-react";
import "./styles.css";

type Product = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
};

type SaidaEstoque = {
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

type PurchaseItem = Product & {
  quantityToBuy: number;
};

const supplier = {
  name: "João Vero Importa",
  category: "Destilados, Vinhos, Energéticos e Licores",
  purchaseFrequency: "Semanal",
};

const mockProducts: Product[] = [
  { id: "red-label", name: "Red Label", category: "Whisky", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "black-label", name: "Black Label", category: "Whisky", supplier: supplier.name, unit: "garrafas", currentStock: 5, minimumStock: 4 },
  { id: "jack-daniels", name: "Jack Daniel's", category: "Whisky", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "old-parr", name: "Old Parr", category: "Whisky", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "vodka-smirnoff", name: "Vodka Smirnoff", category: "Vodka", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "vodka-absolut", name: "Vodka Absolut", category: "Vodka", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "gin-tanqueray", name: "Gin Tanqueray", category: "Gin", supplier: supplier.name, unit: "garrafas", currentStock: 6, minimumStock: 6 },
  { id: "gin-seagers", name: "Gin Seagers", category: "Gin", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "bacardi-ouro", name: "Bacardi Ouro", category: "Rum", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "bacardi-prata", name: "Bacardi Prata", category: "Rum", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "domecq", name: "Domecq", category: "Conhaques / Brandy", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "sao-joao-barra", name: "São João da Barra", category: "Conhaques / Brandy", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "macieira-portuguesa", name: "Macieira Portuguesa", category: "Conhaques / Brandy", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "fundador", name: "Fundador", category: "Conhaques / Brandy", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "presidente", name: "Presidente", category: "Conhaques / Brandy", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "licor-43", name: "Licor 43", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "cointreau", name: "Cointreau", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "amarula", name: "Amarula", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "malibu", name: "Malibu", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "cynar", name: "Cynar", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "cinzano", name: "Cinzano", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "martini-bianco", name: "Martini Bianco", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "absinto", name: "Absinto", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "jurubeba", name: "Jurubeba", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "underberg", name: "Underberg", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "campari", name: "Campari", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 6, minimumStock: 6 },
  { id: "jagermeister", name: "Jägermeister", category: "Licores e Aperitivos", supplier: supplier.name, unit: "garrafas", currentStock: 6, minimumStock: 6 },
  { id: "boazinha", name: "Cachaça Boazinha", category: "Cachaças", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "seleta", name: "Seleta", category: "Cachaças", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "claudionor", name: "Claudionor", category: "Cachaças", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "salinas", name: "Salinas", category: "Cachaças", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "sagatiba", name: "Sagatiba", category: "Cachaças", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "velho-barreiro", name: "Velho Barreiro", category: "Cachaças", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "ypioca-ouro", name: "Ypióca Ouro", category: "Ypióca", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "ypioca-prata", name: "Ypióca Prata", category: "Ypióca", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "tequila-prata", name: "Tequila Prata", category: "Tequila", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "tequila-ouro", name: "Tequila Ouro", category: "Tequila", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "sake", name: "Sakê", category: "Saquê", supplier: supplier.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "steinhaeger-becosa", name: "Steinhaeger Becosa", category: "Steinhaeger", supplier: supplier.name, unit: "garrafas", currentStock: 2, minimumStock: 2 },
  { id: "vale-veneto-tinto-seco", name: "Vale Veneto Tinto Seco", category: "Vinhos", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "vale-veneto-tinto-suave", name: "Vale Veneto Tinto Suave", category: "Vinhos", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "vale-veneto-branco-seco", name: "Vale Veneto Branco Seco", category: "Vinhos", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "periquita", name: "Periquita", category: "Vinhos", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "miolo", name: "Miolo", category: "Vinhos", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "concha-y-toro", name: "Concha y Toro", category: "Vinhos", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "lambrusco-rosso", name: "Lambrusco Rosso", category: "Vinhos", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "lambrusco-bianco", name: "Lambrusco Bianco", category: "Vinhos", supplier: supplier.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "garrafao-vale-veneto-tinto-seco", name: "Garrafão Vale Veneto Tinto Seco", category: "Garrafões", supplier: supplier.name, unit: "garrafões", currentStock: 1, minimumStock: 1 },
  { id: "garrafao-vale-veneto-tinto-suave", name: "Garrafão Vale Veneto Tinto Suave", category: "Garrafões", supplier: supplier.name, unit: "garrafões", currentStock: 1, minimumStock: 1 },
  { id: "garrafao-vale-veneto-branco-seco", name: "Garrafão Vale Veneto Branco Seco", category: "Garrafões", supplier: supplier.name, unit: "garrafões", currentStock: 1, minimumStock: 1 },
  { id: "red-bull-tradicional", name: "Fardo Red Bull Tradicional", category: "Energéticos", supplier: supplier.name, unit: "fardos", currentStock: 2, minimumStock: 2 },
  { id: "red-bull-tropical", name: "Fardo Red Bull Tropical", category: "Energéticos", supplier: supplier.name, unit: "fardos", currentStock: 2, minimumStock: 2 },
  { id: "ice-smirnoff", name: "Ice Smirnoff", category: "Ice", supplier: supplier.name, unit: "fardos", currentStock: 1, minimumStock: 1 },
];

function DashboardTeste() {
  const [produtos, setProdutos] = useState<Product[]>(mockProducts);
  const [termoBusca, setTermoBusca] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(mockProducts[0].id);
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

  const purchaseItems = useMemo<PurchaseItem[]>(() => {
    return produtos
      .filter((product) => product.currentStock < product.minimumStock)
      .map((product) => ({
        ...product,
        quantityToBuy: product.minimumStock - product.currentStock,
      }));
  }, [produtos]);

  const lowStockCount = purchaseItems.length;
  const activeSuppliers = 1;
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

  function sendPurchaseOrder() {
    setMessage(`Pedido enviado para ${supplier.name}`);
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
          <MetricCard icon={<ClipboardList />} label="Itens na lista de compra" value={purchaseItems.length.toString()} tone="warning" />
        </div>
      </section>

      {message && (
        <button className="teste-notice" type="button" onClick={() => setMessage("")}>
          {message}
        </button>
      )}

      <section className="teste-grid">
        <article className="teste-panel">
          <div className="teste-panel-heading">
            <div>
              <span className="teste-eyebrow">Seção 1</span>
              <h2>Saída do Dia</h2>
            </div>
            <Boxes size={24} />
          </div>

          <form className="teste-form" onSubmit={registerExit}>
            <label>
              Buscar produto
              <input
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar produto..."
              />
            </label>

            <div className="teste-search-results" aria-label="Produtos filtrados">
              {produtosFiltrados.length === 0 ? (
                <p className="teste-empty">Nenhum produto encontrado.</p>
              ) : (
                produtosFiltrados.slice(0, 8).map((produto) => (
                  <button
                    className={produto.id === selectedProductId ? "teste-search-result is-selected" : "teste-search-result"}
                    key={produto.id}
                    type="button"
                    onClick={() => setSelectedProductId(produto.id)}
                  >
                    <span>{produto.name}</span>
                    <small>{produto.category} · {produto.supplier}</small>
                  </button>
                ))
              )}
            </div>

            <label>
              Produto
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                {!produtosFiltrados.some((product) => product.id === selectedProductId) && selectedProduct && (
                  <option value={selectedProduct.id}>
                    {selectedProduct.name} · atual {selectedProduct.currentStock} · mínimo {selectedProduct.minimumStock}
                  </option>
                )}
                {produtosFiltrados.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} · atual {product.currentStock} · mínimo {product.minimumStock}
                  </option>
                ))}
              </select>
            </label>

            <div className="teste-form-row">
              <label>
                Quantidade
                <input
                  min="1"
                  step="1"
                  type="number"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                />
              </label>
              <div className="teste-unit-card">
                <span>Unidade</span>
                <strong>{selectedUnit}</strong>
              </div>
            </div>

            <button type="submit">Registrar saída</button>
          </form>
        </article>

        <article className="teste-panel">
          <div className="teste-panel-heading">
            <div>
              <span className="teste-eyebrow">Seção 3</span>
              <h2>Pedido sugerido - João Vero Importa</h2>
            </div>
            <ShoppingBasket size={24} />
          </div>

          <div className="teste-supplier-summary">
            <strong>{supplier.name}</strong>
            <span>{supplier.category}</span>
            <span>Frequência de compra: {supplier.purchaseFrequency}</span>
          </div>

          <div className="teste-purchase-list">
            {purchaseItems.length === 0 ? (
              <p className="teste-empty">Nenhum item abaixo do mínimo.</p>
            ) : (
              purchaseItems.map((item) => (
                <div className="teste-purchase-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>Atual {item.currentStock} · mínimo {item.minimumStock}</span>
                  </div>
                  <b>Comprar {item.quantityToBuy} {item.unit}</b>
                </div>
              ))
            )}
          </div>

          <button type="button" onClick={sendPurchaseOrder}>
            <Send size={18} />
            Enviar pedido
          </button>
        </article>
      </section>

      <section className="teste-panel">
        <div className="teste-panel-heading">
          <div>
            <span className="teste-eyebrow">Seção 2</span>
            <h2>Estoque João Vero Importa</h2>
          </div>
          <Truck size={24} />
        </div>

        <div className="teste-table-wrap">
          <table className="teste-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Fornecedor</th>
                <th>Unidade</th>
                <th>Atual</th>
                <th>Mínimo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((product) => {
                const quantityToBuy = Math.max(0, product.minimumStock - product.currentStock);
                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.supplier}</td>
                    <td>{product.unit}</td>
                    <td>{product.currentStock}</td>
                    <td>{product.minimumStock}</td>
                    <td>
                      {quantityToBuy > 0 ? (
                        <span className="teste-status buy">Comprar {quantityToBuy} {product.unit}</span>
                      ) : (
                        <span className="teste-status ok">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="teste-panel">
        <div className="teste-panel-heading">
          <div>
            <span className="teste-eyebrow">Seção 4</span>
            <h2>Histórico de Saídas do Dia</h2>
          </div>
        </div>

        <div className="teste-table-wrap">
          <table className="teste-table">
            <thead>
              <tr>
                <th>Horário</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Quantidade</th>
                <th>Unidade</th>
                <th>Estoque anterior</th>
                <th>Estoque atual</th>
                <th>Fornecedor</th>
              </tr>
            </thead>
            <tbody>
              {historicoSaidas.length === 0 ? (
                <tr>
                  <td colSpan={8}>Nenhuma saída registrada hoje.</td>
                </tr>
              ) : (
                historicoSaidas.map((record) => (
                  <tr key={record.id}>
                    <td>{record.time}</td>
                    <td>{record.productName}</td>
                    <td>{record.category}</td>
                    <td>{record.quantity}</td>
                    <td>{record.unit}</td>
                    <td>{record.previousStock}</td>
                    <td>{record.currentStock}</td>
                    <td>{record.supplier}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
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
