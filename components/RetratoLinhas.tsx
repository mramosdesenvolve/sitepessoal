"use client";

import { useEffect, useRef } from "react";

interface RetratoLinhasProps {
  /** mapas de tom das poses (PNG cinza + alfa, todos do mesmo tamanho) */
  poses: string[];
  alt: string;
  className?: string;
}

interface ToneMap {
  w: number;
  h: number;
  /** espessura relativa por pixel, 0–1, já multiplicada pelo recorte */
  t: Float32Array;
  /** a mesma, com o tom invertido — no tema escuro a tinta é clara, e sem
   * inverter o retrato sairia em negativo */
  tInv: Float32Array;
}

const LINES = 118; // linhas na altura do retrato — o passo é fixo
const T_MIN = 0.1; // espessura mínima, em fração do passo (o "fio")
const T_MAX = 0.94; // máxima: quase encosta na linha vizinha (o "sólido")
const GAMMA = 1.35;
const HOLD_MS = 4200;
const MORPH_MS = 1100;
const SCRUB_MS = 420;
const INTRO_MS = 1500;

function easeOut(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

async function loadToneMap(src: string): Promise<ToneMap> {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("canvas 2d indisponível");
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, w, h);
  const t = new Float32Array(w * h);
  const tInv = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const alpha = data[i * 4 + 3] / 255;
    const dark = data[i * 4] / 255;
    t[i] = alpha * (T_MIN + (T_MAX - T_MIN) * Math.pow(dark, GAMMA));
    tInv[i] = alpha * (T_MIN + (T_MAX - T_MIN) * Math.pow(1 - dark, GAMMA));
  }
  return { w, h, t, tInv };
}

/**
 * Retrato em traço: a fotografia vira linhas horizontais de passo fixo cuja
 * espessura acompanha o tom — do fio ao sólido, uma cor só, o mesmo motivo
 * de listras do sistema. Há uma sequência de poses; as linhas se refazem de
 * cima para baixo ao trocar. Sozinho, o retrato passa de pose a cada poucos
 * segundos; com o cursor por cima, a posição horizontal escolhe a pose
 * (no toque, cada toque avança uma).
 */
