import Link from "next/link";
import type { ContentObject } from "@/types";

/** Objetos relacionados ao final do texto — linhas separadas por fio. */
export function RelatedObjects({ objects }: { objects: ContentObject[] }) {
  if (objects.length === 0) return null;

  return (
    <section className="grid-12 mt-24 border-t border-rule pt-8" aria-labelledby="relacionados">
      <h2 id="relacionados" className="strong m-0 col-span-12 md:col-span-3 mb-6">
        relacionados
      </h2>
      <ul className="m-0 list-none p-0 col-span-12 md:col-span-9">
        {objects.map((o) => (
          <li key={o.id} className="border-t border-hair first:border-t-0">
            <Link
              href={`/objeto/${o.id}`}
              className="block py-4 text-step-2 leading-[1.15] tracking-[-0.02em] text-ink no-underline hover:text-action-text"
            >
              {o.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
