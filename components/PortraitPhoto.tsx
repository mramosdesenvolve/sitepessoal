"use client";

import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";

/**
 * Retrato ao lado do grafo na home — duas versões da mesma foto (fundo
 * preto/branco) escolhidas conforme o tema ativo, para o fundo da foto
 * casar com o fundo da página em vez de aparecer como um retângulo solto.
 * Arquivos em public/marcos-{light,dark}.png.
 */
export function PortraitPhoto() {
  const theme = useAppStore((s) => s.theme);
  const src = theme === "dark" ? "/marcos-dark.png" : "/marcos-light.png";

  return (
    <div className="relative w-40 lg:w-48 h-[480px] md:h-[560px] bg-paper shrink-0">
      <Image
        src={src}
        alt="Marcos Ramos"
        fill
        sizes="(min-width: 1024px) 192px, 160px"
        className="object-contain object-bottom"
        priority
      />
    </div>
  );
}
