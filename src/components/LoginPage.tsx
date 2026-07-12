import { FormEvent, useState } from "react";
import { LockKeyhole, LogIn, User } from "lucide-react";
import { supabase } from "../lib/supabase";

export function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function entrar(event: FormEvent) {
    event.preventDefault();
    setEntrando(true);
    setErro("");
    const nome = usuario.trim().toLowerCase();
    const email = nome === "alexromacho"
      ? "alex.sromacho@gmail.com"
      : nome.includes("@") ? nome : `${nome}@bar.local`;
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
      setErro("Usuário ou senha inválidos.");
      setEntrando(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-backdrop" aria-hidden="true" />
      <header className="auth-brand">
        <img src="/logo-bar-portugues.jpeg" alt="" />
        <div><strong>Bar do Português</strong><span>Bauru · desde 1973</span></div>
      </header>

      <section className="auth-story" aria-labelledby="auth-story-title">
        <span className="auth-kicker">Uma esquina. Muitas histórias.</span>
        <h1 id="auth-story-title">Tradição que atravessa gerações.</h1>
        <p>
          Desde 1973, o Bar do Português reúne encontros, histórias e o espírito do verdadeiro boteco.
          Uma casa renovada ao longo do tempo, sem perder a memória de quem ajudou a construí-la.
        </p>
        <div className="auth-timeline">
          <figure><img src="/bar-portugues-memorias.png" alt="Memória ilustrativa do bar nos anos 1970" /><figcaption><strong>1973</strong><span>O começo de uma tradição em Bauru.</span></figcaption></figure>
          <figure><img src="/bar-portugues-memorias.png" alt="Memória ilustrativa da renovação do bar" /><figcaption><strong>2003</strong><span>Uma nova fase, com a mesma essência.</span></figcaption></figure>
          <figure><img src="/bar-portugues-memorias.png" alt="Memória ilustrativa do ambiente atual" /><figcaption><strong>Hoje</strong><span>História viva, gestão para o futuro.</span></figcaption></figure>
        </div>
        <small>Imagens ilustrativas inspiradas na memória e no ambiente do estabelecimento.</small>
      </section>

      <section className="auth-card">
        <span>Acesso administrativo</span>
        <h2>Bem-vindo</h2>
        <p>Entre para acessar a gestão do bar.</p>
        <form onSubmit={entrar}>
          <label><span><User size={17} /> Usuário</span><input autoComplete="username" required value={usuario} onChange={(event) => setUsuario(event.target.value)} /></label>
          <label><span><LockKeyhole size={17} /> Senha</span><input autoComplete="current-password" required type="password" value={senha} onChange={(event) => setSenha(event.target.value)} /></label>
          {erro && <div className="auth-error" role="alert">{erro}</div>}
          <button disabled={entrando} type="submit"><LogIn size={19} /> {entrando ? "Entrando..." : "Entrar"}</button>
        </form>
      </section>
    </main>
  );
}
