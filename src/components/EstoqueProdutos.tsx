import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Camera, PackagePlus, Truck } from "lucide-react";
import { ProdutoEstoque } from "../types/estoque";

type EstoqueProdutosProps = {
  produtos: ProdutoEstoque[];
  onRegistrarEntrada: (produtoId: string, quantidade: number) => void;
};

export function EstoqueProdutos({ produtos, onRegistrarEntrada }: EstoqueProdutosProps) {
  const [fotoNota, setFotoNota] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("1");

  useEffect(() => () => {
    if (fotoUrl) URL.revokeObjectURL(fotoUrl);
  }, [fotoUrl]);

  function selecionarFoto(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    setFotoNota(arquivo);
    setFotoUrl(URL.createObjectURL(arquivo));
  }

  function registrarEntrada(event: FormEvent) {
    event.preventDefault();
    const valor = Number(quantidade);
    if (!fotoNota || !produtoId || !Number.isFinite(valor) || valor <= 0) return;
    onRegistrarEntrada(produtoId, valor);
    setProdutoId("");
    setQuantidade("1");
    setFotoNota(null);
    if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    setFotoUrl("");
  }

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
              <th>Valor unitário</th>
              <th>Valor em estoque</th>
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
                  <td>{(product.unitPrice ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td>{((product.unitPrice ?? 0) * product.currentStock).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
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

      <section className="nota-fiscal-entrada" aria-labelledby="nota-fiscal-title">
        <div className="teste-panel-heading">
          <div><span className="teste-eyebrow">Entrada por imagem</span><h2 id="nota-fiscal-title">Nota fiscal de compra</h2></div>
          <Camera size={24} />
        </div>
        <div className="nota-fiscal-grid">
          <label className="nota-fiscal-captura">
            <Camera size={28} />
            <strong>{fotoNota ? "Trocar foto da nota" : "Tirar foto da nota fiscal"}</strong>
            <span>Use a câmera ou escolha uma imagem</span>
            <input accept="image/*" capture="environment" type="file" onChange={selecionarFoto} />
          </label>
          {fotoUrl && <img className="nota-fiscal-preview" src={fotoUrl} alt="Prévia da nota fiscal" />}
          <form className="nota-fiscal-form" onSubmit={registrarEntrada}>
            <p>Confira a foto e informe cada item recebido antes de atualizar o estoque.</p>
            <label>Produto<select required value={produtoId} onChange={(event) => setProdutoId(event.target.value)}><option value="">Selecione o item da nota</option>{produtos.map((produto) => <option key={produto.id} value={produto.id}>{produto.name} · {produto.supplier}</option>)}</select></label>
            <label>Quantidade recebida<input min="1" required type="number" value={quantidade} onChange={(event) => setQuantidade(event.target.value)} /></label>
            <button disabled={!fotoNota} type="submit"><PackagePlus size={18} /> Atualizar estoque</button>
          </form>
        </div>
      </section>
    </section>
  );
}
