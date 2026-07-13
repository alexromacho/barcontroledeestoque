import type { Fornecedor } from "../domain/entities/Fornecedor";

export const fornecedorJoaoVero: Fornecedor = {
  name: "João Vero Imports",
  phone: "5514996511343",
  category: "Bebidas alcoólicas, vinhos, energéticos e licores",
  purchaseFrequency: "Semanal",
};

export const fornecedorCaioAragua: Fornecedor = {
  name: "Caio Aragua",
  phone: "5514981012021",
  category: "Água",
  purchaseFrequency: "Sob demanda",
};

export const fornecedorWrEmbalagens: Fornecedor = {
  name: "WR Embalagens",
  phone: "5514981330675",
  category: "Embalagens, descartáveis e limpeza",
  purchaseFrequency: "Sob demanda",
};

export const fornecedorMariBlumax: Fornecedor = {
  name: "Mari Blumax",
  phone: "551433666410",
  category: "Limpeza e higiene",
  purchaseFrequency: "Sob demanda",
};

export const fornecedorMercado: Fornecedor = {
  name: "Mercado",
  phone: "",
  category: "Alimentos, bebidas, limpeza e higiene",
  purchaseFrequency: "Semanal",
};

export const fornecedores: Fornecedor[] = [
  fornecedorJoaoVero,
  fornecedorCaioAragua,
  fornecedorWrEmbalagens,
  fornecedorMariBlumax,
  fornecedorMercado,
];
