import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Boxes, LogIn, Minus, Package, Plus, Send, ShoppingCart, Truck } from "lucide-react";
import { API_BASE, Product, StockItem, Supplier, User, api } from "./api";
import "./styles.css";

type Tab = "fornecedores" | "produtos" | "pedido" | "estoque";
type Cart = Record<number, number>;

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("bar_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [tab, setTab] = useState<Tab>("fornecedores");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [supplierProducts, setSupplierProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>({});
  const [message, setMessage] = useState("");

  async function refreshAll() {
    const [supplierData, productData, stockData] = await Promise.all([
      api.listSuppliers(),
      api.listProducts(),
      api.listStock(),
    ]);
    setSuppliers(supplierData.suppliers);
    setProducts(productData.products);
    setStock(stockData.items);
    setSelectedSupplierId((current) => current ?? supplierData.suppliers[0]?.id ?? null);
  }

  useEffect(() => {
    if (user) {
      refreshAll().catch((error) => setMessage(error.message));
    }
  }, [user]);

  useEffect(() => {
    if (!selectedSupplierId) return;
    api
      .listSupplierProducts(selectedSupplierId)
      .then((data) => setSupplierProducts(data.products))
      .catch((error) => setMessage(error.message));
  }, [selectedSupplierId]);

  function handleLogout() {
    localStorage.removeItem("bar_user");
    setUser(null);
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <span className="eyebrow">Bar Gestão</span>
          <h1>Operação do bar</h1>
          <p>API conectada em {API_BASE}</p>
        </div>
        <button className="secondary-button" type="button" onClick={handleLogout}>
          Sair
        </button>
      </header>

      {message && (
        <button className="notice" type="button" onClick={() => setMessage("")}>
          {message}
        </button>
      )}

      <nav className="tabs">
        <TabButton active={tab === "fornecedores"} onClick={() => setTab("fornecedores")} icon={<Truck />}>
          Fornecedores
        </TabButton>
        <TabButton active={tab === "produtos"} onClick={() => setTab("produtos")} icon={<Package />}>
          Produtos
        </TabButton>
        <TabButton active={tab === "pedido"} onClick={() => setTab("pedido")} icon={<ShoppingCart />}>
          Pedido
        </TabButton>
        <TabButton active={tab === "estoque"} onClick={() => setTab("estoque")} icon={<Boxes />}>
          Estoque
        </TabButton>
      </nav>

      {tab === "fornecedores" && (
        <SuppliersPage suppliers={suppliers} onCreated={refreshAll} onMessage={setMessage} />
      )}
      {tab === "produtos" && (
        <ProductsPage suppliers={suppliers} products={products} onCreated={refreshAll} onMessage={setMessage} />
      )}
      {tab === "pedido" && (
        <OrderPage
          suppliers={suppliers}
          selectedSupplierId={selectedSupplierId}
          setSelectedSupplierId={setSelectedSupplierId}
          products={supplierProducts}
          cart={cart}
          setCart={setCart}
          onMessage={setMessage}
        />
      )}
      {tab === "estoque" && <StockPage stock={stock} onUpdated={refreshAll} onMessage={setMessage} />}
    </main>
  );
}

function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const data = await api.login(username, password);
      localStorage.setItem("bar_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Erro ao entrar.");
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div>
          <span className="eyebrow">Acesso interno</span>
          <h1>Entrar</h1>
          <p>Use o usuário criado no banco para acessar fornecedores, produtos, pedidos e estoque.</p>
        </div>
        <label>
          Usuário
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit">
          <LogIn size={18} />
          Entrar
        </button>
      </form>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button className={active ? "tab is-active" : "tab"} type="button" onClick={onClick}>
      {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      {children}
    </button>
  );
}

