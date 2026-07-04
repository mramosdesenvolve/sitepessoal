import Image from "next/image";

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
 */
export function PortraitPhoto() {
  return (
    <div className="absolute z-0 left-0 bottom-0 top-0 w-56 sm:w-64 md:w-72 lg:w-80 pointer-events-none">
      <Image
        src="/marcos-portrait.png"
        alt="Marcos Ramos"
        fill
        sizes="(min-width: 1024px) 320px, 256px"
        className="object-contain object-bottom"
        priority
      />
    </div>
  );
}
