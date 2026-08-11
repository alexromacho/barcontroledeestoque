import { Router } from "express";
import { db } from "../db.js";

export const pedidosRouter = Router();

type OrderItemPayload = {
  supplier_product_id: number;
  quantity: number;
};

type SupplierRow = {
  id: number;
  name: string;
  whatsapp_phone: string;
};

type ProductRow = {
  id: number;
  name: string;
  unit: string;
  price_cents: number;
};

pedidosRouter.post("/", (req, res) => {
  const { supplier_id, items } = req.body ?? {};

  const supplierId = Number(supplier_id);
  if (!Number.isInteger(supplierId)) {
    return res.status(400).json({ error: "Selecione um fornecedor." });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Adicione pelo menos um item ao pedido." });
  }

  const supplier = db
    .prepare("SELECT id, name, whatsapp_phone FROM suppliers WHERE id = ?")
    .get(supplierId) as SupplierRow | undefined;

  if (!supplier) {
    return res.status(404).json({ error: "Fornecedor não encontrado." });
  }

  const productStmt = db.prepare(
    "SELECT id, name, unit, price_cents FROM products WHERE id = ? AND supplier_id = ?",
  );

  const resolvedItems: Array<{ product: ProductRow; quantity: number; subtotalCents: number }> = [];

  for (const rawItem of items as OrderItemPayload[]) {
    const productId = Number(rawItem?.supplier_product_id);
    const quantity = Number(rawItem?.quantity);

    if (!Number.isInteger(productId) || !Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Item de pedido inválido." });
    }

    const product = productStmt.get(productId, supplierId) as ProductRow | undefined;
    if (!product) {
      return res.status(404).json({ error: `Produto ${productId} não encontrado para este fornecedor.` });
    }

    resolvedItems.push({
      product,
      quantity,
      subtotalCents: Math.round(product.price_cents * quantity),
    });
  }

  const totalCents = resolvedItems.reduce((sum, item) => sum + item.subtotalCents, 0);

  const linhasPedido = resolvedItems
    .map((item) => `* ${item.quantity} ${item.product.unit} de ${item.product.name}`)
    .join("\n");
  const whatsappMessage = `Olá, tudo bem? Boa tarde, preciso de:\n\n${linhasPedido}\n\nObrigado.`;

  const insertOrder = db.prepare(
    "INSERT INTO orders (supplier_id, total_cents, whatsapp_phone, whatsapp_message) VALUES (?, ?, ?, ?)",
  );
  const insertOrderItem = db.prepare(
    "INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES (?, ?, ?, ?)",
  );

  db.exec("BEGIN");
  try {
    const orderResult = insertOrder.run(supplierId, totalCents, supplier.whatsapp_phone, whatsappMessage);
    const orderId = Number(orderResult.lastInsertRowid);

    for (const item of resolvedItems) {
      insertOrderItem.run(orderId, item.product.id, item.quantity, item.product.price_cents);
    }

    db.exec("COMMIT");

    res.status(201).json({
      id: orderId,
      supplier_id: supplierId,
      total: totalCents / 100,
      whatsapp_phone: supplier.whatsapp_phone,
      whatsapp_message: whatsappMessage,
    });
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
});
