import { Fornecedor, ProdutoEstoque } from "../types/estoque";

export const fornecedorJoaoVero: Fornecedor = {
  name: "João Vero Importa",
  phone: "5514996511343",
  category: "Bebidas / Destilados / Vinhos",
  purchaseFrequency: "semanal",
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
  category: "Embalagens / Limpeza / Descartáveis",
  purchaseFrequency: "Sob demanda",
};

export const fornecedorMariBlumax: Fornecedor = {
  name: "Mari Blumax",
  phone: "551433666410",
  category: "Limpeza / Higiene",
  purchaseFrequency: "Sob demanda",
};

export const produtosJoaoVero: ProdutoEstoque[] = [
  { id: "red-label", name: "Red Label", category: "Whisky", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "black-label", name: "Black Label", category: "Whisky", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 5, minimumStock: 4 },
  { id: "jack-daniels", name: "Jack Daniel's", category: "Whisky", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "old-parr", name: "Old Parr", category: "Whisky", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "vodka-smirnoff", name: "Vodka Smirnoff", category: "Vodka", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "vodka-absolut", name: "Vodka Absolut", category: "Vodka", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "gin-tanqueray", name: "Gin Tanqueray", category: "Gin", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 6, minimumStock: 6 },
  { id: "gin-seagers", name: "Gin Seagers", category: "Gin", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "bacardi-ouro", name: "Bacardi Ouro", category: "Rum", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "bacardi-prata", name: "Bacardi Prata", category: "Rum", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "domecq", name: "Domecq", category: "Conhaques / Brandy", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "sao-joao-barra", name: "São João da Barra", category: "Conhaques / Brandy", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "macieira-portuguesa", name: "Macieira Portuguesa", category: "Conhaques / Brandy", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "fundador", name: "Fundador", category: "Conhaques / Brandy", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "presidente", name: "Presidente", category: "Conhaques / Brandy", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "licor-43", name: "Licor 43", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "cointreau", name: "Cointreau", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "amarula", name: "Amarula", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "malibu", name: "Malibu", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "cynar", name: "Cynar", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "cinzano", name: "Cinzano", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "martini-bianco", name: "Martini Bianco", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "absinto", name: "Absinto", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "jurubeba", name: "Jurubeba", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "underberg", name: "Underberg", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "campari", name: "Campari", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 6, minimumStock: 6 },
  { id: "jagermeister", name: "Jägermeister", category: "Licores e Aperitivos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 6, minimumStock: 6 },
  { id: "boazinha", name: "Cachaça Boazinha", category: "Cachaças", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "seleta", name: "Seleta", category: "Cachaças", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "claudionor", name: "Claudionor", category: "Cachaças", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "salinas", name: "Salinas", category: "Cachaças", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "sagatiba", name: "Sagatiba", category: "Cachaças", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "velho-barreiro", name: "Velho Barreiro", category: "Cachaças", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "ypioca-ouro", name: "Ypióca Ouro", category: "Ypióca", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "ypioca-prata", name: "Ypióca Prata", category: "Ypióca", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "tequila-prata", name: "Tequila Prata", category: "Tequila", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "tequila-ouro", name: "Tequila Ouro", category: "Tequila", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "sake", name: "Sakê", category: "Saquê", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 1, minimumStock: 1 },
  { id: "steinhaeger-becosa", name: "Steinhaeger Becosa", category: "Steinhaeger", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 2, minimumStock: 2 },
  { id: "vale-veneto-tinto-seco", name: "Vale Veneto Tinto Seco", category: "Vinhos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "vale-veneto-tinto-suave", name: "Vale Veneto Tinto Suave", category: "Vinhos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "vale-veneto-branco-seco", name: "Vale Veneto Branco Seco", category: "Vinhos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "periquita", name: "Periquita", category: "Vinhos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "miolo", name: "Miolo", category: "Vinhos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "concha-y-toro", name: "Concha y Toro", category: "Vinhos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "lambrusco-rosso", name: "Lambrusco Rosso", category: "Vinhos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "lambrusco-bianco", name: "Lambrusco Bianco", category: "Vinhos", supplier: fornecedorJoaoVero.name, unit: "garrafas", currentStock: 4, minimumStock: 4 },
  { id: "garrafao-vale-veneto-tinto-seco", name: "Garrafão Vale Veneto Tinto Seco", category: "Garrafões", supplier: fornecedorJoaoVero.name, unit: "garrafões", currentStock: 1, minimumStock: 1 },
  { id: "garrafao-vale-veneto-tinto-suave", name: "Garrafão Vale Veneto Tinto Suave", category: "Garrafões", supplier: fornecedorJoaoVero.name, unit: "garrafões", currentStock: 1, minimumStock: 1 },
  { id: "garrafao-vale-veneto-branco-seco", name: "Garrafão Vale Veneto Branco Seco", category: "Garrafões", supplier: fornecedorJoaoVero.name, unit: "garrafões", currentStock: 1, minimumStock: 1 },
  { id: "red-bull-tradicional", name: "Fardo Red Bull Tradicional", category: "Energéticos", supplier: fornecedorJoaoVero.name, unit: "fardos", currentStock: 2, minimumStock: 2 },
  { id: "red-bull-tropical", name: "Fardo Red Bull Tropical", category: "Energéticos", supplier: fornecedorJoaoVero.name, unit: "fardos", currentStock: 2, minimumStock: 2 },
  { id: "ice-smirnoff", name: "Ice Smirnoff", category: "Ice", supplier: fornecedorJoaoVero.name, unit: "fardos", currentStock: 1, minimumStock: 1 },
];

export const produtosMariBlumax: ProdutoEstoque[] = [
  { id: "alcool", name: "Álcool", category: fornecedorMariBlumax.category, supplier: fornecedorMariBlumax.name, unit: "unidade/galão", currentStock: 6, minimumStock: 6 },
  { id: "limpador-geral", name: "Limpador geral", category: fornecedorMariBlumax.category, supplier: fornecedorMariBlumax.name, unit: "unidade/galão", currentStock: 4, minimumStock: 4 },
  { id: "limpa-aluminio", name: "Limpa alumínio", category: fornecedorMariBlumax.category, supplier: fornecedorMariBlumax.name, unit: "unidade", currentStock: 2, minimumStock: 2 },
  { id: "desengraxante", name: "Desengraxante", category: fornecedorMariBlumax.category, supplier: fornecedorMariBlumax.name, unit: "unidade/galão", currentStock: 2, minimumStock: 2 },
  { id: "papel-cai-cai", name: "Papel cai-cai", category: fornecedorMariBlumax.category, supplier: fornecedorMariBlumax.name, unit: "pacote/fardo", currentStock: 4, minimumStock: 4 },
  { id: "rolo-papel-maos", name: "Rolo de papel para mãos", category: fornecedorMariBlumax.category, supplier: fornecedorMariBlumax.name, unit: "rolo/fardo", currentStock: 4, minimumStock: 4 },
];

export const produtosCaioAragua: ProdutoEstoque[] = [
  { id: "agua-sem-gas", name: "Água sem gás", category: fornecedorCaioAragua.category, supplier: fornecedorCaioAragua.name, unit: "fardo", currentStock: 15, minimumStock: 15 },
  { id: "agua-com-gas", name: "Água com gás", category: fornecedorCaioAragua.category, supplier: fornecedorCaioAragua.name, unit: "fardo", currentStock: 6, minimumStock: 6 },
];

export const produtosWrEmbalagens: ProdutoEstoque[] = [
  { id: "copo-50-ml", name: "Copo 50 ml", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "pacote", currentStock: 2, minimumStock: 2 },
  { id: "copo-500-ml", name: "Copo 500 ml", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "pacote", currentStock: 4, minimumStock: 4 },
  { id: "copo-700-ml", name: "Copo 700 ml", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "pacote", currentStock: 4, minimumStock: 4 },
  { id: "papel-interfolha", name: "Papel interfolha", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "pacote", currentStock: 3, minimumStock: 3 },
  { id: "papel-toalha-cozinha", name: "Papel toalha cozinha", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "rolo", currentStock: 15, minimumStock: 15 },
  { id: "papel-tv", name: "Papel TV", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "unidade", currentStock: 10, minimumStock: 10 },
  { id: "caixa-bandeja-500g-aluminio", name: "Caixa de bandeja 500 g de alumínio", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "caixa", currentStock: 1, minimumStock: 1 },
  { id: "caixa-bandeja-1kg-aluminio", name: "Caixa de bandeja 1 kg de alumínio", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "caixa", currentStock: 1, minimumStock: 1 },
  { id: "papel-comanda-sem-pauta", name: "Papel comanda sem pauta", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "rolo", currentStock: 3, minimumStock: 3 },
  { id: "saco-talher-6x24", name: "Saco de talher 6x24", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "pacote", currentStock: 2, minimumStock: 2 },
  { id: "caixa-palito-solto", name: "Caixa de palito solto", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "caixa", currentStock: 2, minimumStock: 2 },
  { id: "caixa-maionese", name: "Caixa de maionese", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "caixa", currentStock: 4, minimumStock: 4 },
  { id: "caixa-ketchup", name: "Caixa de ketchup", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "caixa", currentStock: 4, minimumStock: 4 },
  { id: "prato-bolo", name: "Prato de bolo", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "pacote", currentStock: 10, minimumStock: 10 },
  { id: "colher-branca-cha", name: "Colher branca de chá", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "pacote", currentStock: 2, minimumStock: 2 },
  { id: "garfo-para-bolo", name: "Garfo para bolo", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "pacote", currentStock: 3, minimumStock: 3 },
  { id: "canudo-dobravel-preto-flexivel", name: "Canudo dobrável preto flexível", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "pacote", currentStock: 3, minimumStock: 3 },
  { id: "canudo-milkshake", name: "Canudo para milkshake", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "pacote", currentStock: 2, minimumStock: 2 },
  { id: "borrifador", name: "Borrifador", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "unidade", currentStock: 2, minimumStock: 2 },
  { id: "caixa-agua-sanitaria", name: "Caixa de água sanitária", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "caixa", currentStock: 2, minimumStock: 2 },
  { id: "desinfetante-algas", name: "Desinfetante de algas", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "unidade", currentStock: 2, minimumStock: 2 },
  { id: "luva-latex-m", name: "Luva látex M", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "pacote", currentStock: 2, minimumStock: 2 },
  { id: "vassoura", name: "Vassoura", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "unidade", currentStock: 2, minimumStock: 2 },
  { id: "rodo-fibra-com-cabo", name: "Rodo para fibra com cabo", category: fornecedorWrEmbalagens.category, supplier: fornecedorWrEmbalagens.name, unit: "unidade", currentStock: 2, minimumStock: 2 },
];

export const fornecedores = [
  fornecedorJoaoVero,
  fornecedorCaioAragua,
  fornecedorWrEmbalagens,
  fornecedorMariBlumax,
];

export const produtosEstoque = [
  ...produtosJoaoVero,
  ...produtosCaioAragua,
  ...produtosWrEmbalagens,
  ...produtosMariBlumax,
];
