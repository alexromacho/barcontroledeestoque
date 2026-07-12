import { SaidaEstoque } from "../types/estoque";

type HistoricoSaidasProps = {
  historicoSaidas: SaidaEstoque[];
};

export function HistoricoSaidas({ historicoSaidas }: HistoricoSaidasProps) {
  return (
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
              <th>Data</th>
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
                <td colSpan={9}>Nenhuma saída registrada hoje.</td>
              </tr>
            ) : (
              historicoSaidas.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
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
  );
}
