import { FormEvent } from "react";
import { Boxes } from "lucide-react";
import { ProdutoEstoque } from "../types/estoque";

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
  onSubmit,
}: SaidaDoDiaProps) {
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
  );
}
