import Link from "next/link";
import type { ContentObject } from "@/types";

interface RelatedObjectsProps {
  objects: ContentObject[];
}

/** Objetos relacionados ao final do artigo — estilizados como imports. */
export function RelatedObjects({ objects }: RelatedObjectsProps) {
  if (objects.length === 0) return null;

  return (
    <div className="mt-[5vh] pt-[2.4vh] border-t border-term-line font-term-mono text-[12.5px]">
      <p className="text-term-muted mb-2.5">// continua em</p>
      {objects.map((o) => (
        <p key={o.id} className="text-term-muted-2 m-0 my-[3px]">
          <span className="text-term-accent2-dim">import</span> {"{ "}
          <Link href={`/objeto/${o.id}`} className="text-term-ink hover:text-term-accent2 no-underline">
            &quot;{o.title}&quot;
          </Link>
          {" }"} <span className="text-term-accent2-dim">from</span>{" "}
          <span className="text-term-accent">&quot;./database&quot;</span>
        </p>
      ))}
    </div>
  );
}
