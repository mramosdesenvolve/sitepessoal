import Link from "next/link";
import type { ContentObject } from "@/types";

/** Objetos relacionados ao final do artigo. */
export function RelatedObjects({ objects }: { objects: ContentObject[] }) {
  if (objects.length === 0) return null;

  return (
    <div className="mt-[6vh] pt-[3vh] border-t border-line">
      <p className="text-[12px] uppercase tracking-wide text-muted mb-4">
        Relacionados
      </p>
      <ul className="space-y-3">
        {objects.map((o) => (
          <li key={o.id}>
            <Link
              href={`/objeto/${o.id}`}
              className="text-[15px] text-ink hover:text-accent no-underline"
            >
              {o.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
