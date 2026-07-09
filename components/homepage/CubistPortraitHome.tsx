"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { garamond, plexMono } from "@/lib/fonts";
import {
  DEFENSES,
  GLYPHS,
  INITIAL_PIECES,
  KEY_MOVE,
  MATE_MOVES,
  MSG_INITIAL,
  MSG_KEY_MOVE_PLAYED,
  MSG_WRONG_STAGE1,
  MSG_WRONG_STAGE2,
  pickDefense,
  squareIsDark,
  FILES,
  type Pieces,
  type Square,
} from "@/lib/chessPuzzle";
import {
  STAGE_CENTER_X,
  STAGE_CENTER_Y,
  STAGE_H,
  STAGE_W,
  TILES,
} from "@/lib/cubistTiles";
import { RhizomeGraph } from "@/components/RhizomeGraph";
import { CubistCornerNav } from "@/components/CubistCornerNav";
import { CubistConceptPanel } from "@/components/homepage/CubistConceptPanel";
import type { GraphPalette } from "@/components/ConceptNode";
import type { ConceptNode, ContentObject } from "@/types";
import type { ConceptLink } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";

const SOLVED_KEY = "cicloAfroRizomaSolved"; // nome herdado do protótipo, guarda só o estado do puzzle

type Phase = "closed" | "chess" | "rhizome";

/**
 * Homepage "Acervo" (opção 7a do handoff) — retrato cubista interativo →
 * Problema 10 de Machado de Assis → rizoma de temas. Ver
 * design_handoff_homepage_acervo/README.md para a especificação completa.
 *
 * Tela única, sem chrome do site (sem header/footer) — só os links
 * "acervo"/"contato" no canto, que funcionam sempre, independente do puzzle.
 *
 * Ato 3 (rizoma) reusa o RhizomeGraph real do site — mesmos dados de
 * concepts/links, mesma física de d3-force — só com uma paleta própria
 * (ver cubistPalette) para casar com a identidade visual desta página.
 */
