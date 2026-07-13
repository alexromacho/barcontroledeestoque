import { FormEvent, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Session } from "@supabase/supabase-js";
import { DashboardHeader } from "./components/DashboardHeader";
import { EntradasPage } from "./components/EntradasPage";
import { EstoqueProdutos } from "./components/EstoqueProdutos";
import { FornecedoresPage } from "./components/FornecedoresPage";
import { HistoricoSaidas } from "./components/HistoricoSaidas";
import { ListaCompraAutomatica } from "./components/ListaCompraAutomatica";
import { LoginPage } from "./components/LoginPage";
import { SaidaDoDia, SaidaPendente } from "./components/SaidaDoDia";
import { Sidebar } from "./components/Sidebar";
import { SummaryCards } from "./components/SummaryCards";
import { agruparListaCompraPorFornecedor, gerarListaCompra } from "./application/useCases/GerarListaCompra";
import { montarPedidoFornecedor } from "./application/useCases/MontarPedidoFornecedor";
import { registrarEntradaEstoque } from "./application/useCases/RegistrarEntradaEstoque";
import { registrarSaidasEstoque, validarSaidaPendente } from "./application/useCases/RegistrarSaidaEstoque";
import { fornecedores } from "./data/fornecedores";
import { produtosEstoque } from "./data/produtos";
import { Fornecedor, ItemCompra, ItemCompraManual, ListaSemanalRegistro, MovimentacaoEstoque, ProdutoEstoque } from "./types/estoque";
import { normalizarTexto } from "./utils/normalizarTexto";
import { abrirPedidoWhatsApp } from "./infrastructure/services/WhatsAppService";
import { supabase } from "./lib/supabase";
import "./styles.css";

