import { FormEvent, useState } from "react";
import { Boxes, CheckCircle2, Mic, MicOff, Trash2 } from "lucide-react";
import { ProdutoEstoque } from "../types/estoque";
import { normalizarTexto } from "../utils/normalizarTexto";

export type SaidaPendente = {
  id: string;
  product: ProdutoEstoque;
  quantity: number;
};

type SpeechRecognitionResultEvent = Event & {
  results: { 0: { 0: { transcript: string } } };
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const numerosFalados: Record<string, number> = {
  um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5,
  seis: 6, sete: 7, oito: 8, nove: 9, dez: 10, onze: 11, doze: 12,
  treze: 13, quatorze: 14, catorze: 14, quinze: 15, dezesseis: 16,
  dezessete: 17, dezoito: 18, dezenove: 19, vinte: 20,
};

function extrairQuantidade(texto: string) {
  const textoNormalizado = normalizarTexto(texto);
  const numeroEmAlgarismo = textoNormalizado.match(/\b\d+(?:[.,]\d+)?\b/);
  if (numeroEmAlgarismo) return Number(numeroEmAlgarismo[0].replace(",", "."));

  for (const palavra of textoNormalizado.split(" ")) {
    if (numerosFalados[palavra]) return numerosFalados[palavra];
  }
  return null;
}

function normalizarParaVoz(texto: string) {
  return normalizarTexto(texto)
    .replace(/\b\d+(?:[.,]\d+)?\b/g, " ")
    .split(" ")
    .filter((palavra) => palavra && !numerosFalados[palavra])
    .map((palavra) => palavra.length > 3 && palavra.endsWith("s") ? palavra.slice(0, -1) : palavra)
    .join(" ");
}

function encontrarProdutoFalado(produtos: ProdutoEstoque[], textoFalado: string) {
  const busca = normalizarParaVoz(textoFalado);
  const tokensBusca = new Set(busca.split(" ").filter(Boolean));

  return produtos
    .map((produto) => {
      const nome = normalizarParaVoz(produto.name);
      const tokensNome = nome.split(" ").filter(Boolean);
      const corresponde = busca.includes(nome) || nome.includes(busca) || tokensNome.every((token) => tokensBusca.has(token));
      return { produto, corresponde, pontuacao: tokensNome.length * 100 + nome.length };
    })
    .filter((resultado) => resultado.corresponde)
    .sort((a, b) => b.pontuacao - a.pontuacao)[0]?.produto;
}

type SaidaDoDiaProps = {
  termoBusca: string;
  setTermoBusca: (value: string) => void;
  produtosFiltrados: ProdutoEstoque[];
  selectedProductId: string;
  setSelectedProductId: (value: string) => void;
  selectedProduct?: ProdutoEstoque;
  quantity: string;
  setQuantity: (value: string) => void;
  selectedUnit: string;
  produtos: ProdutoEstoque[];
  saidasPendentes: SaidaPendente[];
  onRemoverPendente: (id: string) => void;
  onConfirmarPendentes: () => void;
  onSubmit: (event: FormEvent) => void;
};

export function SaidaDoDia({
  termoBusca,
  setTermoBusca,
  produtosFiltrados,
  selectedProductId,
  setSelectedProductId,
  selectedProduct,
  quantity,
  setQuantity,
  selectedUnit,
  produtos,
  saidasPendentes,
  onRemoverPendente,
  onConfirmarPendentes,
  onSubmit,
}: SaidaDoDiaProps) {
  const [ouvindo, setOuvindo] = useState(false);
  const [erroVoz, setErroVoz] = useState("");

  function ouvirProduto() {
    const browserWindow = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setErroVoz("Reconhecimento de voz não disponível neste navegador.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const textoFalado = event.results[0][0].transcript.trim();
      const quantidadeFalada = extrairQuantidade(textoFalado);
      const produto = encontrarProdutoFalado(produtos, textoFalado);
      setTermoBusca(produto?.name ?? textoFalado);
      if (produto) {
        setSelectedProductId(produto.id);
        if (quantidadeFalada && quantidadeFalada > 0) setQuantity(String(quantidadeFalada));
      }
      else setErroVoz(`Não encontrei um produto para “${textoFalado}”.`);
    };
    recognition.onerror = () => setErroVoz("Não foi possível entender. Tente novamente.");
    recognition.onend = () => setOuvindo(false);
    setErroVoz("");
    setOuvindo(true);
    recognition.start();
  }

  return (
    <article className="teste-panel">
      <div className="teste-panel-heading">
        <div>
          <span className="teste-eyebrow">Seção 1</span>
          <h2>Saída do Dia</h2>
        </div>
        <Boxes size={24} />
      </div>

      <form className="teste-form" onSubmit={onSubmit}>
        <div className="saida-busca-voz">
          <label>
            Buscar produto
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Buscar produto..."
            />
          </label>
          <button className={ouvindo ? "voz-button is-listening" : "voz-button"} type="button" onClick={ouvirProduto}>
            {ouvindo ? <MicOff size={19} /> : <Mic size={19} />}
            {ouvindo ? "Ouvindo..." : "Falar item"}
          </button>
        </div>
        {erroVoz && <p className="voz-feedback">{erroVoz}</p>}

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
            <option value="">Selecione um produto</option>
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

        <button type="submit">Adicionar à confirmação</button>
      </form>

      <section className="saidas-confirmacao" aria-labelledby="saidas-confirmacao-title">
        <div>
          <h3 id="saidas-confirmacao-title">Lista de confirmação</h3>
          <span>{saidasPendentes.length} {saidasPendentes.length === 1 ? "item pendente" : "itens pendentes"}</span>
        </div>
        {saidasPendentes.length === 0 ? (
          <p className="teste-empty">Adicione os itens antes de confirmar a saída.</p>
        ) : (
          <>
            <div className="saidas-pendentes-lista">
              {saidasPendentes.map((saida) => (
                <div className="saida-pendente" key={saida.id}>
                  <div><strong>{saida.product.name}</strong><span>{saida.quantity} {saida.product.unit}</span></div>
                  <button type="button" onClick={() => onRemoverPendente(saida.id)} aria-label={`Remover ${saida.product.name}`}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <button className="confirmar-saidas-button" type="button" onClick={onConfirmarPendentes}>
              <CheckCircle2 size={19} /> Confirmar todas as saídas
            </button>
          </>
        )}
      </section>
    </article>
  );
}
