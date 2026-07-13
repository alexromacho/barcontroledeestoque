import { formatarQuantidadeMovimentacao, obterRotuloMovimentacao } from "../domain/rules/formatarMovimentacao";
import type { MovimentacaoEstoque } from "../types/estoque";

type HistoricoSaidasProps = {
  movimentacoes: MovimentacaoEstoque[];
};

export function HistoricoSaidas({ movimentacoes }: HistoricoSaidasProps) {
  return (
    <section className="teste-panel">
      <div className="teste-panel-heading">
        <div>
          <span className="teste-eyebrow">Seção 4</span>
          <h2>Histórico de Movimentações do Dia</h2>
        </div>
      </div>

      <div className="teste-table-wrap">
        <table className="teste-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Tipo</th>
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
            {movimentacoes.length === 0 ? (
              <tr>
                <td colSpan={10}>Nenhuma movimentação registrada hoje.</td>
              </tr>
            ) : (
              movimentacoes.map((record) => (
                <tr className={`movimentacao--${record.tipo}`} key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.time}</td>
                  <td><span className="movimentacao-tipo">{obterRotuloMovimentacao(record.tipo)}</span></td>
                  <td>{record.productName}</td>
                  <td>{record.category}</td>
                  <td>{formatarQuantidadeMovimentacao(record.tipo, record.quantity, record.unit)}</td>
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
  );
}
