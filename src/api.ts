export type User = {
  id: number;
  name: string;
  username: string;
  role: string;
};

export type Supplier = {
  id: number;
  name: string;
  category: string;
  whatsapp_phone: string;
  contact_name: string | null;
};

export type Product = {
  id: number;
  supplier_id: number;
  stock_item_id: number | null;
  name: string;
  unit: string;
  price_cents: number;
  price: number;
  supplier_name?: string;
};

export type StockItem = {
  id: number;
  name: string;
  unit: string;
  current_quantity: number;
  minimum_quantity: number;
  cost_cents: number;
  cost: number;
  is_low: number;
};

export type OrderItemPayload = {
  supplier_product_id: number;
  quantity: number;
};

export type PurchaseOrderResponse = {
  id: number;
  supplier_id: number;
  total: number;
  whatsapp_phone: string;
  whatsapp_message: string;
};

const fallbackBase = `${window.location.protocol}//${window.location.hostname}:8000`;
export const API_BASE = localStorage.getItem("bar_api_base") || fallbackBase;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Erro na API.");
  }
  return data;
}

export const api = {
  login(username: string, password: string) {
    return request<{ user: User }>("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  listSuppliers() {
    return request<{ suppliers: Supplier[] }>("/api/fornecedores");
  },
  createSupplier(data: Omit<Supplier, "id">) {
    return request<{ id: number; created: boolean }>("/api/fornecedores", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  listProducts() {
    return request<{ products: Product[] }>("/api/produtos");
  },
  listSupplierProducts(supplierId: number) {
    return request<{ products: Product[] }>(`/api/fornecedores/${supplierId}/produtos`);
  },
  createProduct(data: { supplier_id: number; name: string; unit: string; price: number }) {
    return request<{ id: number; created: boolean }>("/api/produtos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  listStock() {
    return request<{ items: StockItem[] }>("/api/estoque");
  },
  updateStockItem(id: number, current_quantity: number) {
    return request<{ id: number; updated: boolean }>(`/api/estoque/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ current_quantity }),
    });
  },
  createOrder(supplier_id: number, items: OrderItemPayload[]) {
    return request<PurchaseOrderResponse>("/api/pedidos", {
      method: "POST",
      body: JSON.stringify({ supplier_id, items }),
    });
  },
};
