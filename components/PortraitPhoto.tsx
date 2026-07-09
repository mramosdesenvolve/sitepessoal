"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/** Duração da entrada (ms) — precisa bater com o timer que avisa o HomeClient. */
const ENTRANCE_DURATION_MS = 1500;

/**
 * Retrato atrás do grafo na home — ocupa o mesmo contêiner do
 * RhizomeGraph, mas em camada inferior (z-0, o grafo é z-10 e o canvas
 * tem fundo transparente), então o grafo desenha por cima sem cortar a
 * foto: onde não há nó/linha, a foto aparece; onde há, o grafo cobre.
 * pointer-events-none porque o canvas do grafo, por cima, já responde a
 * todos os cliques/hover — a foto é só camada visual.
 *
 * Fundo recortado (transparente) a partir das duas versões enviadas
 * (fundo preto/branco): como a pose é idêntica nas duas, a diferença
 * pixel a pixel entre elas separa sujeito de fundo com bordas limpas,
 * sem precisar de troca de imagem por tema — ver nota no README.
 *
 * Clique leva a /sobre: a própria foto (z-0) fica pointer-events-none
 * porque o canvas do grafo, por cima (z-10), precisa continuar
 * respondendo a cliques/hover nessa mesma área. Em vez de mexer no
 * z-index da foto (o que também mudaria a ordem visual — o grafo deixaria
 * de desenhar por cima dela), um link transparente e invisível cobre só a
 * área da foto e captura o clique antes do canvas. Ele precisa ser
 * irmão direto da foto (não filho do seu contêiner z-0) — um z-index só
 * vale dentro do próprio contexto de empilhamento do pai; aninhado
 * dentro do z-0 da foto, um z-20 nunca escaparia dele para ficar acima
 * do z-10 do grafo, que é um irmão no nível de cima.
 *
 * "Entrada em cena": como só temos a foto estática (já sentado), a
 * chegada é simulada com uma transição de posição/opacidade a partir de
 * um pouco abaixo e sujeita a leve desfoque — dá a sensação de alguém
 * se acomodando na cadeira sem precisar de vídeo real. Avisa o pai via
 * onEntranceComplete quando a transição termina, para o grafo só
 * aparecer depois.
 */
export function PortraitPhoto({
  onEntranceComplete,
}: {
  onEntranceComplete?: () => void;
}) {
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setArrived(true);
      onEntranceComplete?.();
      return;
    }
    // duas rAF: garante que o navegador pinte o estado inicial (afastado,
    // transparente) antes de aplicar o estado final — senão o CSS aplica
    // os dois estados no mesmo frame e não há transição visível.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setArrived(true));
    });
    const timer = setTimeout(
      () => onEntranceComplete?.(),
      ENTRANCE_DURATION_MS
    );
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só roda uma vez, na montagem
  }, []);

  return (
    <Fragment>
      <div className="absolute z-0 left-0 bottom-0 top-0 w-56 sm:w-64 md:w-72 lg:w-80 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            transform: arrived
              ? "translateY(0) scale(1)"
              : "translateY(48px) scale(0.96)",
            opacity: arrived ? 1 : 0,
            filter: arrived ? "blur(0px)" : "blur(6px)",
            transition:
              "transform 1.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.1s ease-out, filter 1.1s ease-out",
          }}
        >
          <Image
            src="/marcos-portrait.png"
            alt="Marcos Ramos"
            fill
            sizes="(min-width: 1024px) 320px, 256px"
            className="object-contain object-bottom"
            priority
            unoptimized
          />
        </div>
      </div>
      <Link
        href="/sobre"
        aria-label="Sobre Marcos Ramos"
        title="Sobre Marcos Ramos"
        className="absolute z-20 left-0 bottom-0 top-0 w-56 sm:w-64 md:w-72 lg:w-80"
      />
    </Fragment>
  );
}