export function RetratoLinhas({ poses, alt, className }: RetratoLinhasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maps: (ToneMap | undefined)[] = new Array(poses.length).fill(undefined);

    let disposed = false;
    let visible = true;
    let hovering = false;
    let frame = 0;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;

    let from = 0; // pose de onde se sai
    let to = 0; // pose para onde se vai
    let morphStart = 0;
    let morphDur = MORPH_MS;
    let morphing = false;
    let introStart = 0;
    let introDone = reduced;

    let cssW = 0;
    let cssH = 0;
    let ink = "#0b0b0b";
    let inverted = false;

    function readInk() {
      ink = getComputedStyle(canvas!).getPropertyValue("--fg-1").trim() || "#0b0b0b";
      inverted = document.documentElement.dataset.theme === "dark";
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = rect.width;
      cssH = rect.height;
      canvas!.width = Math.round(cssW * dpr);
      canvas!.height = Math.round(cssH * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    }

    function draw(now: number) {
      const a = maps[from];
      const b = maps[to] ?? a;
      ctx!.clearRect(0, 0, cssW, cssH);
      if (!a || !b || cssW === 0) return;
      const ta = inverted ? a.tInv : a.t;
      const tb = inverted ? b.tInv : b.t;

      const p = morphing ? Math.min((now - morphStart) / morphDur, 1) : 1;
      const intro = introDone ? 1 : Math.min((now - introStart) / INTRO_MS, 1);
      const pitch = cssH / LINES;
      const sx = cssW / a.w;
      // a troca e a entrada varrem o retrato de cima para baixo
      const SPREAD = 0.6;

      ctx!.fillStyle = ink;
      ctx!.beginPath();
      for (let line = 0; line < LINES; line++) {
        const frac = line / (LINES - 1);
        const y = (line + 0.5) * pitch;
        const row = Math.min(a.h - 1, Math.floor(((line + 0.5) / LINES) * a.h)) * a.w;
        const mix = easeOut(
          Math.min(Math.max(p * (1 + SPREAD) - frac * SPREAD, 0), 1)
        );
        const reveal =
          easeOut(Math.min(Math.max(intro * (1 + SPREAD) - frac * SPREAD, 0), 1)) * a.w;

        let runStart = -1;
        const end = Math.min(a.w, Math.ceil(reveal));
        for (let x = 0; x <= end; x++) {
          const t =
            x < end ? ta[row + x] + (tb[row + x] - ta[row + x]) * mix : 0;
          if (t > 0.012 && runStart < 0) runStart = x;
          if ((t <= 0.012 || x === end) && runStart >= 0) {
            // um trecho contínuo: borda de cima na ida, de baixo na volta
            for (let k = runStart; k < x; k++) {
              const tk = ta[row + k] + (tb[row + k] - ta[row + k]) * mix;
              const px = (k + 0.5) * sx;
              const py = y - (tk * pitch) / 2;
              if (k === runStart) ctx!.moveTo(px, py);
              else ctx!.lineTo(px, py);
            }
            for (let k = x - 1; k >= runStart; k--) {
              const tk = ta[row + k] + (tb[row + k] - ta[row + k]) * mix;
              ctx!.lineTo((k + 0.5) * sx, y + (tk * pitch) / 2);
            }
            ctx!.closePath();
            runStart = -1;
          }
        }
      }
      ctx!.fill();

      if (intro >= 1) introDone = true;
      if (morphing && p >= 1) {
        morphing = false;
        from = to;
        scheduleNext();
      }
    }

    function loop(now: number) {
      frame = 0;
      if (disposed) return;
      draw(now);
      if (morphing || !introDone) frame = requestAnimationFrame(loop);
    }

    function kick() {
      if (!frame && visible) frame = requestAnimationFrame(loop);
    }

    function goTo(index: number, duration: number) {
      if (!maps[index] || index === to) return;
      if (reduced) {
        from = to = index;
        draw(performance.now());
        return;
      }
      // se uma troca estava no meio, parte da pose mais próxima
      if (morphing && (performance.now() - morphStart) / morphDur > 0.5) from = to;
      to = index;
      morphStart = performance.now();
      morphDur = duration;
      morphing = true;
      kick();
    }

    function scheduleNext() {
      clearTimeout(holdTimer);
      if (reduced || hovering || !visible) return;
      holdTimer = setTimeout(() => {
        const loaded = maps.map((m, i) => (m ? i : -1)).filter((i) => i >= 0);
        if (loaded.length < 2) return scheduleNext();
        const next = loaded[(loaded.indexOf(to) + 1) % loaded.length];
        goTo(next, MORPH_MS);
      }, HOLD_MS);
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      hovering = true;
      clearTimeout(holdTimer);
      const rect = canvas!.getBoundingClientRect();
      const frac = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 0.999);
      goTo(Math.floor(frac * poses.length), SCRUB_MS);
    }

    function onPointerLeave() {
      hovering = false;
      scheduleNext();
    }

    function onClick() {
      if (window.matchMedia("(hover: hover)").matches) return;
      goTo((to + 1) % poses.length, SCRUB_MS);
      scheduleNext();
    }

    readInk();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      readInk();
      draw(performance.now());
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const viewObserver = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible) {
        kick();
        if (!morphing) scheduleNext();
      } else {
        clearTimeout(holdTimer);
      }
    });
    viewObserver.observe(canvas);

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("click", onClick);

    // a primeira pose entra já; as outras carregam em seguida, sem pressa
    loadToneMap(poses[0])
      .then((first) => {
        if (disposed) return;
        maps[0] = first;
        introStart = performance.now();
        kick();
        draw(performance.now());
        scheduleNext();
        return Promise.all(
          poses.slice(1).map((src, i) =>
            loadToneMap(src).then((m) => {
              maps[i + 1] = m;
            })
          )
        );
      })
      .catch(() => {});

    return () => {
      disposed = true;
      clearTimeout(holdTimer);
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      viewObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("click", onClick);
    };
    // a lista chega recriada a cada render do servidor; o que importa são os endereços
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poses.join("|")]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={className}
    />
  );
}
