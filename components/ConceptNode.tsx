import type { Theme } from "@/store/useAppStore";

/**
 * Nó customizado do grafo. O react-force-graph-2d desenha em <canvas>,
 * então o "componente" aqui é uma função de pintura usada em
 * nodeCanvasObject — não um componente React tradicional.
 *
 * Se um dia o grafo migrar para d3-force puro dentro de <svg>
 * (alternativa prevista no briefing caso o visual fique genérico),
 * esta função vira um componente <circle> + <text> com as mesmas regras.
 */

export interface GraphPalette {
  paper: string;
  ink: string;
  accent: string;
  muted: string;
  line: string;
  /** linha entre nós fora da vizinhança/busca ativa — quase invisível */
  lineDim: string;
}

/**
 * O canvas não lê variáveis CSS/Tailwind — precisa dos valores resolvidos.
 * Os tons abaixo espelham os tokens de app/globals.css; se um dia mudar
 * um lado, mude o outro também.
 */
export const GRAPH_PALETTES: Record<Theme, GraphPalette> = {
  light: {
    paper: "#FAFAF6",
    ink: "#16160F",
    accent: "#B5651D",
    muted: "rgba(22, 22, 15, 0.35)",
    line: "rgba(22, 22, 15, 0.12)",
    lineDim: "rgba(22, 22, 15, 0.03)",
  },
  dark: {
    paper: "#0A0A09",
    ink: "#F0EEE7",
    accent: "#D68A4A",
    muted: "rgba(240, 238, 231, 0.35)",
    line: "rgba(240, 238, 231, 0.12)",
    lineDim: "rgba(240, 238, 231, 0.03)",
  },
};

export interface GraphNodeDatum {
  id: string;
  label: string;
  description?: string;
  /** número de objetos conectados — controla o raio do nó */
  val: number;
  x?: number;
  y?: number;
}

export interface NodePaintState {
  hoveredId: string | null;
  selectedId: string | null;
  /** vizinhos do nó em hover (inclui o próprio) */
  neighborIds: Set<string>;
  /** null = sem busca; Set = conceitos relacionados aos resultados */
  activeConceptIds: Set<string> | null;
  palette: GraphPalette;
}

export function nodeRadius(val: number) {
  // raio proporcional ao nº de objetos conectados, com piso legível
  return 3.5 + val * 1.6;
}

export function drawConceptNode(
  node: GraphNodeDatum,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  state: NodePaintState
) {
  const { hoveredId, selectedId, neighborIds, activeConceptIds, palette } =
    state;
  const r = nodeRadius(node.val);
  const x = node.x ?? 0;
  const y = node.y ?? 0;

  const isSelected = selectedId === node.id;
  const isHovered = hoveredId === node.id;
  const inNeighborhood = hoveredId ? neighborIds.has(node.id) : true;
  const matchesSearch = activeConceptIds ? activeConceptIds.has(node.id) : true;

  // Nó "apagado": fora da vizinhança em hover, ou fora dos resultados da busca
  const dimmed = !inNeighborhood || !matchesSearch;
  const alpha = dimmed ? 0.14 : 1;

  ctx.globalAlpha = alpha;

  // círculo: contorno fino de tinta; preenchimento só no ativo
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  if (isSelected || isHovered) {
    ctx.fillStyle = palette.accent;
    ctx.fill();
  } else {
    ctx.fillStyle = palette.paper;
    ctx.fill();
    ctx.lineWidth = 1 / globalScale;
    ctx.strokeStyle = palette.ink;
    ctx.stroke();
  }

  // rótulo sempre visível — o grafo é navegação primária, não decoração
  const fontSize = Math.max(11 / globalScale, 2.5);
  ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = isSelected || isHovered ? palette.accent : palette.ink;
  ctx.fillText(node.label, x, y + r + 3 / globalScale);

  ctx.globalAlpha = 1;
}
