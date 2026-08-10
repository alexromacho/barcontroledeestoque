import { Router } from "express";
import { db } from "../db.js";

export const fornecedoresRouter = Router();

type SupplierRow = {
  id: number;
  name: string;
  category: string;
  whatsapp_phone: string;
  contact_name: string | null;
};

fornecedoresRouter.get("/", (_req, res) => {
  const suppliers = db
    .prepare("SELECT id, name, category, whatsapp_phone, contact_name FROM suppliers ORDER BY name")
    .all() as SupplierRow[];

  res.json({ suppliers });
});

fornecedoresRouter.post("/", (req, res) => {
  const { name, category, whatsapp_phone, contact_name } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Informe o nome do fornecedor." });
  }
  if (typeof whatsapp_phone !== "string" || !whatsapp_phone.trim()) {
    return res.status(400).json({ error: "Informe o WhatsApp do fornecedor." });
  }

  const result = db
    .prepare(
      "INSERT INTO suppliers (name, category, whatsapp_phone, contact_name) VALUES (?, ?, ?, ?)",
    )
    .run(
      name.trim(),
      typeof category === "string" ? category.trim() : "",
      whatsapp_phone.trim(),
      typeof contact_name === "string" && contact_name.trim() ? contact_name.trim() : null,
    );

  res.status(201).json({ id: Number(result.lastInsertRowid), created: true });
});

fornecedoresRouter.get("/:id/produtos", (req, res) => {
  const supplierId = Number(req.params.id);
  if (!Number.isInteger(supplierId)) {
    return res.status(400).json({ error: "Fornecedor inválido." });
  }

  const supplier = db.prepare("SELECT id FROM suppliers WHERE id = ?").get(supplierId);
  if (!supplier) {
    return res.status(404).json({ error: "Fornecedor não encontrado." });
  }

  const products = db
    .prepare(
      `SELECT p.id, p.supplier_id, p.stock_item_id, p.name, p.unit, p.price_cents, s.name as supplier_name
       FROM products p
       JOIN suppliers s ON s.id = p.supplier_id
       WHERE p.supplier_id = ?
       ORDER BY p.name`,
    )
    .all(supplierId) as Array<{
    id: number;
    supplier_id: number;
    stock_item_id: number | null;
    name: string;
    unit: string;
    price_cents: number;
    supplier_name: string;
  }>;

  res.json({
    products: products.map((product) => ({
      ...product,
      price: product.price_cents / 100,
    })),
  });
});
