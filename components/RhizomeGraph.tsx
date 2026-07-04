"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { forceCollide } from "d3-force";
import type { ConceptNode as ConceptNodeType } from "@/types";
import type { ConceptLink } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";
import {
  drawConceptNode,
  nodeRadius,
  GRAPH_PALETTES,
  type GraphNodeDatum,
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
}

/**
 * Grafo de força dos conceitos (modo Explorar).
 * — tamanho do nó ∝ nº de objetos conectados
 * — hover destaca a vizinhança imediata
 * — clique seleciona o conceito e abre o ObjectPreviewPanel
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
}: RhizomeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const zoomFitsRef = useRef(0);
  // true assim que o usuário mexe manualmente no zoom/pan/arrasta um nó —
  // depois disso, nunca mais reenquadramos automaticamente por cima dele.
  const userInteractedRef = useRef(false);
  // Ignora onZoom disparados por nós programaticamente (zoomToFit anima
  // por 500ms, cada frame dispara onZoom). Começa em Infinity, não 0: a
  // própria lib dispara um onZoom inicial no mount, antes do primeiro
  // fitGraph() rodar — com 0 aqui, esse evento batia a checagem
  // `Date.now() > programmaticZoomUntilRef.current` e marcava
  // userInteractedRef como true permanentemente antes mesmo do primeiro
  // enquadramento automático acontecer.
  const programmaticZoomUntilRef = useRef(Infinity);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const fitGraph = useCallback(() => {
    if (userInteractedRef.current || !fgRef.current) return;
    programmaticZoomUntilRef.current = Date.now() + 650;
    // padding generoso (não só 56): zoomToFit enquadra pelo raio dos nós,
    // sem contar a largura do rótulo de texto ao lado — com pouco padding,
    // rótulos de nós na borda (ex. "tecnologia e imaginação") cortam.
    fgRef.current.zoomToFit(500, 96);
    // zoomToFit centraliza o conjunto de nós no contêiner inteiro — como o
    // retrato (PortraitPhoto) fica atrás, ancorado à esquerda, sem esse
    // deslocamento o grafo tende a sobrar todo à direita, sem passar por
    // cima da foto. Depois do fit assentar, desloca a câmera um pouco
    // para a direita (o conteúdo aparece deslocado para a esquerda),
    // avançando sobre a área do retrato — moderado, para não ficar
    // "aberto" demais sobre a foto.
    window.setTimeout(() => {
      if (userInteractedRef.current || !fgRef.current) return;
      const center = fgRef.current.centerAt();
      const k = fgRef.current.zoom();
      programmaticZoomUntilRef.current = Date.now() + 450;
      fgRef.current.centerAt(center.x + 90 / k, center.y, 400);
    }, 520);
  }, []);

  const selectedConceptId = useAppStore((s) => s.selectedConceptId);
  const setSelectedConceptId = useAppStore((s) => s.setSelectedConceptId);
  const theme = useAppStore((s) => s.theme);
  const palette = GRAPH_PALETTES[theme];

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
  const handleFgRef = useCallback((fg: any) => {
    fgRef.current = fg;
    if (!fg) return;
    fg.d3Force("charge")?.strength(-260);
    fg.d3Force("link")?.distance(70);
    // colisão evita que círculos cubram os rótulos dos vizinhos
    fg.d3Force(
      "collide",
      forceCollide((node: any) => nodeRadius(node.val) + 14)
    );
  }, []);

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
      {size.width > 0 && (
        <ForceGraph2D
          fgRef={handleFgRef}
          width={size.width}
          height={size.height}
          graphData={graphData}
          // transparente: o retrato (PortraitPhoto) fica atrás, no mesmo
          // contêiner — se o canvas pintasse um fundo sólido aqui, cobriria
          // a foto inteira em vez de deixá-la aparecer por trás do grafo.
          backgroundColor="rgba(0,0,0,0)"
          nodeCanvasObject={paintNode}
          nodePointerAreaPaint={(
            node: any,
            color: string,
            ctx: CanvasRenderingContext2D
          ) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeRadius(node.val) + 4, 0, 2 * Math.PI);
            ctx.fill();
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
            // ignora os eventos disparados pelo nosso próprio zoomToFit —
            // só marca como "interação do usuário" fora dessa janela
            if (Date.now() > programmaticZoomUntilRef.current) {
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
        <div className="pointer-events-none absolute bottom-3 left-3 max-w-xs border border-line bg-paper px-3 py-2 text-xs text-muted">
          {concepts.find((c) => c.id === hoveredId)?.description}
        </div>
      )}
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