export function CubistPortraitHome({
  concepts,
  links,
  objects,
}: {
  concepts: ConceptNode[];
  links: ConceptLink[];
  objects: ContentObject[];
}) {
  const selectedConceptId = useAppStore((s) => s.selectedConceptId);
  const [scale, setScale] = useState(1);
  const [phase, setPhase] = useState<Phase>("closed");
  const [solved, setSolved] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const [stage, setStage] = useState<1 | 2>(1);
  const [pieces, setPieces] = useState<Pieces>(INITIAL_PIECES);
  const [sel, setSel] = useState<Square | null>(null);
  const [msg, setMsg] = useState(MSG_INITIAL);
  const [mateWith, setMateWith] = useState<"K" | "Q" | null>(null);
  const [defenseNotation, setDefenseNotation] = useState<string | null>(null);

  const [nodeFont, setNodeFont] = useState("Inter, system-ui, sans-serif");

  const stageRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closeTimerRef = useRef<number | null>(null);

  // escala "cover": a peça de 1280x800 preenche o viewport inteiro, sem barras
  useEffect(() => {
    function updateScale() {
      setScale(Math.max(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    try {
      if (sessionStorage.getItem(SOLVED_KEY) === "1") setSolved(true);
    } catch {
      // sessionStorage indisponível (modo privado etc.) — sem persistência, sem problema
    }
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  // o canvas do rizoma não lê a var CSS --font-plex-mono do next/font
  // diretamente — resolve o nome real da fonte carregada uma vez, no mount
  useEffect(() => {
    if (!stageRef.current) return;
    const resolved = getComputedStyle(stageRef.current)
      .getPropertyValue("--font-plex-mono")
      .trim();
    if (resolved) setNodeFont(resolved);
  }, []);

  // paleta do rizoma real casada com a identidade visual desta página
  // (ao invés do claro/escuro do ThemeToggle, que não se aplica aqui)
  const cubistPalette: GraphPalette = useMemo(
    () => ({
      paper: "#a9a7a2",
      ink: "#22201d",
      accent: "#8c2f1f",
      muted: "rgba(34, 32, 29, 0.5)",
      line: "#8e8b86",
      lineDim: "rgba(34, 32, 29, 0.08)",
      nodeFont,
    }),
    [nodeFont]
  );

  // --- Ato 1: repulsão dos fragmentos por proximidade do cursor ---
  const applyScatter = useCallback(
    (localX: number, localY: number) => {
      TILES.forEach((tile, i) => {
        const el = tileRefs.current[i];
        if (!el) return;
        const cx = tile.left + tile.w / 2;
        const cy = tile.top + tile.h / 2;
        const dx = cx - localX;
        const dy = cy - localY;
        const d = Math.sqrt(dx * dx + dy * dy);
        const k = Math.max(0, 1 - d / 320);
        const f = k * k;
        if (f === 0) {
          el.style.transform = "none";
          return;
        }
        const angle = Math.atan2(dy, dx);
        const dist = 95 * f;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        const rot = (tile.rot / 10) * f * 2.5;
        el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
      });
    },
    []
  );

  function handleStageMouseMove(e: React.MouseEvent) {
    if (phase !== "closed" || reducedMotion) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    applyScatter((e.clientX - rect.left) / scale, (e.clientY - rect.top) / scale);
  }

  function handleStageMouseLeave() {
    if (phase !== "closed") return;
    tileRefs.current.forEach((el) => {
      if (el) el.style.transform = "none";
    });
  }

  // --- Ato 2: explosão / remontagem ---
  function explodeTiles() {
    TILES.forEach((tile, i) => {
      const el = tileRefs.current[i];
      if (!el) return;
      const cx = tile.left + tile.w / 2 - STAGE_CENTER_X;
      const cy = tile.top + tile.h / 2 - STAGE_CENTER_Y;
      const mag = Math.sqrt(cx * cx + cy * cy) || 1;
      const dist = reducedMotion ? 0 : 980;
      const tx = (cx / mag) * dist;
      const ty = (cy / mag) * dist;
      const rot = (tile.rot / 10) * 1.6;
      el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
      el.style.opacity = "0";
    });
  }

  function reassembleTiles() {
    TILES.forEach((_, i) => {
      const el = tileRefs.current[i];
      if (!el) return;
      el.style.transform = "none";
      el.style.opacity = "1";
    });
  }

  function resetPuzzle() {
    setStage(1);
    setPieces(INITIAL_PIECES);
    setSel(null);
    setMsg(MSG_INITIAL);
    setMateWith(null);
    setDefenseNotation(null);
  }

  function handleStageClick() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (phase === "closed") {
      explodeTiles();
      if (solved) {
        setPhase("rhizome");
      } else {
        resetPuzzle();
        setPhase("chess");
      }
    } else {
      // clique no fundo cinza fora do tabuleiro/nós: fecha tudo
      reassembleTiles();
      setPhase("closed");
    }
  }

  // --- Ato 2: máquina de estados do xadrez ---
  function handleCellClick(square: Square, e: React.MouseEvent) {
    e.stopPropagation();
    const piece = pieces[square];

    if (sel === square) {
      setSel(null);
      return;
    }
    if (piece && piece.color === "w") {
      setSel(square);
      return;
    }
    if (!sel) return; // clique numa casa vazia/preta sem seleção prévia: nada acontece

    if (stage === 1) {
      if (sel === KEY_MOVE.from && square === KEY_MOVE.to) {
        const next = { ...pieces };
        delete next[KEY_MOVE.from];
        next[KEY_MOVE.to] = { type: "B", color: "w" };
        setPieces(next);
        setSel(null);
        setMsg(MSG_KEY_MOVE_PLAYED);
        window.setTimeout(() => {
          const defense = pickDefense();
          setPieces((prev) => {
            const withDefense = { ...prev };
            const moving = withDefense[defense.from];
            delete withDefense[defense.from];
            if (moving) withDefense[defense.to] = moving;
            return withDefense;
          });
          setMateWith(defense.mateWith);
          setDefenseNotation(defense.notation);
          setMsg(`${defense.notation} — agora dê o mate.`);
          setStage(2);
        }, 1000);
      } else {
        setMsg(MSG_WRONG_STAGE1);
        setSel(null);
      }
      return;
    }

    // stage 2
    if (mateWith && sel === MATE_MOVES[mateWith].from && square === MATE_MOVES[mateWith].to) {
      const move = MATE_MOVES[mateWith];
      const next = { ...pieces };
      const moving = next[move.from];
      delete next[move.from];
      if (moving) next[move.to] = moving;
      setPieces(next);
      setSel(null);
      setMsg(move.msg);
      setSolved(true);
      try {
        sessionStorage.setItem(SOLVED_KEY, "1");
      } catch {
        // sem persistência disponível — tudo bem, só não sobrevive a um reload
      }
      closeTimerRef.current = window.setTimeout(() => {
        setPhase("rhizome");
      }, 1600);
    } else {
      setMsg(MSG_WRONG_STAGE2);
      setSel(null);
    }
  }

  const cells = useMemo(() => {
    const list: { square: Square; file: number; rank: number }[] = [];
    for (let rank = 8; rank >= 1; rank--) {
      for (let file = 0; file < 8; file++) {
        list.push({ square: `${FILES[file]}${rank}`, file, rank });
      }
    }
    return list;
  }, []);

  return (
    <div
      className={`${garamond.variable} ${plexMono.variable}`}
      style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#a9a7a2" }}
    >
      {/* visualmente oculto, para SEO/leitores de tela */}
      <h1
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          margin: -1,
          padding: 0,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Marcos Ramos
      </h1>

      {/* fora do palco escalado, para sempre ficar fixa no topo da
          viewport, independente do tamanho da tela ou do estado do puzzle */}
      <CubistCornerNav />

      <div
        ref={stageRef}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
        onClick={handleStageClick}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: STAGE_W,
          height: STAGE_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          color: "#22201d",
          fontFamily: "var(--font-garamond), Georgia, serif",
          cursor: phase === "closed" ? "crosshair" : "default",
        }}
      >
        {/* Ato 1: retrato cubista */}
        {TILES.map((tile, i) => (
          <div
            key={i}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              left: tile.left,
              top: tile.top,
              width: tile.w,
              height: tile.h,
              backgroundImage: "url('/marcos-cubist-portrait.png')",
              backgroundSize: `${tile.bgSize}px ${tile.bgSize}px`,
              backgroundPosition: `${tile.bgX}px ${tile.bgY}px`,
              filter: "grayscale(1) contrast(1.07)",
              outline: "1px solid #f5f2eb",
              transition: reducedMotion
                ? "opacity .3s ease"
                : "transform .35s ease-out, opacity .7s ease .1s",
              zIndex: tile.z,
            }}
          />
        ))}

        {/* Ato 2: Problema 10 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            opacity: phase === "chess" ? 1 : 0,
            pointerEvents: phase === "chess" ? "auto" : "none",
            transition: "opacity .6s ease .3s",
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            userSelect: "none",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-plex-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.14em",
              color: "#22201d",
              textAlign: "center",
            }}
          >
            PROBLEMA 10 — POR MACHADO DE ASSIS
            <br />
            <span style={{ color: "#4a4843" }}>ILUSTRAÇÃO BRASILEIRA, 1877</span>
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 54px)",
              gridTemplateRows: "repeat(8, 54px)",
              outline: "1px solid #55524d",
            }}
          >
            {cells.map(({ square, file, rank }) => {
              const piece = pieces[square];
              const dark = squareIsDark(file, rank);
              const isSel = sel === square;
              return (
                <div
                  key={square}
                  onClick={(e) => handleCellClick(square, e)}
                  style={{
                    width: 54,
                    height: 54,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "serif",
                    fontSize: 36,
                    lineHeight: 1,
                    cursor: "pointer",
                    background: dark ? "#918e88" : "#bab7b1",
                    color: piece?.color === "w" ? "#f6f3ec" : "#1d1b18",
                    boxShadow: isSel ? "inset 0 0 0 2px #8c2f1f" : "none",
                    textShadow:
                      piece?.color === "w" ? "0 0 2px rgba(0,0,0,.3)" : "none",
                  }}
                >
                  {piece ? GLYPHS[piece.type] : ""}
                </div>
              );
            })}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-plex-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "#3a3833",
              maxWidth: 440,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            {msg}
          </p>
        </div>

        {/* Ato 3: rizoma real do acervo (mesmos dados/física de /acervo) —
            clique num nó abre ao lado a lista de textos daquele conceito,
            igual à home antiga (ObjectPreviewPanel) */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            inset: 0,
            opacity: phase === "rhizome" ? 1 : 0,
            pointerEvents: phase === "rhizome" ? "auto" : "none",
            transition: "opacity .7s ease .25s",
            zIndex: 5,
            display: "flex",
          }}
        >
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            {phase === "rhizome" && (
              <RhizomeGraph
                concepts={concepts}
                links={links}
                matchedObjectIds={null}
                palette={cubistPalette}
                centerOffsetX={0}
                zoomPadding={170}
                chargeStrength={-420}
              />
            )}
          </div>
          {selectedConceptId && (
            <div
              style={{
                flex: "0 0 340px",
                paddingTop: 88,
                paddingRight: 44,
                paddingBottom: 32,
              }}
            >
              <CubistConceptPanel concepts={concepts} objects={objects} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
