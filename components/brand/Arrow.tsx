/** Seta de traço 1.5 (estilo Lucide, `currentColor`) — o design system não
 * traz conjunto de ícones; a seta cobre pílulas e linhas clicáveis. */
export function Arrow({
  dir = "right",
  className = "h-4 w-4",
}: {
  dir?: "right" | "down" | "up-right";
  className?: string;
}) {
  const paths = {
    right: "M4 12h16M14 6l6 6-6 6",
    down: "M12 4v16M6 14l6 6 6-6",
    "up-right": "M7 17L17 7M8 7h9v9",
  } as const;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[dir]} />
    </svg>
  );
}
