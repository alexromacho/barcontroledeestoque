import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";

export const authRouter = Router();

type UserRow = {
  id: number;
  name: string;
  username: string;
  password_hash: string;
  role: string;
};

authRouter.post("/", (req, res) => {
  const { username, password } = req.body ?? {};

  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    return res.status(400).json({ error: "Informe usuário e senha." });
  }

  const user = db
    .prepare("SELECT id, name, username, password_hash, role FROM users WHERE username = ?")
    .get(username) as UserRow | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Usuário ou senha inválidos." });
  }

  res.json({
    user: { id: user.id, name: user.name, username: user.username, role: user.role },
  });
});
