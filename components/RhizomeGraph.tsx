"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { forceCollide } from "d3-force";
import type { ConceptNode as ConceptNodeType } from "@/types";
import type { ConceptLink } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";
import {
  drawConceptNode,
  nodeChipSize,
  GRAPH_PALETTE,
  type GraphNodeDatum,
  type GraphPalette,
} from "./ConceptNode";

// O grafo desenha em <canvas> e depende de window — só carrega no cliente.
// next/dynamic não encaminha refs, então o wrapper recebe o ref via prop
// comum (fgRef) e o repassa ao componente real.
const ForceGraph2D = dynamic(
  () =>
    import("react-force-graph-2d").then((mod) => {
      const FG = mod.default;
      function ForceGraphWithRef({ fgRef, ...props }: any) {
        return <FG ref={fgRef} {...props} />;
      }
      return ForceGraphWithRef;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-muted">
        tecendo o grafo…
      </div>
    ),
  }
);

interface RhizomeGraphProps {
  concepts: ConceptNodeType[];
  links: ConceptLink[];
  /** null = sem busca ativa; Set = ids de objetos que casam com a busca */
  matchedObjectIds: Set<string> | null;
  /** sobrepõe a paleta padrão do grafo (GRAPH_PALETTE), se algum
   * contexto precisar de cores diferentes das do site */
  palette?: GraphPalette;
  /** padding (px) do zoomToFit — quanto maior, mais "aberto"/afastado o
   * grafo aparece. Default 96 (valor histórico da home antiga). */
  zoomPadding?: number;
  /** deslocamento horizontal (px, em espaço de tela) aplicado após o fit —
   * herdado da home antiga, onde o retrato ficava ancorado à esquerda e o
   * grafo precisava se afastar dele. Default 110; passe 0 para centralizar
   * de verdade (não há mais retrato por baixo no novo layout). */
  centerOffsetX?: number;
  /** força de repulsão entre nós — mais negativo = mais espalhado.
   * Default -260 (valor histórico da home antiga). */
  chargeStrength?: number;
  /** distância de repouso dos links — quanto maior, mais os nós
   * conectados se afastam uns dos outros. Default 70. */
  linkDistance?: number;
}

/**
 * Grafo de força dos conceitos (modo Explorar).
 * — tamanho do nó ∝ nº de objetos conectados
 * — hover destaca a vizinhança imediata
 * — clique seleciona o conceito e abre o painel lateral (ConceptPanel)
 * — busca ativa reduz a opacidade dos nós não relacionados aos resultados
 *
 * Caso o layout de força padrão fique genérico, é aqui que entraria um
 * layout customizado: via ref é possível trocar/ajustar as forças do
 * d3-force (charge, link distance, forças radiais por área temática etc.).
 */
