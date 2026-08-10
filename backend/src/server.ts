import express from "express";
import cors from "cors";
import "./db.js";
import { authRouter } from "./routes/auth.js";
import { fornecedoresRouter } from "./routes/fornecedores.js";
import { produtosRouter } from "./routes/produtos.js";
import { estoqueRouter } from "./routes/estoque.js";
import { pedidosRouter } from "./routes/pedidos.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/login", authRouter);
app.use("/api/fornecedores", fornecedoresRouter);
app.use("/api/produtos", produtosRouter);
app.use("/api/estoque", estoqueRouter);
app.use("/api/pedidos", pedidosRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor." });
});

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Bar backend rodando em http://${HOST}:${PORT}`);
});
