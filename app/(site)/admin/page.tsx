import Link from "next/link";
import { getConcepts, getObjects } from "@/lib/data";
import { OBJECT_STATUSES, OBJECT_TYPES } from "@/types";
import { createObjectAction, logout, syncSubstackAction } from "./actions";
import { Cabecalho } from "@/components/site/Cabecalho";

export const metadata = {
  title: "Painel do administrador — Marcos Ramos",
};

export const dynamic = "force-dynamic";

const labelClass = "strong mb-2 block";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { error?: string; synced?: string };
}) {
  const [concepts, objects] = await Promise.all([getConcepts(), getObjects()]);

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho />

      <main className="flex-1 wrap py-16">
        <div className="grid-12 gap-y-6 pb-12">
          <div className="col-span-12 md:col-span-8">
            <h1 className="title text-step-5 md:text-step-6">publicar objeto novo</h1>
            <p className="m-0 mt-4 text-ink-2">
              Artigo, projeto, software... aparece no database na hora.
            </p>
          </div>
          <form action={logout} className="col-span-12 md:col-span-4 md:text-right">
            <button type="submit" className="pill">
              sair
            </button>
          </form>
        </div>

        {searchParams.error && (
          <p role="alert" className="state mb-8 text-error">
            Corrija antes de salvar — {searchParams.error}
          </p>
        )}

        {searchParams.synced !== undefined && (
          <p className="state mb-8 text-success">
            Sincronizado: {searchParams.synced} artigo
            {searchParams.synced === "1" ? "" : "s"} do Substack
          </p>
        )}

        <section className="grid-12 gap-y-4 border-t border-rule py-8">
          <div className="col-span-12 md:col-span-8">
            <h2 className="strong m-0">fontes externas</h2>
            <p className="m-0 mt-2">
              Sincronizar a seção &quot;Artigos&quot; do Substack
            </p>
            <p className="m-0 mt-1 text-ink-2">
              Puxa só o que estiver na seção Artigos — o resto do Substack fica
              de fora.
            </p>
          </div>
          <form action={syncSubstackAction} className="col-span-12 md:col-span-4 md:text-right">
            <button type="submit" className="pill">
              sincronizar substack
            </button>
          </form>
        </section>

        <form
          action={createObjectAction}
          className="flex max-w-3xl flex-col gap-8 border-t border-rule py-8"
        >
          <div>
            <label htmlFor="title" className={labelClass}>
              título
            </label>
            <input id="title" name="title" type="text" required className="field" />
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <label htmlFor="type" className={labelClass}>
                tipo
              </label>
              <select id="type" name="type" required defaultValue="" className="field">
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
                ano
              </label>
              <input
                id="year"
                name="year"
                type="number"
                required
                defaultValue={new Date().getFullYear()}
                className="field"
              />
            </div>

            <div>
              <label htmlFor="status" className={labelClass}>
                status
              </label>
              <select
                id="status"
                name="status"
                required
                defaultValue="publicado"
                className="field"
              >
                {OBJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="featured" className="h-5 w-5 accent-[var(--red)]" />
                destaque
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="shortDescription" className={labelClass}>
              descrição curta
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              required
              rows={2}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="longDescription" className={labelClass}>
              texto longo
            </label>
            <textarea
              id="longDescription"
              name="longDescription"
              required
              rows={8}
              className="field"
            />
          </div>

          <fieldset className="m-0 border-0 p-0">
            <legend className={labelClass}>
              conceitos <span className="font-normal text-ink-3">— ao menos um</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {concepts.map((c) => (
                <label key={c.id} className="pill has-[:checked]:bg-inverse has-[:checked]:text-on-inverse has-[:focus-visible]:[box-shadow:var(--shadow-focus)]">
                  <input
                    type="checkbox"
                    name="concepts"
                    value={c.id}
                    className="sr-only"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="m-0 border-0 p-0">
            <legend className={labelClass}>
              objetos relacionados <span className="font-normal text-ink-3">— opcional</span>
            </legend>
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto border border-rule bg-surface p-4">
              {objects.map((o) => (
                <label key={o.id} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="relatedObjectIds"
                    value={o.id}
                    className="mt-1 h-4 w-4 accent-[var(--red)]"
                  />
                  {o.title}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="links" className={labelClass}>
              links <span className="font-normal text-ink-3">— opcional, um por linha: Rótulo | https://url</span>
            </label>
            <textarea
              id="links"
              name="links"
              rows={3}
              placeholder="Repositório | https://github.com/..."
              className="field"
            />
          </div>

          <button type="submit" className="pill pill-signal self-start">
            publicar objeto
          </button>
        </form>

        <section className="border-t border-rule pt-8">
          <h2 className="strong m-0 mb-4">objetos existentes ({objects.length})</h2>
          <ul className="m-0 list-none p-0">
            {objects.map((o) => (
              <li key={o.id} className="flex flex-wrap items-baseline gap-x-4 border-t border-hair py-3">
                <Link href={`/objeto/${o.id}`} className="text-ink no-underline hover:text-action-text">
                  {o.title}
                </Link>
                <span className="data">
                  {o.type} · {o.year}
                  {o.sourceName && ` · via ${o.sourceName}`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
