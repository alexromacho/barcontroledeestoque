import { FormEvent, useState } from "react";
import { ChevronDown, ChevronUp, PackagePlus, Pencil, Trash2, Truck } from "lucide-react";
import { Fornecedor, ListaSemanalRegistro, ProdutoEstoque } from "../types/estoque";
import { normalizarTexto } from "../utils/normalizarTexto";
import { DashboardHeader } from "./DashboardHeader";

type FornecedoresPageProps = {
  fornecedores: Fornecedor[];
  produtos: ProdutoEstoque[];
  historicoListas: ListaSemanalRegistro[];
  currentDateTime: string;
  onOpenMenu: () => void;
  onAddProduct: (produto: ProdutoEstoque) => void;
  onRenameProduct: (produto: ProdutoEstoque, novoNome: string) => void;
  onUpdatePrice: (produto: ProdutoEstoque, valor: number) => void;
  onDeleteProduct: (produto: ProdutoEstoque) => void;
};

type NovoProduto = {
  name: string;
  category: string;
  unit: string;
  currentStock: string;
  minimumStock: string;
  unitPrice: string;
};

type CategoriaPendente = {
  fornecedor: Fornecedor;
  categoria: string;
};

const produtoVazio: NovoProduto = {
  name: "",
  category: "",
  unit: "unidade",
  currentStock: "0",
  minimumStock: "0",
  unitPrice: "0",
};

