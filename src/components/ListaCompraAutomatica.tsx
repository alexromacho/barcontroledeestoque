import { Send, ShoppingBasket } from "lucide-react";
import { Fornecedor, ItemCompra } from "../types/estoque";

type ListaCompraAutomaticaProps = {
  fornecedores: Fornecedor[];
  itensCompraPorFornecedor: Record<string, ItemCompra[]>;
  onEnviarPedido: (fornecedor: Fornecedor) => void;
};

export function ListaCompraAutomatica({
  fornecedores,
  itensCompraPorFornecedor,
  onEnviarPedido,
}: ListaCompraAutomaticaProps) {
  return (
    <article className="teste-panel">
      <div className="teste-panel-heading">
        <div>
          <span className="teste-eyebrow">Seção 3</span>
          <h2>Lista de Compra Automática</h2>
        </div>
        <ShoppingBasket size={24} />
      </div>

      <div className="teste-purchase-groups">
        {fornecedores.map((fornecedor) => {
          const itensCompra = itensCompraPorFornecedor[fornecedor.name] ?? [];

          return (
            <section className="teste-purchase-group" key={fornecedor.name}>
              <div className="teste-supplier-summary">
                <strong>Pedido sugerido - {fornecedor.name}</strong>
                <span>{fornecedor.category}</span>
                {fornecedor.phone && <span>Telefone: {fornecedor.phone}</span>}
                <span>Frequência de compra: {fornecedor.purchaseFrequency}</span>
              </div>

              <div className="teste-purchase-list">
                {itensCompra.length === 0 ? (
                  <p className="teste-empty">Nenhum item abaixo do mínimo.</p>
                ) : (
                  itensCompra.map((item) => (
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

              <button type="button" onClick={() => onEnviarPedido(fornecedor)}>
                <Send size={18} />
                Enviar pedido
              </button>
            </section>
          );
        })}
      </div>
    </article>
  );
}
