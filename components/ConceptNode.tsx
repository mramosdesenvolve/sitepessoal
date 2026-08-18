/**
 * Nó customizado do grafo. O react-force-graph-2d desenha em <canvas>,
 * então o "componente" aqui é uma função de pintura usada em
 * nodeCanvasObject — não um componente React tradicional.
 */

export interface GraphPalette {
  paper: string;
  ink: string;
  accent: string;
  muted: string;
  line: string;
  /** linha entre nós fora da vizinhança/busca ativa — quase invisível */
  lineDim: string;
  /** font-family dos rótulos no canvas; default Inter se omitido */
  nodeFont?: string;
}

/**
 * O canvas não lê variáveis CSS/Tailwind — precisa dos valores resolvidos.
 * Os tons abaixo espelham os tokens de app/globals.css; se um dia mudar
 * um lado, mude o outro também.
 */
export const GRAPH_PALETTE: GraphPalette = {
  paper: "#FFFFFF",
  ink: "#0A0A0A",
  accent: "#B5651D",
  muted: "rgba(10, 10, 10, 0.4)",
  line: "rgba(10, 10, 10, 0.18)",
  lineDim: "rgba(10, 10, 10, 0.05)",
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

function nodeRadius(val: number) {
  return 4 + Math.min(val, 10) * 1.1;
}

/** Dimensões aproximadas do nó + rótulo, em unidades de mundo (sem
 * depender de zoom) — usado pela força de colisão e pela hit-area. */
export function nodeChipSize(label: string, val: number) {
  const r = nodeRadius(val);
  const fontSize = 11;
  const labelWidth = label.length * fontSize * 0.58;
  const width = r * 2 + 8 + labelWidth;
  const height = Math.max(r * 2, fontSize) + 6;
  return { width, height };
}

export function drawConceptNode(
  node: GraphNodeDatum,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  state: NodePaintState
) {
  const { hoveredId, selectedId, neighborIds, activeConceptIds, palette } = state;
  const x = node.x ?? 0;
  const y = node.y ?? 0;

  const isSelected = selectedId === node.id;
  const isHovered = hoveredId === node.id;
  const active = isSelected || isHovered;
  const inNeighborhood = hoveredId ? neighborIds.has(node.id) : true;
  const matchesSearch = activeConceptIds ? activeConceptIds.has(node.id) : true;

  const dimmed = !inNeighborhood || !matchesSearch;
  ctx.globalAlpha = dimmed ? 0.15 : 1;

  const r = nodeRadius(node.val);

  // nó: círculo simples, cheio quando ativo, contorno fino quando em repouso
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (active) {
    ctx.fillStyle = palette.accent;
    ctx.fill();
  } else {
    ctx.fillStyle = palette.paper;
    ctx.fill();
    ctx.lineWidth = 1.4 / globalScale;
    ctx.strokeStyle = palette.ink;
    ctx.stroke();
  }

  // rótulo à direita do nó — tamanho screen-constant (não encolhe/cresce
  // demais com zoom)
  const fontSize = Math.max(11 / globalScale, 3.2);
  ctx.font = `${active ? "600" : "500"} ${fontSize}px ${palette.nodeFont ?? "Inter, ui-sans-serif, sans-serif"}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = active ? palette.ink : palette.muted;
  ctx.fillText(node.label, x + r + 6 / globalScale, y);

  ctx.globalAlpha = 1;
}