function distanciaEdicao(a: string, b: string) {
  const linha = Array.from({ length: b.length + 1 }, (_, indice) => indice);
  for (let i = 1; i <= a.length; i += 1) {
    let anterior = linha[0];
    linha[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const atual = linha[j];
      linha[j] = Math.min(
        linha[j] + 1,
        linha[j - 1] + 1,
        anterior + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      anterior = atual;
    }
  }
  return linha[b.length];
}

function palavrasParecidas(a: string, b: string) {
  if (a === b && a.length >= 4) return true;
  if (Math.min(a.length, b.length) < 4) return false;
  if (a.includes(b) || b.includes(a)) return true;
  const limite = Math.max(a.length, b.length) >= 7 ? 2 : 1;
  return distanciaEdicao(a, b) <= limite;
}

export function FornecedoresPage({
  fornecedores,
  produtos,
  historicoListas,
  currentDateTime,
  onOpenMenu,
  onAddProduct,
  onRenameProduct,
  onUpdatePrice,
  onDeleteProduct,
}: FornecedoresPageProps) {
  const [formularios, setFormularios] = useState<Record<string, NovoProduto>>({});
  const [aberto, setAberto] = useState<string | null>(null);
  const [duplicadoPendente, setDuplicadoPendente] = useState<ProdutoEstoque | null>(null);
  const [categoriaPendente, setCategoriaPendente] = useState<CategoriaPendente | null>(null);
  const [fornecedoresRetraidos, setFornecedoresRetraidos] = useState<Set<string>>(
    () => new Set(fornecedores.map((fornecedor) => fornecedor.name)),
  );
  const mesAtual = new Date().toISOString().slice(0, 7);
  const formatarValor = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function totalDoFornecedor(nomeFornecedor: string, somenteMesAtual: boolean) {
    return historicoListas
      .filter((registro) => !somenteMesAtual || registro.createdAt.slice(0, 7) === mesAtual)
      .reduce((total, registro) => {
        const grupo = registro.fornecedores.find((fornecedor) => fornecedor.name === nomeFornecedor);
        return total + (grupo?.itens.reduce(
          (subtotal, item) => subtotal + item.quantity * item.unitPrice, 0,
        ) ?? 0);
      }, 0);
  }

  function formulario(fornecedor: Fornecedor) {
    return formularios[fornecedor.name] ?? produtoVazio;
  }

  function atualizar(fornecedor: Fornecedor, campo: keyof NovoProduto, valor: string) {
    setFormularios((atuais) => ({
      ...atuais,
      [fornecedor.name]: { ...formulario(fornecedor), [campo]: valor },
    }));
  }

  function reconhecerCategoria(nome: string, fornecedor: Fornecedor) {
    const nomeNormalizado = normalizarTexto(nome);
    if (!nomeNormalizado) return "";
    const palavrasNome = nomeNormalizado.split(" ").filter(Boolean);

    const produtoParecido = produtos.find((produto) => {
      if (produto.supplier !== fornecedor.name) return false;
      const palavrasProduto = normalizarTexto(produto.name).split(" ");
      return palavrasProduto.some((palavraProduto) =>
        palavrasNome.some((palavraNome) => palavrasParecidas(palavraNome, palavraProduto)),
      );
    });
    if (produtoParecido) return produtoParecido.category;

    const regras: Array<[string[], string]> = [
      [["whisky", "label", "daniel", "old parr"], "Whisky"],
      [["vodka", "smirnoff", "absolut"], "Vodka"],
      [["gin", "tanqueray", "seagers"], "Gin"],
      [["rum", "bacardi"], "Rum"],
      [["conhaque", "brandy"], "Conhaques / Brandy"],
      [["licor", "campari", "cynar", "amarula"], "Licores e Aperitivos"],
      [["cachaca", "boazinha", "seleta", "salinas"], "Cachaças"],
      [["tequila"], "Tequila"],
      [["vinho", "lambrusco", "periquita", "miolo"], "Vinhos"],
      [["garrafao"], "Garrafões"],
      [["energetico", "red bull"], "Energéticos"],
      [["agua"], "Água"],
      [["copo", "bandeja", "canudo", "talher", "embalagem"], "Embalagens e descartáveis"],
      [["alcool", "limpador", "desinfetante", "vassoura", "rodo"], "Limpeza e higiene"],
    ];
    return regras.find(([palavras]) => palavras.some((regra) =>
      nomeNormalizado.includes(regra) ||
      palavrasNome.some((palavraNome) => palavrasParecidas(palavraNome, regra)),
    ))?.[1] ?? "";
  }

  function confirmarCategoria(fornecedor: Fornecedor) {
    const form = formulario(fornecedor);
    if (!form.name.trim() || form.category.trim()) return;
    const categoria = reconhecerCategoria(form.name, fornecedor);
    if (!categoria) return;
    setCategoriaPendente({ fornecedor, categoria });
  }

  function aceitarCategoria() {
    if (!categoriaPendente) return;
    atualizar(categoriaPendente.fornecedor, "category", categoriaPendente.categoria);
    setCategoriaPendente(null);
  }

  function alternarFormulario(fornecedor: Fornecedor, formularioAberto: boolean) {
    if (formularioAberto) {
      setFormularios((atuais) => ({ ...atuais, [fornecedor.name]: produtoVazio }));
      setAberto(null);
      return;
    }
    setAberto(fornecedor.name);
  }

  function adicionar(event: FormEvent, fornecedor: Fornecedor) {
    event.preventDefault();
    const novo = formulario(fornecedor);
    const estoqueAtual = Number(novo.currentStock);
    const estoqueMinimo = Number(novo.minimumStock);
    const valorUnitario = Number(novo.unitPrice.replace(",", "."));

    if (!novo.name.trim() || !novo.category.trim() || !novo.unit.trim()) return;
    if (!Number.isFinite(estoqueAtual) || !Number.isFinite(estoqueMinimo) || !Number.isFinite(valorUnitario)) return;
    if (estoqueAtual < 0 || estoqueMinimo < 0 || valorUnitario < 0) return;

    const novoProduto: ProdutoEstoque = {
      id: `${novo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${crypto.randomUUID()}`,
      name: novo.name.trim(),
      category: novo.category.trim(),
      supplier: fornecedor.name,
      unit: novo.unit.trim(),
      currentStock: estoqueAtual,
      minimumStock: estoqueMinimo,
      unitPrice: valorUnitario,
    };
    const itemIgual = produtos.find((produto) =>
      produto.supplier === fornecedor.name &&
      normalizarTexto(produto.name) === normalizarTexto(novo.name),
    );
    if (itemIgual) {
      setDuplicadoPendente(novoProduto);
      return;
    }

    onAddProduct(novoProduto);
    setFormularios((atuais) => ({ ...atuais, [fornecedor.name]: produtoVazio }));
    setAberto(null);
  }

  function confirmarDuplicacao() {
    if (!duplicadoPendente) return;
    onAddProduct(duplicadoPendente);
    setFormularios((atuais) => ({ ...atuais, [duplicadoPendente.supplier]: produtoVazio }));
    setAberto(null);
    setDuplicadoPendente(null);
  }

  function renomear(produto: ProdutoEstoque) {
    const novoNome = window.prompt("Novo nome do item", produto.name)?.trim();
    if (!novoNome || novoNome === produto.name) return;
    onRenameProduct(produto, novoNome);
  }

  function editarValor(produto: ProdutoEstoque) {
    const resposta = window.prompt("Valor unitário do item (R$)", (produto.unitPrice ?? 0).toFixed(2).replace(".", ","));
    if (resposta === null) return;
    const valor = Number(resposta.replace(",", "."));
    if (!Number.isFinite(valor) || valor < 0) return;
    onUpdatePrice(produto, valor);
  }

  function alternarFornecedor(nome: string) {
    setFornecedoresRetraidos((atuais) => {
      const proximos = new Set(atuais);
      if (proximos.has(nome)) proximos.delete(nome);
      else proximos.add(nome);
      return proximos;
    });
  }

  return (
    <>
      <DashboardHeader
        currentDateTime={currentDateTime}
        eyebrow="Cadastros"
        title="Fornecedores"
        subtitle="Gerencie os itens fornecidos por cada parceiro"
        onOpenMenu={onOpenMenu}
      />

      <section className="fornecedores-lista" aria-label="Lista de fornecedores">
        {fornecedores.map((fornecedor) => {
          const itens = produtos.filter((produto) => produto.supplier === fornecedor.name);
          const form = formulario(fornecedor);
          const formularioAberto = aberto === fornecedor.name;
          const totalMes = totalDoFornecedor(fornecedor.name, true);
          const totalGeral = totalDoFornecedor(fornecedor.name, false);
          const retraido = fornecedoresRetraidos.has(fornecedor.name);

          return (
            <article className="teste-panel fornecedor-card" key={fornecedor.name}>
              <div className="fornecedor-card-header">
                <div className="fornecedor-identidade">
                  <Truck size={24} />
                  <div>
                    <span className="teste-eyebrow">{fornecedor.purchaseFrequency}</span>
                    <h2>{fornecedor.name}</h2>
                    <p>{fornecedor.category}</p>
                  </div>
                </div>
                <div className="fornecedor-card-actions">
                  <span>{itens.length} {itens.length === 1 ? "item" : "itens"}</span>
                  <button className="fornecedor-toggle" type="button" onClick={() => alternarFornecedor(fornecedor.name)} aria-expanded={!retraido}>
                    {retraido ? <ChevronDown size={21} /> : <ChevronUp size={21} />}
                    {retraido ? "Expandir" : "Retrair"}
                  </button>
                </div>
              </div>

              <div className="fornecedor-totais" aria-label={`Totais de ${fornecedor.name}`}>
                <div><span>Total gasto no mês</span><strong>{formatarValor(totalMes)}</strong></div>
                <div><span>Gasto até o momento</span><strong>{formatarValor(totalGeral)}</strong></div>
              </div>

              {!retraido && (
              <div className="fornecedor-card-body">

              <button className="fornecedor-add-trigger" type="button" onClick={() => alternarFormulario(fornecedor, formularioAberto)}>
                <PackagePlus size={18} />
                {formularioAberto ? "Cancelar" : "Adicionar item"}
              </button>

              {formularioAberto && (
                <form className="fornecedor-add-form" onSubmit={(event) => adicionar(event, fornecedor)}>
                  <label>Produto<input required value={form.name} onBlur={() => confirmarCategoria(fornecedor)} onChange={(event) => atualizar(fornecedor, "name", event.target.value)} /></label>
                  <label>Categoria<input required value={form.category} onChange={(event) => atualizar(fornecedor, "category", event.target.value)} /></label>
                  <label>Unidade<input required value={form.unit} onChange={(event) => atualizar(fornecedor, "unit", event.target.value)} /></label>
                  <label>Estoque atual<input min="0" required type="number" value={form.currentStock} onChange={(event) => atualizar(fornecedor, "currentStock", event.target.value)} /></label>
                  <label>Estoque mínimo<input min="0" required type="number" value={form.minimumStock} onChange={(event) => atualizar(fornecedor, "minimumStock", event.target.value)} /></label>
                  <label>Valor unitário (R$)<input min="0" step="0.01" required type="number" value={form.unitPrice} onChange={(event) => atualizar(fornecedor, "unitPrice", event.target.value)} /></label>
                  <button type="submit">Salvar item</button>
                </form>
              )}

              <div className="fornecedor-itens">
                {itens.length === 0 ? (
                  <p className="fornecedor-vazio">Nenhum item cadastrado para este fornecedor.</p>
                ) : itens.map((produto) => (
                  <div className="fornecedor-item" key={produto.id}>
                    <div>
                      <strong>{produto.name}</strong>
                      <span>{produto.category} · {produto.unit} · atual {produto.currentStock} · mínimo {produto.minimumStock} · R$ {(produto.unitPrice ?? 0).toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="fornecedor-item-actions">
                      <button type="button" className="fornecedor-rename" onClick={() => renomear(produto)} aria-label={`Renomear ${produto.name}`}>
                        <Pencil size={17} /> Renomear
                      </button>
                      <button type="button" className="fornecedor-rename" onClick={() => editarValor(produto)} aria-label={`Editar valor de ${produto.name}`}>
                        R$ Valor
                      </button>
                      <button type="button" className="fornecedor-delete" onClick={() => onDeleteProduct(produto)} aria-label={`Excluir ${produto.name}`}>
                        <Trash2 size={17} /> Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              </div>
              )}
            </article>
          );
        })}
      </section>

      {duplicadoPendente && (
        <div className="confirmacao-modal-backdrop" role="presentation">
          <section className="confirmacao-modal" role="dialog" aria-modal="true" aria-labelledby="confirmacao-duplicado-title">
            <span className="teste-eyebrow">Item duplicado</span>
            <h2 id="confirmacao-duplicado-title">Adicionar este item mesmo assim?</h2>
            <p>
              <strong>{duplicadoPendente.name}</strong> já existe na lista de {duplicadoPendente.supplier}.
            </p>
            <div className="confirmacao-modal-actions">
              <button className="confirmacao-nao" type="button" onClick={() => setDuplicadoPendente(null)}>Não</button>
              <button className="confirmacao-sim" type="button" onClick={confirmarDuplicacao}>Sim, duplicar</button>
            </div>
          </section>
        </div>
      )}
      {categoriaPendente && (
        <div className="confirmacao-modal-backdrop" role="presentation">
          <section className="confirmacao-modal" role="dialog" aria-modal="true" aria-labelledby="confirmacao-categoria-title">
            <span className="teste-eyebrow">Categoria reconhecida</span>
            <h2 id="confirmacao-categoria-title">Usar esta categoria?</h2>
            <p>Categoria sugerida: <strong>{categoriaPendente.categoria}</strong></p>
            <div className="confirmacao-modal-actions">
              <button className="confirmacao-nao" type="button" onClick={() => setCategoriaPendente(null)}>Não</button>
              <button className="confirmacao-sim" type="button" onClick={aceitarCategoria}>Sim, selecionar</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
