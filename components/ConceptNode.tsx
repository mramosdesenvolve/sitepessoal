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
  /** font-family dos rótulos no canvas; default Inter se omitido */
  nodeFont?: string;
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

// Largura média de um caractere monoespaçado, em frações do font-size —
// usado para estimar o tamanho do "chip" sem precisar de canvas (física e
// hit-area rodam sem ctx disponível). Fontes monoespaçadas reais variam
// pouco disso, então a aproximação não desalinha visualmente.
const CHAR_WIDTH_EM = 0.6;

function chipFontSize(val: number) {
  // tamanho proporcional ao nº de objetos conectados, com piso legível
  return 10 + Math.min(val, 8) * 0.8;
}

/** Dimensões aproximadas do chip `[rótulo]`, em unidades de mundo (sem
 * depender de zoom) — usado pela força de colisão e pela hit-area. */
export function nodeChipSize(label: string, val: number) {
  const fontSize = chipFontSize(val);
  const padX = fontSize * 0.55 * 2;
  const padY = fontSize * 0.5 * 2;
  const width = (label.length + 2) * fontSize * CHAR_WIDTH_EM + padX;
  const height = fontSize + padY;
  return { width, height };
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawConceptNode(
  node: GraphNodeDatum,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  state: NodePaintState
) {
  const { hoveredId, selectedId, neighborIds, activeConceptIds, palette } =
    state;
  const x = node.x ?? 0;
  const y = node.y ?? 0;

  const isSelected = selectedId === node.id;
  const isHovered = hoveredId === node.id;
  const active = isSelected || isHovered;
  const inNeighborhood = hoveredId ? neighborIds.has(node.id) : true;
  const matchesSearch = activeConceptIds ? activeConceptIds.has(node.id) : true;

  // Nó "apagado": fora da vizinhança em hover, ou fora dos resultados da busca
  const dimmed = !inNeighborhood || !matchesSearch;
  ctx.globalAlpha = dimmed ? 0.14 : 1;

  // tamanho de fonte screen-constant (não encolhe/cresce demais com zoom) —
  // mesma técnica do rótulo original, agora aplicada ao chip inteiro
  const fontSize = Math.max(chipFontSize(node.val) / globalScale, 3);
  ctx.font = `${fontSize}px ${palette.nodeFont ?? "ui-monospace, monospace"}`;
  ctx.textBaseline = "middle";

  const text = `[${node.label}]`;
  const textWidth = ctx.measureText(text).width;
  const padX = fontSize * 0.55;
  const padY = fontSize * 0.5;
  const boxW = textWidth + padX * 2;
  const boxH = fontSize + padY * 2;
  const radius = Math.min(4 / globalScale, boxH / 2);

  roundRectPath(ctx, x - boxW / 2, y - boxH / 2, boxW, boxH, radius);
  if (active) {
    ctx.fillStyle = palette.accent;
    ctx.fill();
  } else {
    ctx.fillStyle = palette.paper;
    ctx.fill();
    ctx.lineWidth = 1 / globalScale;
    ctx.strokeStyle = palette.line;
    ctx.stroke();
  }

  // brackets em tom apagado, rótulo em destaque — mesmo padrão visual do
  // resto do site (ex. "formação: [...]" nas páginas sobre/home)
  ctx.textAlign = "left";
  const bracketColor = active ? palette.paper : palette.muted;
  const labelColor = active ? palette.paper : palette.ink;
  let cursorX = x - textWidth / 2;

  ctx.fillStyle = bracketColor;
  ctx.fillText("[", cursorX, y);
  cursorX += ctx.measureText("[").width;

  ctx.fillStyle = labelColor;
  ctx.fillText(node.label, cursorX, y);
  cursorX += ctx.measureText(node.label).width;

  ctx.fillStyle = bracketColor;
  ctx.fillText("]", cursorX, y);

  ctx.globalAlpha = 1;
}
