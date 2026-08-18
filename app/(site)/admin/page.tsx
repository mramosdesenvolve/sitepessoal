import Link from "next/link";
import { getConcepts, getObjects } from "@/lib/data";
import { OBJECT_STATUSES, OBJECT_TYPES } from "@/types";
import { createObjectAction, logout, syncSubstackAction } from "./actions";
import { SiteNav } from "@/components/site/SiteNav";

export const metadata = {
  title: "Painel do administrador — Marcos Ramos",
};

export const dynamic = "force-dynamic";

const fieldClass =
  "w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none";
const labelClass = "block text-xs text-muted mb-1.5";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { error?: string; synced?: string };
}) {
  const [concepts, objects] = await Promise.all([getConcepts(), getObjects()]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active={null} />

      <div className="flex-1 px-5 md:px-10 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-ink">
                Publicar objeto novo
              </h1>
              <p className="mt-1 text-xs text-muted">
                artigo, projeto, software... aparece no database e no grafo na hora.
              </p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs text-muted hover:text-ink transition-colors shrink-0"
              >
                Sair
              </button>
            </form>
          </div>

          {searchParams.error && (
            <p
              role="alert"
              className="mt-6 border border-red-300 px-4 py-3 text-xs text-red-700"
            >
              Corrija antes de salvar — {searchParams.error}
            </p>
          )}

          {searchParams.synced !== undefined && (
            <p className="mt-6 border border-accent/40 px-4 py-3 text-xs text-accent">
              Sincronizado: {searchParams.synced} artigo
              {searchParams.synced === "1" ? "" : "s"} do Substack
            </p>
          )}

          <section className="mt-8 border-t border-line pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xs text-muted mb-1">
                  Fontes externas
                </h2>
                <p className="text-sm text-ink">
                  Sincronizar seção &quot;Artigos&quot; do Substack
                </p>
                <p className="mt-1 text-xs text-muted">
                  puxa só o que estiver na seção Artigos — o resto do
                  Substack fica de fora
                </p>
              </div>
              <form action={syncSubstackAction}>
                <button
                  type="submit"
                  className="border border-line px-4 py-2 text-xs whitespace-nowrap hover:border-ink transition-colors"
                >
                  Sincronizar Substack
                </button>
              </form>
            </div>
          </section>

          <form
            action={createObjectAction}
            className="mt-8 space-y-5 border-t border-line pt-6"
          >
            <div>
              <label htmlFor="title" className={labelClass}>
                Título
              </label>
              <input id="title" name="title" type="text" required className={fieldClass} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label htmlFor="type" className={labelClass}>
                  Tipo
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
                  Ano
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
                  Status
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
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input type="checkbox" name="featured" className="accent-accent" />
                  destaque
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="shortDescription" className={labelClass}>
                Descrição curta
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
                Texto longo
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
                Conceitos <span className="text-muted">— ao menos um</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {concepts.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-1.5 border border-line px-3 py-1 text-xs text-muted hover:border-ink hover:text-ink transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="concepts"
                      value={c.id}
                      className="accent-accent"
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={labelClass}>
                Objetos relacionados <span className="text-muted">— opcional</span>
              </legend>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border border-line p-3">
                {objects.map((o) => (
                  <label key={o.id} className="flex items-center gap-1.5 text-xs text-muted">
                    <input
                      type="checkbox"
                      name="relatedObjectIds"
                      value={o.id}
                      className="accent-accent"
                    />
                    {o.title}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="links" className={labelClass}>
                Links <span className="text-muted">— opcional, um por linha: Rótulo | https://url</span>
              </label>
              <textarea
                id="links"
                name="links"
                rows={3}
                placeholder="Repositório | https://github.com/..."
                className={`${fieldClass} placeholder:text-muted-2`}
              />
            </div>

            <button
              type="submit"
              className="border border-ink bg-ink text-paper px-6 py-2 text-sm hover:bg-ink/85 transition-colors"
            >
              Publicar objeto
            </button>
          </form>

          <section className="mt-14 border-t border-line pt-6">
            <h2 className="text-xs text-muted mb-1">
              Objetos existentes ({objects.length})
            </h2>
            <ul className="mt-3 divide-y divide-line">
              {objects.map((o) => (
                <li key={o.id} className="py-2 flex items-baseline gap-3">
                  <Link
                    href={`/objeto/${o.id}`}
                    className="text-sm text-ink hover:text-accent transition-colors"
                  >
                    {o.title}
                  </Link>
                  <span className="text-xs text-muted">
                    {o.type} · {o.year}
                    {o.sourceName && ` · via ${o.sourceName}`}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
