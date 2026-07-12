import { Truck } from "lucide-react";
import { ProdutoEstoque } from "../types/estoque";

type EstoqueProdutosProps = {
  produtos: ProdutoEstoque[];
};

export function EstoqueProdutos({ produtos }: EstoqueProdutosProps) {
  return (
    <section className="teste-panel">
      <div className="teste-panel-heading">
        <div>
          <span className="teste-eyebrow">Seção 2</span>
          <h2>Estoque de Produtos</h2>
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
  );
}
