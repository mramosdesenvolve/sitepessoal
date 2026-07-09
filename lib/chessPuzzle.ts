/**
 * Problema 10, por Machado de Assis (Ilustração Brasileira, 1877).
 * Mate em dois: 1.Bb5! (ameaça 2.Df6#); se 1…Rd8, então 2.Rf7# (mate por
 * descoberta da dama de h8 na oitava fila).
 *
 * FEN: 4B1KQ/1p2k2N/1P2p3/2Pp1p2/3P1P2/8/1n6/8 w - - 0 1
 */

export type PieceType = "K" | "Q" | "B" | "N" | "P" | "R";
export type PieceColor = "w" | "b";
export interface Piece {
  type: PieceType;
  color: PieceColor;
}
export type Square = string; // ex: "e8"
export type Pieces = Record<Square, Piece>;

export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

// glifos sólidos (mesmo conjunto para as duas cores — a cor vem do CSS,
// não de glifos brancos/pretos diferentes, para as peças terem o mesmo peso visual)
export const GLYPHS: Record<PieceType, string> = {
  K: "♚",
  Q: "♛",
  B: "♝",
  N: "♞",
  R: "♜",
  P: "♟",
};

export const INITIAL_PIECES: Pieces = {
  e8: { type: "B", color: "w" },
  g8: { type: "K", color: "w" },
  h8: { type: "Q", color: "w" },
  h7: { type: "N", color: "w" },
  b6: { type: "P", color: "w" },
  c5: { type: "P", color: "w" },
  d4: { type: "P", color: "w" },
  f4: { type: "P", color: "w" },
  b7: { type: "P", color: "b" },
  e7: { type: "K", color: "b" },
  e6: { type: "P", color: "b" },
  d5: { type: "P", color: "b" },
  f5: { type: "P", color: "b" },
  b2: { type: "N", color: "b" },
};

export const KEY_MOVE = { from: "e8", to: "b5" } as const;

interface Defense {
  from: Square;
  to: Square;
  notation: string;
  mateWith: "K" | "Q";
}

// as 6 defesas reais do problema — sorteada uma a cada partida
export const DEFENSES: Defense[] = [
  { from: "e7", to: "d8", notation: "1…Rd8", mateWith: "K" },
  { from: "e6", to: "e5", notation: "1…e5", mateWith: "Q" },
  { from: "b2", to: "a4", notation: "1…Ca4", mateWith: "Q" },
  { from: "b2", to: "c4", notation: "1…Cc4", mateWith: "Q" },
  { from: "b2", to: "d3", notation: "1…Cd3", mateWith: "Q" },
  { from: "b2", to: "d1", notation: "1…Cd1", mateWith: "Q" },
];

export const MATE_MOVES: Record<
  "K" | "Q",
  { from: Square; to: Square; notation: string; msg: string }
> = {
  K: {
    from: "g8",
    to: "f7",
    notation: "2.Rf7#",
    msg: "2.Rf7# — mate por descoberta: a dama de h8 varre a oitava fila. o rizoma se abre.",
  },
  Q: {
    from: "h8",
    to: "f6",
    notation: "2.Df6#",
    msg: "2.Df6# — mate. o rizoma se abre.",
  },
};

export const MSG_INITIAL =
  "as brancas jogam e dão mate em dois lances. jogue os dois lances das brancas para abrir o rizoma.";
export const MSG_WRONG_STAGE1 =
  "não é o lance-chave. procure o lance quieto que deixa as pretas sem defesa.";
export const MSG_WRONG_STAGE2 =
  "não é mate. procure o lance que não deixa nenhuma saída.";
export const MSG_KEY_MOVE_PLAYED = "1.Bb5! — zugzwang. as pretas pensam…";

export function pickDefense(): Defense {
  return DEFENSES[Math.floor(Math.random() * DEFENSES.length)];
}

export function squareIsDark(file: number, rank: number): boolean {
  return (file + rank) % 2 === 1;
}
