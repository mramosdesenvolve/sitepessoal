/**
 * Grupo de rotas da identidade "terminal" (editor de código): acervo,
 * sobre, objeto. Sem header/footer do site — cada página monta sua
 * própria moldura (TermTitlebar/TermTabs, ver components/terminal/) e
 * ocupa a tela cheia sozinha. A home ("/") fica fora deste grupo pela
 * mesma razão.
 */
export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
