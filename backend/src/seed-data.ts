// Dados iniciais para popular o banco na primeira execução.
// Espelha os fornecedores/produtos que já existiam como mock em
// src/data/produtosJoaoVero.ts no front-end, para que o backend suba
// com o estoque real do bar em vez de vazio.

type SeedProduct = {
  name: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
};

type SeedSupplier = {
  name: string;
  category: string;
  whatsappPhone: string;
  contactName?: string;
  products: SeedProduct[];
};

export const seedSuppliers: SeedSupplier[] = [
  {
    name: "João Vero Imports",
    category: "Bebidas / Destilados / Vinhos",
    whatsappPhone: "5514996511343",
    products: [
      { name: "Red Label", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Black Label", unit: "garrafas", currentStock: 5, minimumStock: 4 },
      { name: "Jack Daniel's", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Old Parr", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Vodka Smirnoff", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Vodka Absolut", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Gin Tanqueray", unit: "garrafas", currentStock: 6, minimumStock: 6 },
      { name: "Gin Seagers", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Bacardi Ouro", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Bacardi Prata", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Domecq", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "São João da Barra", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Macieira Portuguesa", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Fundador", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Presidente", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Licor 43", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Cointreau", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Amarula", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Malibu", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Cynar", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Cinzano", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Martini Bianco", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Absinto", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Jurubeba", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Underberg", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Campari", unit: "garrafas", currentStock: 6, minimumStock: 6 },
      { name: "Jägermeister", unit: "garrafas", currentStock: 6, minimumStock: 6 },
      { name: "Licor de Menta Stock", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Cachaça Boazinha", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Seleta", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Claudionor", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Salinas", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Sagatiba", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Velho Barreiro", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Ypióca Ouro", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Ypióca Prata", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Tequila Prata", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Tequila Ouro", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Sakê", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Steinhaeger Becosa", unit: "garrafas", currentStock: 2, minimumStock: 2 },
      { name: "Vale Veneto Tinto Seco", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Vale Veneto Tinto Suave", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Vinho do Porto", unit: "garrafas", currentStock: 1, minimumStock: 1 },
      { name: "Vale Veneto Branco Seco", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Periquita", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Miolo", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Concha y Toro", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Lambrusco Rosso", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Lambrusco Bianco", unit: "garrafas", currentStock: 4, minimumStock: 4 },
      { name: "Garrafão Vale Veneto Tinto Seco", unit: "garrafões", currentStock: 1, minimumStock: 1 },
      { name: "Garrafão Vale Veneto Tinto Suave", unit: "garrafões", currentStock: 1, minimumStock: 1 },
      { name: "Garrafão Vale Veneto Branco Seco", unit: "garrafões", currentStock: 1, minimumStock: 1 },
      { name: "Fardo Red Bull Tradicional", unit: "fardos", currentStock: 2, minimumStock: 2 },
      { name: "Fardo Red Bull Tropical", unit: "fardos", currentStock: 2, minimumStock: 2 },
      { name: "Ice Smirnoff", unit: "fardos", currentStock: 1, minimumStock: 1 },
    ],
  },
  {
    name: "Caio Aragua",
    category: "Água",
    whatsappPhone: "5514981012021",
    products: [
      { name: "Água sem gás", unit: "fardo", currentStock: 15, minimumStock: 15 },
      { name: "Água com gás", unit: "fardo", currentStock: 6, minimumStock: 6 },
    ],
  },
  {
    name: "WR Embalagens",
    category: "Embalagens / Limpeza / Descartáveis",
    whatsappPhone: "5514981330675",
    products: [
      { name: "Copo 50 ml", unit: "pacote", currentStock: 2, minimumStock: 2 },
      { name: "Copo 500 ml", unit: "pacote", currentStock: 4, minimumStock: 4 },
      { name: "Copo 700 ml", unit: "pacote", currentStock: 4, minimumStock: 4 },
      { name: "Papel interfolha", unit: "pacote", currentStock: 3, minimumStock: 3 },
      { name: "Papel toalha cozinha", unit: "rolo", currentStock: 15, minimumStock: 15 },
      { name: "Papel TV", unit: "unidade", currentStock: 10, minimumStock: 10 },
      { name: "Caixa de bandeja 500 g de alumínio", unit: "caixa", currentStock: 1, minimumStock: 1 },
      { name: "Caixa de bandeja 1 kg de alumínio", unit: "caixa", currentStock: 1, minimumStock: 1 },
      { name: "Papel comanda sem pauta", unit: "rolo", currentStock: 3, minimumStock: 3 },
      { name: "Saco de talher 6x24", unit: "pacote", currentStock: 2, minimumStock: 2 },
      { name: "Caixa de palito solto", unit: "caixa", currentStock: 2, minimumStock: 2 },
      { name: "Caixa de maionese", unit: "caixa", currentStock: 4, minimumStock: 4 },
      { name: "Caixa de ketchup", unit: "caixa", currentStock: 4, minimumStock: 4 },
      { name: "Prato de bolo", unit: "pacote", currentStock: 10, minimumStock: 10 },
      { name: "Colher branca de chá", unit: "pacote", currentStock: 2, minimumStock: 2 },
      { name: "Garfo para bolo", unit: "pacote", currentStock: 3, minimumStock: 3 },
      { name: "Canudo dobrável preto flexível", unit: "pacote", currentStock: 3, minimumStock: 3 },
      { name: "Canudo para milkshake", unit: "pacote", currentStock: 2, minimumStock: 2 },
      { name: "Borrifador", unit: "unidade", currentStock: 2, minimumStock: 2 },
      { name: "Caixa de água sanitária", unit: "caixa", currentStock: 2, minimumStock: 2 },
      { name: "Desinfetante de algas", unit: "unidade", currentStock: 2, minimumStock: 2 },
      { name: "Luva látex M", unit: "pacote", currentStock: 2, minimumStock: 2 },
      { name: "Vassoura", unit: "unidade", currentStock: 2, minimumStock: 2 },
      { name: "Rodo para fibra com cabo", unit: "unidade", currentStock: 2, minimumStock: 2 },
    ],
  },
  {
    name: "Mari Blumax",
    category: "Limpeza / Higiene",
    whatsappPhone: "551433666410",
    products: [
      { name: "Álcool", unit: "unidade/galão", currentStock: 6, minimumStock: 6 },
      { name: "Limpador geral", unit: "unidade/galão", currentStock: 4, minimumStock: 4 },
      { name: "Limpa alumínio", unit: "unidade", currentStock: 2, minimumStock: 2 },
      { name: "Desengraxante", unit: "unidade/galão", currentStock: 2, minimumStock: 2 },
      { name: "Papel cai-cai", unit: "pacote/fardo", currentStock: 4, minimumStock: 4 },
      { name: "Rolo de papel para mãos", unit: "rolo/fardo", currentStock: 4, minimumStock: 4 },
    ],
  },
];