function DashboardTeste({ onLogout }: { onLogout: () => void }) {
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>(produtosEstoque);
  const [termoBusca, setTermoBusca] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [historicoMovimentacoes, setHistoricoMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [saidasPendentes, setSaidasPendentes] = useState<SaidaPendente[]>([]);
  const [itensCompraManual, setItensCompraManual] = useState<ItemCompraManual[]>([]);
  const [itensCompraOcultos, setItensCompraOcultos] = useState<Set<string>>(() => new Set());
  const [historicoListas, setHistoricoListas] = useState<ListaSemanalRegistro[]>([]);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<"dashboard" | "entradas" | "fornecedores">("dashboard");
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
    return gerarListaCompra({
      produtos,
      itensManuais: itensCompraManual,
      itensOcultos: itensCompraOcultos,
    });
  }, [itensCompraManual, itensCompraOcultos, produtos]);

  const itensCompraPorFornecedor = useMemo(() => {
    return agruparListaCompraPorFornecedor(itensCompra);
  }, [itensCompra]);

  const lowStockCount = produtos.filter((product) => product.currentStock < product.minimumStock).length;
  const todayExits = historicoMovimentacoes
    .filter((record) => record.tipo === "saida")
    .reduce((total, record) => total + record.quantity, 0);
  const selectedUnit = selectedProduct?.unit ?? "unidades";

  function registerExit(event: FormEvent) {
    event.preventDefault();

    const product = produtos.find((item) => item.id === selectedProductId);
    const exitQuantity = Number(quantity);

    if (!product) {
      setMessage("Selecione um produto e informe uma quantidade válida.");
      return;
    }

    const quantidadeJaPendente = saidasPendentes
      .filter((saida) => saida.product.id === product.id)
      .reduce((total, saida) => total + saida.quantity, 0);

    try {
      validarSaidaPendente(product, exitQuantity, quantidadeJaPendente);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível registrar a saída.");
      return;
    }

    setSaidasPendentes((atuais) => [
      ...atuais,
      { id: crypto.randomUUID(), product, quantity: exitQuantity },
    ]);
    setQuantity("1");
    setMessage(`${product.name}: adicionado à lista de confirmação.`);
  }

  function confirmPendingExits() {
    if (saidasPendentes.length === 0) return;

    const totais = saidasPendentes.reduce<Record<string, number>>((acc, saida) => {
      acc[saida.product.id] = (acc[saida.product.id] ?? 0) + saida.quantity;
      return acc;
    }, {});
    const { produtosAtualizados, movimentacoes } = registrarSaidasEstoque(
      produtos,
      totais,
      new Date(),
      () => crypto.randomUUID(),
    );

    setProdutos(produtosAtualizados);
    setHistoricoMovimentacoes((atuais) => [...movimentacoes, ...atuais]);
    setItensCompraOcultos((atuais) => {
      const proximos = new Set(atuais);
      Object.keys(totais).forEach((id) => proximos.delete(id));
      return proximos;
    });
    setSaidasPendentes([]);
    setSelectedProductId("");
    setTermoBusca("");
    setQuantity("1");
    setMessage(`${movimentacoes.length} ${movimentacoes.length === 1 ? "saída confirmada" : "saídas confirmadas"}.`);
  }

  function generateWeeklyList() {
    const fornecedoresDaLista = fornecedores.flatMap((fornecedor) => {
      const itens = itensCompraPorFornecedor[fornecedor.name] ?? [];
      if (itens.length === 0) return [];
      return [{
        name: fornecedor.name,
        itens: itens.map((item) => ({ name: item.name, quantity: item.quantityToBuy, unit: item.unit, unitPrice: item.unitPrice ?? 0 })),
      }];
    });

    if (fornecedoresDaLista.length === 0) {
      setMessage("Nenhum fornecedor possui itens na lista de compra.");
      return "";
    }
    const agora = new Date();
    setHistoricoListas((atuais) => [{
      id: crypto.randomUUID(),
      createdAt: agora.toISOString(),
      date: agora.toLocaleDateString("pt-BR"),
      time: agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      fornecedores: fornecedoresDaLista,
    }, ...atuais]);
    const grupos = fornecedoresDaLista.map((fornecedor) => {
      const linhas = fornecedor.itens.map((item) => `- ${item.quantity} ${item.unit} de ${item.name} — R$ ${(item.quantity * item.unitPrice).toFixed(2).replace(".", ",")}`);
      return `${fornecedor.name}\n${linhas.join("\n")}`;
    });
    const totalSemana = fornecedoresDaLista.reduce((total, fornecedor) =>
      total + fornecedor.itens.reduce((subtotal, item) => subtotal + item.quantity * item.unitPrice, 0), 0,
    );
    setMessage("Lista da semana gerada em bloco de notas.");
    return `LISTA DA SEMANA\n\n${grupos.join("\n\n")}\n\nTOTAL DA SEMANA: R$ ${totalSemana.toFixed(2).replace(".", ",")}`;
  }

  function clearWeeklyList() {
    setItensCompraOcultos((atuais) => {
      const proximos = new Set(atuais);
      itensCompra.forEach((item) => proximos.add(item.id));
      return proximos;
    });
    setItensCompraManual([]);
    setMessage("Lista da semana gerada e zerada.");
  }

  function sendSupplierOrder(fornecedor: Fornecedor, itens: ItemCompra[]) {
    if (!fornecedor.phone || itens.length === 0) {
      setMessage("Este fornecedor não possui telefone ou itens na lista.");
      return;
    }
    const pedido = montarPedidoFornecedor(fornecedor, itens);
    abrirPedidoWhatsApp(pedido.fornecedor, pedido.itens);
    setMessage(`WhatsApp aberto para ${fornecedor.name}.`);
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
    setItensCompraOcultos((atuais) => {
      const proximos = new Set(atuais);
      proximos.delete(product.id);
      return proximos;
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
    setItensCompraOcultos((atuais) => {
      const proximos = new Set(atuais);
      proximos.delete(product.id);
      return proximos;
    });

    setMessage(`${product.name}: quantidade atualizada na lista.`);
  }

  function removeManualPurchaseItem(productId: string) {
    setItensCompraManual((items) => items.filter((item) => item.produtoId !== productId));
    setMessage("Item manual removido da lista de compra.");
  }

  function addSupplierProduct(produto: ProdutoEstoque) {
    setProdutos((atuais) => [...atuais, produto]);
    setMessage(`${produto.name}: item adicionado a ${produto.supplier}.`);
  }

  function registerInvoiceEntry(produtoId: string, quantidade: number) {
    const { produto, produtosAtualizados, movimentacao } = registrarEntradaEstoque(produtos, produtoId, quantidade);
    setProdutos(produtosAtualizados);
    setHistoricoMovimentacoes((atuais) => [movimentacao, ...atuais]);
    setItensCompraOcultos((atuais) => {
      const proximos = new Set(atuais);
      proximos.delete(produtoId);
      return proximos;
    });
    setMessage(`${produto.name}: entrada de ${quantidade} ${produto.unit} registrada pela nota fiscal.`);
  }

  function deleteSupplierProduct(produto: ProdutoEstoque) {
    if (!window.confirm(`Excluir ${produto.name} da lista de ${produto.supplier}?`)) return;
    setProdutos((atuais) => atuais.filter((item) => item.id !== produto.id));
    setItensCompraManual((atuais) => atuais.filter((item) => item.produtoId !== produto.id));
    setMessage(`${produto.name}: item excluído.`);
  }

  function renameSupplierProduct(produto: ProdutoEstoque, novoNome: string) {
    setProdutos((atuais) => atuais.map((item) =>
      item.id === produto.id ? { ...item, name: novoNome } : item,
    ));
    setMessage(`${produto.name} foi renomeado para ${novoNome}.`);
  }

  function updateSupplierProductPrice(produto: ProdutoEstoque, valor: number) {
    setProdutos((atuais) => atuais.map((item) =>
      item.id === produto.id ? { ...item, unitPrice: valor } : item,
    ));
    setMessage(`${produto.name}: valor atualizado para R$ ${valor.toFixed(2).replace(".", ",")}.`);
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
      <Sidebar
        isOpen={sidebarOpen}
        activePage={activePage}
        onNavigate={setActivePage}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />

      <main className="dashboard-main">
        <div className="dashboard-watermark" aria-hidden="true" />
        <div className="dashboard-content">
          {activePage === "dashboard" ? (
            <>
              <DashboardHeader
                currentDateTime={currentDateTime}
                onOpenMenu={() => setSidebarOpen(true)}
              />

              <SummaryCards
                produtosCadastrados={produtos.length}
                abaixoDoMinimo={lowStockCount}
                saidasHoje={todayExits}
                itensParaComprar={itensCompra.length}
                fornecedoresAtivos={fornecedores.length}
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
                  produtos={produtos}
                  saidasPendentes={saidasPendentes}
                  onRemoverPendente={(id) => setSaidasPendentes((atuais) => atuais.filter((saida) => saida.id !== id))}
                  onConfirmarPendentes={confirmPendingExits}
                  onSubmit={registerExit}
                />

                <ListaCompraAutomatica
                  fornecedores={fornecedores}
                  produtos={produtos}
                  itensCompraPorFornecedor={itensCompraPorFornecedor}
                  historicoListas={historicoListas}
                  onAdicionarManual={addManualPurchaseItem}
                  onEditarItem={editPurchaseItem}
                  onRemoverManual={removeManualPurchaseItem}
                  onEnviarPedido={sendSupplierOrder}
                  onGerarListaSemanal={generateWeeklyList}
                  onLimparListaSemanal={clearWeeklyList}
                />
              </section>

              <EstoqueProdutos produtos={produtos} onRegistrarEntrada={registerInvoiceEntry} />
              <section className="teste-panel teste-future-panel" aria-labelledby="future-image-title">
                <div className="teste-panel-heading">
                  <div>
                    <span className="teste-eyebrow">Em desenvolvimento</span>
                    <h2 id="future-image-title">Entrada e conferência por imagem</h2>
                  </div>
                </div>
                <p>
                  Recurso futuro. Exigirá armazenamento, Supabase e serviço de IA.
                </p>
                <div className="teste-future-actions" aria-label="Recursos futuros indisponíveis">
                  <button type="button" disabled>Fotografar nota</button>
                  <button type="button" disabled>Fotografar prateleira</button>
                  <button type="button" disabled>Gravar vídeo do estoque</button>
                </div>
              </section>
              <HistoricoSaidas movimentacoes={historicoMovimentacoes} />
            </>
          ) : activePage === "entradas" ? (
            <EntradasPage
              fornecedores={fornecedores}
              produtos={produtos}
              currentDateTime={currentDateTime}
              onOpenMenu={() => setSidebarOpen(true)}
            />
          ) : (
            <FornecedoresPage
              fornecedores={fornecedores}
              produtos={produtos}
              historicoListas={historicoListas}
              currentDateTime={currentDateTime}
              onOpenMenu={() => setSidebarOpen(true)}
              onAddProduct={addSupplierProduct}
              onRenameProduct={renameSupplierProduct}
              onUpdatePrice={updateSupplierProductPrice}
              onDeleteProduct={deleteSupplierProduct}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <main className="auth-page"><p>Carregando...</p></main>;
  if (!session) return <LoginPage />;
  return <DashboardTeste onLogout={() => supabase.auth.signOut()} />;
}

createRoot(document.getElementById("root")!).render(<App />);