function SuppliersPage({
  suppliers,
  onCreated,
  onMessage,
}: {
  suppliers: Supplier[];
  onCreated: () => Promise<void>;
  onMessage: (message: string) => void;
}) {
  const [form, setForm] = useState({ name: "", category: "", whatsapp_phone: "", contact_name: "" });

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.createSupplier(form);
    setForm({ name: "", category: "", whatsapp_phone: "", contact_name: "" });
    await onCreated();
    onMessage("Fornecedor cadastrado.");
  }

  return (
    <section className="grid-two">
      <FormPanel title="Cadastro de fornecedores" onSubmit={submit}>
        <Field label="Nome" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <Field label="Categoria" value={form.category} onChange={(value) => setForm({ ...form, category: value })} />
        <Field label="WhatsApp com DDI e DDD" value={form.whatsapp_phone} onChange={(value) => setForm({ ...form, whatsapp_phone: value })} />
        <Field label="Contato" value={form.contact_name} onChange={(value) => setForm({ ...form, contact_name: value })} />
        <SubmitButton>Cadastrar fornecedor</SubmitButton>
      </FormPanel>

      <ListPanel title="Fornecedores">
        {suppliers.map((supplier) => (
          <article className="list-row" key={supplier.id}>
            <div>
              <strong>{supplier.name}</strong>
              <span>{supplier.category} · {supplier.contact_name || "sem contato"}</span>
            </div>
            <a href={`https://wa.me/${supplier.whatsapp_phone}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </article>
        ))}
      </ListPanel>
    </section>
  );
}

function ProductsPage({
  suppliers,
  products,
  onCreated,
  onMessage,
}: {
  suppliers: Supplier[];
  products: Product[];
  onCreated: () => Promise<void>;
  onMessage: (message: string) => void;
}) {
  const [form, setForm] = useState({ supplier_id: "", name: "", unit: "", price: "" });

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.createProduct({
      supplier_id: Number(form.supplier_id),
      name: form.name,
      unit: form.unit,
      price: Number(form.price),
    });
    setForm({ supplier_id: "", name: "", unit: "", price: "" });
    await onCreated();
    onMessage("Produto cadastrado.");
  }

  return (
    <section className="grid-two">
      <FormPanel title="Cadastro de produtos" onSubmit={submit}>
        <label>
          Fornecedor
          <select value={form.supplier_id} onChange={(event) => setForm({ ...form, supplier_id: event.target.value })} required>
            <option value="">Selecione</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </select>
        </label>
        <Field label="Produto" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <Field label="Unidade" value={form.unit} onChange={(value) => setForm({ ...form, unit: value })} />
        <Field label="Preço" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
        <SubmitButton>Cadastrar produto</SubmitButton>
      </FormPanel>

      <ListPanel title="Produtos">
        {products.map((product) => (
          <article className="list-row" key={product.id}>
            <div>
              <strong>{product.name}</strong>
              <span>{product.supplier_name} · {product.unit}</span>
            </div>
            <b>{money.format(product.price)}</b>
          </article>
        ))}
      </ListPanel>
    </section>
  );
}

function OrderPage({
  suppliers,
  selectedSupplierId,
  setSelectedSupplierId,
  products,
  cart,
  setCart,
  onMessage,
}: {
  suppliers: Supplier[];
  selectedSupplierId: number | null;
  setSelectedSupplierId: (id: number) => void;
  products: Product[];
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  onMessage: (message: string) => void;
}) {
  const selectedSupplier = suppliers.find((supplier) => supplier.id === selectedSupplierId);
  const total = useMemo(
    () => products.reduce((sum, product) => sum + (cart[product.id] || 0) * product.price, 0),
    [cart, products],
  );

  function changeQuantity(productId: number, step: number) {
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[productId] || 0) + step);
      const next = { ...current, [productId]: nextQuantity };
      if (nextQuantity === 0) delete next[productId];
      return next;
    });
  }

  async function sendOrder() {
    if (!selectedSupplierId) return;
    const items = Object.entries(cart).map(([supplier_product_id, quantity]) => ({
      supplier_product_id: Number(supplier_product_id),
      quantity,
    }));
    if (!items.length) {
      onMessage("Adicione pelo menos um produto ao pedido.");
      return;
    }
    const order = await api.createOrder(selectedSupplierId, items);
    setCart({});
    onMessage(`Pedido ${order.id} registrado.`);
    window.open(`https://wa.me/${order.whatsapp_phone}?text=${encodeURIComponent(order.whatsapp_message)}`, "_blank");
  }

  return (
    <section className="grid-two">
      <section className="panel">
        <h2>Tela de pedido</h2>
        <label>
          Fornecedor
          <select value={selectedSupplierId ?? ""} onChange={(event) => setSelectedSupplierId(Number(event.target.value))}>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </select>
        </label>
        <div className="item-list">
          {products.map((product) => (
            <article className="list-row" key={product.id}>
              <div>
                <strong>{product.name}</strong>
                <span>{money.format(product.price)} · {product.unit}</span>
              </div>
              <div className="stepper">
                <button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label="Remover">
                  <Minus size={16} />
                </button>
                <b>{cart[product.id] || 0}</b>
                <button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label="Adicionar">
                  <Plus size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Carrinho</h2>
        <p className="muted">{selectedSupplier?.name || "Selecione um fornecedor"}</p>
        <div className="item-list">
          {products.filter((product) => cart[product.id]).map((product) => (
            <article className="list-row" key={product.id}>
              <span>{cart[product.id]}x {product.name}</span>
              <b>{money.format(cart[product.id] * product.price)}</b>
            </article>
          ))}
        </div>
        <div className="total-row">
          <span>Total</span>
          <strong>{money.format(total)}</strong>
        </div>
        <button type="button" onClick={sendOrder}>
          <Send size={18} />
          Enviar pelo WhatsApp
        </button>
      </section>
    </section>
  );
}

function StockPage({
  stock,
  onUpdated,
  onMessage,
}: {
  stock: StockItem[];
  onUpdated: () => Promise<void>;
  onMessage: (message: string) => void;
}) {
  async function update(item: StockItem, nextQuantity: number) {
    await api.updateStockItem(item.id, Math.max(0, nextQuantity));
    await onUpdated();
    onMessage("Estoque atualizado.");
  }

  return (
    <section className="panel">
      <h2>Estoque simples</h2>
      <div className="stock-grid">
        {stock.map((item) => (
          <article className={item.is_low ? "stock-card is-low" : "stock-card"} key={item.id}>
            <div>
              <strong>{item.name}</strong>
              <span>Mínimo: {item.minimum_quantity} {item.unit}</span>
            </div>
            <div className="stepper">
              <button type="button" onClick={() => update(item, item.current_quantity - 1)} aria-label="Diminuir estoque">
                <Minus size={16} />
              </button>
              <b>{item.current_quantity.toLocaleString("pt-BR")} {item.unit}</b>
              <button type="button" onClick={() => update(item, item.current_quantity + 1)} aria-label="Aumentar estoque">
                <Plus size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FormPanel({ title, onSubmit, children }: { title: string; onSubmit: (event: FormEvent) => void; children: React.ReactNode }) {
  return (
    <form className="panel form-panel" onSubmit={onSubmit}>
      <h2>{title}</h2>
      {children}
    </form>
  );
}

function ListPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="item-list">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      {label}
      <input type={type} min={type === "number" ? "0" : undefined} step={type === "number" ? "0.01" : undefined} value={value} onChange={(event) => onChange(event.target.value)} required />
    </label>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button type="submit">
      <Plus size={18} />
      {children}
    </button>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
