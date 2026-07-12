import Link from "next/link";
import { getConcepts, getObjects } from "@/lib/data";
import { OBJECT_STATUSES, OBJECT_TYPES } from "@/types";
import { createObjectAction, logout } from "./actions";
import { TermTitlebar, TermStatusbar } from "@/components/terminal/TermChrome";

export const metadata = {
  title: "Painel do administrador — Marcos Ramos",
};

export const dynamic = "force-dynamic";

const fieldClass =
  "w-full border border-term-line bg-term-bg px-3 py-2 text-sm text-term-ink focus:border-term-accent2 focus:outline-none";
const labelClass = "block text-xs text-term-accent2-dim mb-1.5";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const [concepts, objects] = await Promise.all([getConcepts(), getObjects()]);

  return (
    <div className="min-h-screen flex flex-col bg-term-bg text-term-ink font-term-mono text-sm">
      <TermTitlebar path="admin/novo-objeto.ts" badge="Admin" />

      <div className="flex-1 bg-term-inset px-5 md:px-10 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-term-muted text-xs mb-1">// admin</p>
              <h1 className="text-lg font-bold text-term-ink">
                Publicar objeto novo
              </h1>
              <p className="mt-1 text-xs text-term-muted">
                artigo, projeto, software... aparece no database e no grafo na hora.
              </p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs text-term-muted hover:text-term-accent2 transition-colors shrink-0"
              >
                $ sair
              </button>
            </form>
          </div>

          {searchParams.error && (
            <p
              role="alert"
              className="mt-6 border border-term-danger/40 px-4 py-3 text-xs text-term-danger"
            >
              // Error: corrija antes de salvar — {searchParams.error}
            </p>
          )}

          <form
            action={createObjectAction}
            className="mt-8 space-y-5 border-t border-dashed border-term-line pt-6"
          >
            <div>
              <label htmlFor="title" className={labelClass}>
                título:
              </label>
              <input id="title" name="title" type="text" required className={fieldClass} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label htmlFor="type" className={labelClass}>
                  tipo:
                </label>
                <select id="type" name="type" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    escolha
                  </option>
                  {OBJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="year" className={labelClass}>
                  ano:
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  required
                  defaultValue={new Date().getFullYear()}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="status" className={labelClass}>
                  status:
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  defaultValue="publicado"
                  className={fieldClass}
                >
                  {OBJECT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end pb-2.5">
                <label className="flex items-center gap-2 text-xs text-term-muted">
                  <input type="checkbox" name="featured" className="accent-term-accent2" />
                  destaque
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="shortDescription" className={labelClass}>
                descrição_curta:
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                required
                rows={2}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="longDescription" className={labelClass}>
                texto_longo:
              </label>
              <textarea
                id="longDescription"
                name="longDescription"
                required
                rows={8}
                className={fieldClass}
              />
            </div>

            <fieldset>
              <legend className={labelClass}>
                conceitos: <span className="text-term-muted">// ao menos um</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {concepts.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-1.5 border border-term-line px-3 py-1 text-xs text-term-muted hover:border-term-accent2 hover:text-term-ink transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="concepts"
                      value={c.id}
                      className="accent-term-accent2"
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={labelClass}>
                objetos_relacionados: <span className="text-term-muted">// opcional</span>
              </legend>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border border-term-line p-3">
                {objects.map((o) => (
                  <label key={o.id} className="flex items-center gap-1.5 text-xs text-term-muted">
                    <input
                      type="checkbox"
                      name="relatedObjectIds"
                      value={o.id}
                      className="accent-term-accent2"
                    />
                    {o.title}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="links" className={labelClass}>
                links: <span className="text-term-muted">// opcional, um por linha — Rótulo | https://url</span>
              </label>
              <textarea
                id="links"
                name="links"
                rows={3}
                placeholder="Repositório | https://github.com/..."
                className={`${fieldClass} placeholder:text-term-muted/60`}
              />
            </div>

            <button
              type="submit"
              className="border border-term-accent2-dim bg-term-accent2/10 text-term-accent2 px-6 py-2 text-sm hover:bg-term-accent2/20 transition-colors"
            >
              $ publicar objeto
            </button>
          </form>

          <section className="mt-14 border-t border-term-line pt-6">
            <h2 className="text-xs text-term-muted mb-1">
              // objetos existentes ({objects.length})
            </h2>
            <ul className="mt-3 divide-y divide-term-line">
              {objects.map((o) => (
                <li key={o.id} className="py-2 flex items-baseline gap-3">
                  <Link
                    href={`/objeto/${o.id}`}
                    className="text-sm text-term-ink hover:text-term-accent2 transition-colors"
                  >
                    {o.title}
                  </Link>
                  <span className="text-xs text-term-muted">
                    {o.type} · {o.year}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <TermStatusbar left="⎇ main" right="protected" />
    </div>
  );
}
