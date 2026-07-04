import Link from "next/link";
import type { ContentObject } from "@/types";
import { MetaChip } from "./TagSystem";

interface RelatedObjectsProps {
  objects: ContentObject[];
}

/** Objetos relacionados ao final da página de detalhe — continua a deriva. */
export function RelatedObjects({ objects }: RelatedObjectsProps) {
  if (objects.length === 0) return null;

  return (
    <section className="mt-14 border-t border-line pt-8">
      <h2 className="text-xs uppercase tracking-widest text-muted">
        Continua em
      </h2>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {objects.map((o) => (
          <li key={o.id}>
            <Link href={`/objeto/${o.id}`} className="group block h-full">
              <div className="flex items-center gap-2">
                <MetaChip>{o.type}</MetaChip>
                <span className="text-[11px] text-muted">{o.year}</span>
              </div>
              <h3 className="mt-2 font-serif text-base leading-snug group-hover:text-accent transition-colors">
                {o.title}
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed line-clamp-3">
                {o.shortDescription}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
