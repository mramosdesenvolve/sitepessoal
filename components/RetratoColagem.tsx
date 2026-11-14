"use client";

import { useEffect, useRef } from "react";

interface RetratoColagemProps {
  /** recortes em cinza das fotos originais (com o fundo), no mesmo
   * enquadramento das poses do retrato em traço */
  fotos: string[];
  className?: string;
}

interface Strip {
  pose: number;
  /** topo e altura, em fração da altura do retrato */
  y: number;
  h: number;
  /** começo e fim, em fração da largura (pode passar da borda esquerda) */
  x0: number;
  x1: number;
  /** deslocamento da foto dentro da tira — o "desencontro" da colagem */
  shift: number;
  tint: string;
  rot: number;
}

interface Paper {
  y: number;
  h: number;
  x0: number;
  x1: number;
  rot: number;
  /** bordas rasgadas: desvios por ponto, à esquerda e à direita */
  left: number[];
  right: number[];
}

const TICK_MS = 150; // ~7 quadros por segundo: cadência de stop-motion
const SWAP_EVERY = 7; // a cada tantos quadros, uma tira é trocada
const RESHUFFLE_EVERY = 46; // a cada tantos quadros, a colagem é refeita
const BLEED = 0.12; // quanto o papel pode passar da borda esquerda do retrato

// tons de papel fotográfico: frio, quente, neutro
const TINTS = ["#c7cedd", "#e0d5c3", "#d9d9d6", "#bfc6d2"];
// faixas onde as tiras caem: olhos, boca, ombros (fração da altura)
const BANDS: [number, number][] = [
  [0.27, 0.13],
  [0.45, 0.12],
  [0.63, 0.15],
];

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function tornEdge(points: number): number[] {
  const edge: number[] = [];
  let v = 0;
  for (let i = 0; i < points; i++) {
    v = v * 0.5 + rand(-1, 1);
    edge.push(v);
  }
  return edge;
}

function makeStrip(band: number, pose: number): Strip {
  const [y, h] = BANDS[band];
  return {
    pose,
    y: y + rand(-0.015, 0.015),
    h: h + rand(-0.015, 0.02),
    x0: rand(-BLEED, 0.12),
    x1: rand(0.86, 1),
    shift: rand(-0.035, 0.035),
    tint: TINTS[Math.floor(Math.random() * TINTS.length)],
    rot: rand(-0.012, 0.012),
  };
}

function makePaper(): Paper {
  return {
    y: rand(0.8, 0.84),
    h: rand(0.13, 0.16),
    x0: rand(0.08, 0.2),
    x1: rand(0.78, 0.9),
    rot: rand(-0.03, 0.02),
    left: tornEdge(9),
    right: tornEdge(9),
  };
}

/**
 * Colagem em stop-motion por cima do retrato em traço: tiras de fotografia
 * (cada uma de uma pose diferente, com o fundo e tudo) e um papel vermelho
 * rasgado, que tremem e se rearranjam quadro a quadro, como papel recortado
 * fotografado sob a câmera. Nada desliza: cada quadro é um salto. A cada
 * poucos segundos a colagem é desfeita e refeita, peça por peça; um clique
 * refaz na hora.
 */
