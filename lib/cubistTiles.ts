/** Recortes do retrato cubista — dados exatos do handoff (opção 7a). */
export interface TileSpec {
  left: number;
  top: number;
  w: number;
  h: number;
  bgSize: number;
  bgX: number;
  bgY: number;
  rot: number; // décimos de grau — só usado como fator na fórmula de interação
  z: number;
}

export const TILES: TileSpec[] = [
  { left: 410, top: 90, w: 300, h: 150, bgSize: 635, bgX: -143, bgY: -25, rot: -13, z: 1 },
  { left: 710, top: 90, w: 160, h: 150, bgSize: 635, bgX: -397, bgY: -37, rot: 9, z: 1 },
  { left: 410, top: 240, w: 110, h: 190, bgSize: 635, bgX: -112, bgY: -167, rot: -7, z: 1 },
  { left: 520, top: 240, w: 170, h: 120, bgSize: 870, bgX: -247, bgY: -255, rot: 12, z: 2 },
  { left: 690, top: 260, w: 180, h: 130, bgSize: 1075, bgX: -546, bgY: -326, rot: -16, z: 3 },
  { left: 560, top: 360, w: 140, h: 140, bgSize: 717, bgX: -294, bgY: -273, rot: 6, z: 2 },
  { left: 700, top: 390, w: 120, h: 160, bgSize: 635, bgX: -409, bgY: -236, rot: -10, z: 1 },
  { left: 540, top: 460, w: 180, h: 110, bgSize: 737, bgX: -281, bgY: -328, rot: 14, z: 3 },
  { left: 410, top: 430, w: 130, h: 180, bgSize: 635, bgX: -155, bgY: -298, rot: -8, z: 1 },
  { left: 540, top: 570, w: 200, h: 140, bgSize: 614, bgX: -210, bgY: -336, rot: 11, z: 2 },
  { left: 740, top: 520, w: 130, h: 190, bgSize: 635, bgX: -372, bgY: -322, rot: -14, z: 1 },
];

export const STAGE_W = 1280;
export const STAGE_H = 800;
export const STAGE_CENTER_X = 640;
export const STAGE_CENTER_Y = 400;
