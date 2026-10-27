import { FormEvent, useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { supabase } from "../lib/supabase";

export function ResetPasswordPage({ onConcluido }: { onConcluido: () => void }) {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvar(event: FormEvent) {
    event.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setSalvando(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setSalvando(false);

    if (error) {
      setErro("Não foi possível salvar a nova senha. Tente novamente.");
      return;
    }
    onConcluido();
  }

  return (
    <main className="auth-page">
      <div className="auth-backdrop" aria-hidden="true" />
      <section className="auth-card auth-card-standalone">
        <span>Recuperação de acesso</span>
        <h2>Defina uma nova senha</h2>
        <p>Escolha uma nova senha para acessar a gestão do bar.</p>
        <form onSubmit={salvar}>
          <label>
            <span><LockKeyhole size={17} /> Nova senha</span>
            <input autoComplete="new-password" required type="password" value={senha} onChange={(event) => setSenha(event.target.value)} />
          </label>
          <label>
            <span><LockKeyhole size={17} /> Confirmar senha</span>
            <input autoComplete="new-password" required type="password" value={confirmarSenha} onChange={(event) => setConfirmarSenha(event.target.value)} />
          </label>
          {erro && <div className="auth-error" role="alert">{erro}</div>}
          <button disabled={salvando} type="submit"><LogIn size={19} /> {salvando ? "Salvando..." : "Salvar nova senha"}</button>
        </form>
      </section>
    </main>
  );
}
