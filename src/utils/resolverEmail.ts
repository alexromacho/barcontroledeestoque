export function resolverEmailDeUsuario(usuario: string): string {
  const nome = usuario.trim().toLowerCase();
  if (nome === "alexromacho") return "alex.sromacho@gmail.com";
  return nome.includes("@") ? nome : `${nome}@bar.local`;
}
