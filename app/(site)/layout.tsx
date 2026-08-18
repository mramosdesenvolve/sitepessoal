/**
 * Grupo de rotas do site (database, sistemas, grafo, sobre, contato,
 * objeto, admin) — sem header/footer próprio; cada página monta sua
 * própria SiteNav/SiteFooter (ver components/site/).
 */
export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
