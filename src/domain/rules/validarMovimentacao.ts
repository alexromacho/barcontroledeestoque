export function validarQuantidadePositiva(quantidade: number) {
  if (!Number.isFinite(quantidade) || quantidade <= 0) {
    throw new Error("Informe uma quantidade maior que zero.");
  }
}

export function validarSaidaEstoque(estoqueDisponivel: number, quantidade: number) {
  validarQuantidadePositiva(quantidade);

  if (quantidade > estoqueDisponivel) {
    throw new Error("A quantidade informada é maior que o estoque atual.");
  }
}