export function RetratoColagem({ fotos, className }: RetratoColagemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const images: (HTMLImageElement | undefined)[] = new Array(fotos.length).fill(undefined);

    let disposed = false;
    let visible = true;
    let timer: ReturnType<typeof setInterval> | undefined;
    let tick = 0;
    let cssW = 0;
    let cssH = 0;

    let strips: Strip[] = [];
    let paper: Paper | null = null;
    /** peças ainda por colar depois de um "refazer" */
    let queue: (Strip | Paper)[] = [];

    // grão de papel, gerado uma vez
    const grain = document.createElement("canvas");
    grain.width = grain.height = 96;
    const gctx = grain.getContext("2d");
    if (gctx) {
      const data = gctx.createImageData(96, 96);
      for (let i = 0; i < data.data.length; i += 4) {
        const v = Math.random() * 255;
        data.data[i] = data.data[i + 1] = data.data[i + 2] = v;
        data.data[i + 3] = 255;
      }
      gctx.putImageData(data, 0, 0);
    }

    function loadedPoses(): number[] {
      return images.map((img, i) => (img ? i : -1)).filter((i) => i >= 0);
    }

    function randomPose(not?: number): number {
      const pool = loadedPoses().filter((i) => i !== not);
      return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : 0;
    }

    function deal() {
      // poses distintas nas três tiras, quando houver fotos para isso
      const used: number[] = [];
      const fresh = BANDS.map((_, band) => {
        let pose = randomPose();
        for (let tries = 0; tries < 6 && used.includes(pose); tries++) pose = randomPose();
        used.push(pose);
        return makeStrip(band, pose);
      });
      return { fresh, sheet: makePaper() };
    }

    function reshuffle() {
      const { fresh, sheet } = deal();
      if (reduced) {
        strips = fresh;
        paper = sheet;
        return;
      }
      strips = [];
      paper = null;
      queue = [...fresh.sort(() => Math.random() - 0.5), sheet];
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = rect.width;
      cssH = rect.height;
      canvas!.width = Math.round(cssW * dpr);
      canvas!.height = Math.round(cssH * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      ctx!.clearRect(0, 0, cssW, cssH);
      if (cssW === 0) return;
      // o canvas é mais largo que o retrato: sobra à esquerda para o papel
      const boxW = cssW / (1 + BLEED);
      const boxX = cssW - boxW;
      const jitter = reduced ? 0 : 1;

      for (const s of strips) {
        const img = images[s.pose];
        if (!img) continue;
        const x = boxX + s.x0 * boxW;
        const w = (s.x1 - s.x0) * boxW;
        const y = s.y * cssH;
        const h = s.h * cssH;
        ctx!.save();
        ctx!.translate(
          x + w / 2 + rand(-1.3, 1.3) * jitter,
          y + h / 2 + rand(-1.1, 1.1) * jitter
        );
        ctx!.rotate(s.rot + rand(-0.006, 0.006) * jitter);
        ctx!.beginPath();
        ctx!.rect(-w / 2, -h / 2, w, h);
        ctx!.clip();
        // papel de fundo da tira (aparece onde a foto não alcança)
        ctx!.fillStyle = s.tint;
        ctx!.fillRect(-w / 2, -h / 2, w, h);
        // a foto inteira, alinhada ao retrato, vista pela janela da tira
        ctx!.drawImage(
          img,
          boxX + s.shift * boxW - (x + w / 2),
          -(y + h / 2),
          boxW,
          cssH
        );
        ctx!.globalCompositeOperation = "multiply";
        ctx!.fillStyle = s.tint;
        ctx!.fillRect(-w / 2, -h / 2, w, h);
        ctx!.globalCompositeOperation = "source-over";
        ctx!.restore();
      }

      if (paper) {
        const x = boxX + paper.x0 * boxW;
        const w = (paper.x1 - paper.x0) * boxW;
        const y = paper.y * cssH;
        const h = paper.h * cssH;
        const tear = boxW * 0.012;
        // duas folhas sobrepostas, a de trás mais escura e um pouco fora
        for (const layer of [1, 0]) {
          ctx!.save();
          ctx!.translate(
            x + w / 2 + rand(-1.4, 1.4) * jitter + layer * w * 0.03,
            y + h / 2 + rand(-1.2, 1.2) * jitter - layer * h * 0.22
          );
          ctx!.rotate(paper.rot + rand(-0.007, 0.007) * jitter + layer * 0.02);
          ctx!.beginPath();
          const n = paper.left.length;
          ctx!.moveTo(-w / 2 + paper.left[0] * tear, -h / 2);
          ctx!.lineTo(w / 2 + paper.right[0] * tear, -h / 2);
          for (let i = 1; i < n; i++) {
            ctx!.lineTo(w / 2 + paper.right[i] * tear, -h / 2 + (h * i) / (n - 1));
          }
          for (let i = n - 1; i >= 0; i--) {
            ctx!.lineTo(-w / 2 + paper.left[i] * tear, -h / 2 + (h * i) / (n - 1));
          }
          ctx!.closePath();
          ctx!.fillStyle = layer === 1 ? "#c4161c" : "#e2231a";
          ctx!.fill();
          ctx!.clip();
          const pattern = ctx!.createPattern(grain, "repeat");
          if (pattern) {
            ctx!.globalCompositeOperation = "multiply";
            ctx!.globalAlpha = 0.28;
            ctx!.fillStyle = pattern;
            ctx!.fillRect(-w, -h, w * 2, h * 2);
          }
          ctx!.restore();
        }
      }
    }

    function step() {
      if (disposed || !visible) return;
      tick++;
      if (queue.length > 0) {
        // refazendo: uma peça por quadro, como mãos pousando papel
        if (tick % 2 === 0) {
          const next = queue.shift()!;
          if ("pose" in next) strips.push(next);
          else paper = next;
        }
      } else if (tick % RESHUFFLE_EVERY === 0) {
        reshuffle();
      } else if (tick % SWAP_EVERY === 0 && strips.length > 0) {
        const i = Math.floor(Math.random() * strips.length);
        const band = BANDS.findIndex(
          ([y]) => Math.abs(y - strips[i].y) < 0.03
        );
        strips[i] = makeStrip(band < 0 ? i % BANDS.length : band, randomPose(strips[i].pose));
      }
      draw();
    }

    function start() {
      if (reduced || timer) return;
      timer = setInterval(step, TICK_MS);
    }

    function stop() {
      clearInterval(timer);
      timer = undefined;
    }

    function onClick() {
      reshuffle();
      draw();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const viewObserver = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible) start();
      else stop();
    });
    viewObserver.observe(canvas);

    // o canvas não recebe o ponteiro (o retrato em traço, por baixo, usa o
    // cursor para escolher a pose); o clique é ouvido no contêiner dos dois
    const host = canvas.parentElement;
    host?.addEventListener("click", onClick);

    fotos.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      img
        .decode()
        .then(() => {
          if (disposed) return;
          images[i] = img;
          // primeira colagem assim que houver ao menos três fotos
          if (strips.length === 0 && queue.length === 0 && loadedPoses().length >= 3) {
            reshuffle();
            draw();
            start();
          }
        })
        .catch(() => {});
    });

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      host?.removeEventListener("click", onClick);
    };
    // a lista chega recriada a cada render do servidor; o que importa são os endereços
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fotos.join("|")]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
