import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { seedSuppliers } from "./seed-data.js";

const DATA_DIR = process.env.DB_DIR || path.join(process.cwd(), "data");
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, "bar.db");

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

export const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin'
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    whatsapp_phone TEXT NOT NULL DEFAULT '',
    contact_name TEXT
  );

  CREATE TABLE IF NOT EXISTS stock_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    current_quantity REAL NOT NULL DEFAULT 0,
    minimum_quantity REAL NOT NULL DEFAULT 0,
    cost_cents INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    stock_item_id INTEGER REFERENCES stock_items(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    total_cents INTEGER NOT NULL,
    whatsapp_phone TEXT NOT NULL,
    whatsapp_message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity REAL NOT NULL,
    unit_price_cents INTEGER NOT NULL
  );
`);

function countRows(table: string): number {
  const row = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
  return row.count;
}

function seed() {
  if (countRows("users") === 0) {
    const defaultPassword = process.env.SEED_ADMIN_PASSWORD || "1234";
    const passwordHash = bcrypt.hashSync(defaultPassword, 10);
    db.prepare(
      "INSERT INTO users (name, username, password_hash, role) VALUES (?, ?, ?, ?)",
    ).run("Administrador", "admin", passwordHash, "admin");
    console.log(
      `[seed] Usuário "admin" criado com senha padrão "${defaultPassword}". Troque assim que possível.`,
    );
  }

  if (countRows("suppliers") === 0) {
    const insertSupplier = db.prepare(
      "INSERT INTO suppliers (name, category, whatsapp_phone, contact_name) VALUES (?, ?, ?, ?)",
    );
    const insertStockItem = db.prepare(
      "INSERT INTO stock_items (name, unit, current_quantity, minimum_quantity, cost_cents) VALUES (?, ?, ?, ?, ?)",
    );
    const insertProduct = db.prepare(
      "INSERT INTO products (supplier_id, stock_item_id, name, unit, price_cents) VALUES (?, ?, ?, ?, ?)",
    );

    for (const supplier of seedSuppliers) {
      const supplierResult = insertSupplier.run(
        supplier.name,
        supplier.category,
        supplier.whatsappPhone,
        supplier.contactName ?? null,
      );
      const supplierId = Number(supplierResult.lastInsertRowid);

      for (const item of supplier.products) {
        const stockResult = insertStockItem.run(
          item.name,
          item.unit,
          item.currentStock,
          item.minimumStock,
          0,
        );
        const stockItemId = Number(stockResult.lastInsertRowid);
        insertProduct.run(supplierId, stockItemId, item.name, item.unit, 0);
      }
    }

    console.log(`[seed] ${seedSuppliers.length} fornecedores e seus produtos/estoque cadastrados.`);
  }
}

seed();
