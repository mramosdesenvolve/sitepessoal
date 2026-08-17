"use client";

import { useEffect, useRef } from "react";

interface DriftNode {
  x: number; // -0.5..0.5, relativo ao centro
  y: number;
  r: number;
  vx: number;
  vy: number;
}

function rgba(triplet: string, alpha: number): string {
  const [r, g, b] = triplet.trim().split(/\s+/).map(Number);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Grafo ambiente decorativo — ecoa /grafo em repouso, sem a física
 * interativa (sem hover/clique/drag): pontos à deriva bem lenta, dentro
 * de uma grade pontilhada. Puramente visual (aria-hidden). Lê as cores
 * do tema "terminal" atual uma vez no mount — esta página ainda não
 * expõe alternância de tema em runtime, então não precisa reagir a isso.
 */
export function AmbientGraph({ nodeCount = 26 }: { nodeCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const style = getComputedStyle(document.documentElement);
    const dotColor = style.getPropertyValue("--term-muted-2") || "61 67 81";
    const lineColor = dotColor;
    const nodeColor = style.getPropertyValue("--term-accent2") || "111 211 184";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    function resize() {
      if (!canvas || !ctx) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const nodes: DriftNode[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      r: 1.4 + Math.random() * 2.6,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: (Math.random() - 0.5) * 0.00018,
    }));

    function project(n: DriftNode) {
      return {
        x: width / 2 + n.x * width * 0.86,
        y: height / 2 + n.y * height * 0.86,
      };
    }

    let raf = 0;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // grade pontilhada de fundo
      ctx.fillStyle = rgba(dotColor, 0.35);
      const step = 22;
      for (let gx = step / 2; gx < width; gx += step) {
        for (let gy = step / 2; gy < height; gy += step) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // arestas entre nós próximos
      ctx.strokeStyle = rgba(lineColor, 0.5);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = project(nodes[i]);
          const b = project(nodes[j]);
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 130) {
            ctx.globalAlpha = 1 - dist / 130;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);

      // nós
      for (const n of nodes) {
        const p = project(n);
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = rgba(nodeColor, 0.55);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba(nodeColor, 0.9);
        ctx.stroke();
      }
    }

    function tick() {
      draw();
      // respeita prefers-reduced-motion de verdade: desenha um quadro
      // estático e não agenda mais nenhum requestAnimationFrame
      if (reduceMotion) return;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x > 0.5 || n.x < -0.5) n.vx *= -1;
        if (n.y > 0.5 || n.y < -0.5) n.vy *= -1;
      }
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [nodeCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