export function RhizomeGraph({
  concepts,
  links,
  matchedObjectIds,
  palette: paletteOverride,
  zoomPadding = 96,
  centerOffsetX = 110,
  chargeStrength = -260,
  linkDistance = 70,
}: RhizomeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const zoomFitsRef = useRef(0);
  // true assim que o usuário mexe manualmente no zoom/pan/arrasta um nó —
  // depois disso, nunca mais reenquadramos automaticamente por cima dele.
  const userInteractedRef = useRef(false);
  // Janela única de graça a partir do mount, cobrindo toda a sequência
  // automática (fits do onEngineStop + a rede de segurança de 2.2s + a
  // animação do deslocamento de câmera dela). Qualquer onZoom disparado
  // pela própria lib dentro dessa janela é ignorado — uma janela por
  // chamada individual (resetada a cada zoomToFit) deixava um intervalo
  // entre elas onde um onZoom real ou espúrio marcava userInteractedRef
  // como true cedo demais, cancelando a rede de segurança antes dela
  // rodar (ela só dispara aos 2.2s, então precisa estar coberta até lá).
  const mountTimeRef = useRef(Date.now());
  const AUTO_FIT_GRACE_MS = 3600;
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // O grafo só fica visível depois que a sequência automática de
  // enquadramento (onEngineStop + rede de segurança + o deslocamento de
  // câmera) já terminou — assim ele aparece direto no lugar final, sem
  // o usuário ver o "pulo" de um enquadramento para o outro. A física e
  // os timers de fitGraph continuam rodando normalmente por baixo
  // (opacity não pausa nada), só a exibição é adiada.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(true), AUTO_FIT_GRACE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const fitGraph = useCallback(() => {
    if (userInteractedRef.current || !fgRef.current) return;
    // padding generoso (não só 56): zoomToFit enquadra pelo raio dos nós,
    // sem contar a largura do rótulo de texto ao lado — com pouco padding,
    // rótulos de nós na borda (ex. "tecnologia e imaginação") cortam.
    fgRef.current.zoomToFit(500, zoomPadding);
    // zoomToFit centraliza o conjunto de nós no contêiner inteiro; um
    // centerOffsetX diferente de 0 desloca esse centro (histórico de um
    // layout antigo com conteúdo sobreposto) — no layout atual é 0, então
    // este passo é essencialmente um no-op.
    if (centerOffsetX === 0) return;
    window.setTimeout(() => {
      if (userInteractedRef.current || !fgRef.current) return;
      const center = fgRef.current.centerAt();
      const k = fgRef.current.zoom();
      fgRef.current.centerAt(center.x - centerOffsetX / k, center.y, 400);
    }, 520);
  }, [zoomPadding, centerOffsetX]);

  const selectedConceptId = useAppStore((s) => s.selectedConceptId);
  const setSelectedConceptId = useAppStore((s) => s.setSelectedConceptId);
  const palette = paletteOverride ?? GRAPH_PALETTE;

  // o canvas precisa de dimensões explícitas — medimos o contêiner
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Rede de segurança: onEngineStop pode disparar antes de a força de
  // colisão (aplicada de forma assíncrona em handleFgRef) convergir de
  // verdade, deixando um zoomToFit prematuro — nós ficam sobrepostos até
  // um reload. cooldownTicks=120 a ~60fps roda por ~2s; reenquadramos
  // mais uma vez depois disso, quando a física já assentou de verdade.
  useEffect(() => {
    if (size.width === 0) return;
    const timer = window.setTimeout(fitGraph, 2200);
    return () => window.clearTimeout(timer);
  }, [size.width, fitGraph]);

  // ajuste fino das forças para o layout respirar (menos "bola de pelo");
  // callback ref porque o componente carrega de forma assíncrona (dynamic)
  const handleFgRef = useCallback(
    (fg: any) => {
      fgRef.current = fg;
      if (!fg) return;
      fg.d3Force("charge")?.strength(chargeStrength);
      fg.d3Force("link")?.distance(linkDistance);
      // colisão evita que os chips cubram os rótulos dos vizinhos
      fg.d3Force(
        "collide",
        forceCollide((node: any) => {
          const { width, height } = nodeChipSize(node.label, node.val);
          return Math.max(width, height) / 2 + 10;
        })
      );
    },
    [chargeStrength, linkDistance]
  );

  const graphData = useMemo(
    () => ({
      nodes: concepts.map<GraphNodeDatum>((c) => ({
        id: c.id,
        label: c.label,
        description: c.description,
        val: c.objectIds.length,
      })),
      // clonar: a lib muta os links (source/target viram objetos-nó)
      links: links.map((l) => ({ ...l })),
    }),
    [concepts, links]
  );

  // adjacência (a partir dos links originais, imutáveis) para o hover
  const neighbors = useMemo(() => {
    const map = new Map<string, Set<string>>();
    concepts.forEach((c) => map.set(c.id, new Set([c.id])));
    links.forEach((l) => {
      map.get(l.source)?.add(l.target);
      map.get(l.target)?.add(l.source);
    });
    return map;
  }, [concepts, links]);

  // conceitos relacionados a pelo menos um objeto que casa com a busca
  const activeConceptIds = useMemo(() => {
    if (!matchedObjectIds) return null;
    return new Set(
      concepts
        .filter((c) => c.objectIds.some((id) => matchedObjectIds.has(id)))
        .map((c) => c.id)
    );
  }, [concepts, matchedObjectIds]);

  const neighborIds = hoveredId
    ? neighbors.get(hoveredId) ?? new Set<string>()
    : new Set<string>();

  const paintNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      drawConceptNode(node, ctx, globalScale, {
        hoveredId,
        selectedId: selectedConceptId,
        neighborIds,
        activeConceptIds,
        palette,
      });
    },
    // neighborIds deriva de hoveredId; não precisa entrar nas deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hoveredId, selectedConceptId, activeConceptIds, palette]
  );

  return (
    <div
      ref={containerRef}
      className="relative z-10 h-full w-full"
      aria-label="Grafo de conceitos"
    >
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: settled ? 1 : 0,
          // grade pontilhada sutil atrás do grafo em vez de vazio liso
          backgroundImage: `radial-gradient(${palette.lineDim} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
      {size.width > 0 && (
        <ForceGraph2D
          fgRef={handleFgRef}
          width={size.width}
          height={size.height}
          graphData={graphData}
          // transparente: a grade pontilhada de fundo (ver acima) precisa
          // aparecer por trás do canvas
          backgroundColor="rgba(0,0,0,0)"
          nodeCanvasObject={paintNode}
          nodePointerAreaPaint={(
            node: any,
            color: string,
            ctx: CanvasRenderingContext2D
          ) => {
            const { width, height } = nodeChipSize(node.label, node.val);
            ctx.fillStyle = color;
            ctx.fillRect(node.x - width / 2, node.y - height / 2, width, height);
          }}
          linkColor={(link: any) => {
            const s =
              typeof link.source === "object" ? link.source.id : link.source;
            const t =
              typeof link.target === "object" ? link.target.id : link.target;
            const inHover =
              !hoveredId || (neighborIds.has(s) && neighborIds.has(t));
            const inSearch =
              !activeConceptIds ||
              (activeConceptIds.has(s) && activeConceptIds.has(t));
            return inHover && inSearch ? palette.line : palette.lineDim;
          }}
          linkLineDash={[3, 2]}
          linkWidth={(link: any) => Math.min(link.weight, 3)}
          onNodeHover={(node: any) => setHoveredId(node ? node.id : null)}
          onNodeClick={(node: any) =>
            setSelectedConceptId(
              node.id === selectedConceptId ? null : node.id
            )
          }
          onBackgroundClick={() => setSelectedConceptId(null)}
          onEngineStop={() => {
            // enquadra o grafo inteiro nas primeiras estabilizações;
            // depois deixa o zoom/pan do usuário em paz (fitGraph já
            // verifica userInteractedRef antes de mexer na câmera)
            if (zoomFitsRef.current < 2) {
              fitGraph();
              zoomFitsRef.current += 1;
            }
          }}
          onZoom={() => {
            // ignora os eventos disparados pela sequência automática (fits
            // do onEngineStop + rede de segurança) — só conta como
            // interação do usuário depois que essa janela de graça passa
            if (Date.now() - mountTimeRef.current > AUTO_FIT_GRACE_MS) {
              userInteractedRef.current = true;
            }
          }}
          onNodeDrag={() => {
            userInteractedRef.current = true;
          }}
          cooldownTicks={120}
          d3VelocityDecay={0.3}
          enableNodeDrag
        />
      )}
      {/* tooltip do conceito em hover */}
      {hoveredId && (
        <div className="pointer-events-none absolute bottom-3 right-3 max-w-xs border border-line bg-paper px-3 py-2 text-xs text-muted">
          {concepts.find((c) => c.id === hoveredId)?.description}
        </div>
      )}
      </div>
      {/*
        Os nós do grafo são desenhados em <canvas> — não existe elemento
        de DOM para focar por teclado. Estes botões dão o mesmo poder de
        seleção (Tab + Enter) sem poluir o visual: ficam invisíveis até
        receberem foco, e então aparecem no canto, um de cada vez, como
        um "skip link" — o rótulo eventualmente visível é sempre o do nó
        focado no momento.
      */}
      {concepts.map((c) => (
        <button
          key={c.id}
          type="button"
          aria-pressed={selectedConceptId === c.id}
          title={c.description}
          onClick={() =>
            setSelectedConceptId(selectedConceptId === c.id ? null : c.id)
          }
          className="absolute w-px h-px -m-px overflow-hidden whitespace-nowrap [clip:rect(0,0,0,0)] focus:w-auto focus:h-auto focus:m-0 focus:overflow-visible focus:whitespace-normal focus:[clip:auto] focus:fixed focus:z-50 focus:top-4 focus:left-4 focus:rounded-full focus:border focus:border-accent focus:bg-paper focus:px-3.5 focus:py-1.5 focus:text-sm focus:text-ink"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
