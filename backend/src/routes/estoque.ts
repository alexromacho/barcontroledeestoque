import { Router } from "express";
import { db } from "../db.js";

export const estoqueRouter = Router();

type StockRow = {
  id: number;
  name: string;
  unit: string;
  current_quantity: number;
  minimum_quantity: number;
  cost_cents: number;
};

estoqueRouter.get("/", (_req, res) => {
  const items = db
    .prepare(
      "SELECT id, name, unit, current_quantity, minimum_quantity, cost_cents FROM stock_items ORDER BY name",
    )
    .all() as StockRow[];

  res.json({
    items: items.map((item) => ({
      ...item,
      cost: item.cost_cents / 100,
      is_low: item.current_quantity < item.minimum_quantity ? 1 : 0,
    })),
  });
});

estoqueRouter.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Item de estoque inválido." });
  }

  const { current_quantity } = req.body ?? {};
  const quantity = Number(current_quantity);
  if (!Number.isFinite(quantity) || quantity < 0) {
    return res.status(400).json({ error: "Informe uma quantidade válida." });
  }

  const item = db.prepare("SELECT id FROM stock_items WHERE id = ?").get(id);
  if (!item) {
    return res.status(404).json({ error: "Item de estoque não encontrado." });
  }

  db.prepare("UPDATE stock_items SET current_quantity = ? WHERE id = ?").run(quantity, id);

  res.json({ id, updated: true });
});
