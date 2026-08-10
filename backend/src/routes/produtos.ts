import { Router } from "express";
import { db } from "../db.js";

export const produtosRouter = Router();

type ProductRow = {
  id: number;
  supplier_id: number;
  stock_item_id: number | null;
  name: string;
  unit: string;
  price_cents: number;
  supplier_name: string;
};

produtosRouter.get("/", (_req, res) => {
  const products = db
    .prepare(
      `SELECT p.id, p.supplier_id, p.stock_item_id, p.name, p.unit, p.price_cents, s.name as supplier_name
       FROM products p
       JOIN suppliers s ON s.id = p.supplier_id
       ORDER BY s.name, p.name`,
    )
    .all() as ProductRow[];

  res.json({
    products: products.map((product) => ({
      ...product,
      price: product.price_cents / 100,
    })),
  });
});

produtosRouter.post("/", (req, res) => {
  const { supplier_id, name, unit, price } = req.body ?? {};

  const supplierId = Number(supplier_id);
  if (!Number.isInteger(supplierId)) {
    return res.status(400).json({ error: "Selecione um fornecedor." });
  }
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Informe o nome do produto." });
  }
  if (typeof unit !== "string" || !unit.trim()) {
    return res.status(400).json({ error: "Informe a unidade do produto." });
  }
  const priceNumber = Number(price);
  if (!Number.isFinite(priceNumber) || priceNumber < 0) {
    return res.status(400).json({ error: "Informe um preço válido." });
  }

  const supplier = db.prepare("SELECT id FROM suppliers WHERE id = ?").get(supplierId);
  if (!supplier) {
    return res.status(404).json({ error: "Fornecedor não encontrado." });
  }

  const result = db
    .prepare("INSERT INTO products (supplier_id, name, unit, price_cents) VALUES (?, ?, ?, ?)")
    .run(supplierId, name.trim(), unit.trim(), Math.round(priceNumber * 100));

  res.status(201).json({ id: Number(result.lastInsertRowid), created: true });
});
