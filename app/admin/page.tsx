import Link from "next/link";
import { getConcepts, getObjects } from "@/lib/data";
import { OBJECT_STATUSES, OBJECT_TYPES } from "@/types";
import { createObjectAction, logout } from "./actions";

export const metadata = {
  title: "Painel do administrador — Marcos Ramos",
};

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const [concepts, objects] = await Promise.all([getConcepts(), getObjects()]);

  return (
    <main className="mx-auto max-w-4xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl">Painel do administrador</h1>
          <p className="mt-1 text-sm text-muted">
            Criar um objeto novo no ecossistema (artigo, projeto, software...).
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            Sair
          </button>
        </form>
      </div>

      {searchParams.error && (
        <p
          role="alert"
          className="mt-6 border border-accent/40 rounded-md px-4 py-3 text-sm text-accent"
        >
          Corrija antes de salvar: {searchParams.error}.
        </p>
      )}

      <form
        action={createObjectAction}
        className="mt-8 space-y-6 border-t border-line pt-8"
      >
        <div>
          <label htmlFor="title" className="block text-sm text-muted mb-1">
            Título *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full border border-line rounded-md bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm text-muted mb-1">
              Tipo *
            </label>
            <select
              id="type"
              name="type"
              required
              defaultValue=""
              className="w-full border border-line rounded-md bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
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
            <label htmlFor="year" className="block text-sm text-muted mb-1">
              Ano *
            </label>
            <input
              id="year"
              name="year"
              type="number"
              required
              defaultValue={new Date().getFullYear()}
              className="w-full border border-line rounded-md bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm text-muted mb-1">
              Status *
            </label>
            <select
              id="status"
              name="status"
              required
              defaultValue="publicado"
              className="w-full border border-line rounded-md bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
              {OBJECT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="featured" className="accent-accent" />
              destaque
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="shortDescription"
            className="block text-sm text-muted mb-1"
          >
            Descrição curta *
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            required
            rows={2}
            className="w-full border border-line rounded-md bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="longDescription"
            className="block text-sm text-muted mb-1"
          >
            Texto longo *
          </label>
          <textarea
            id="longDescription"
            name="longDescription"
            required
            rows={8}
            className="w-full border border-line rounded-md bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <fieldset>
          <legend className="block text-sm text-muted mb-2">
            Conceitos relacionados * (ao menos um)
          </legend>
          <div className="flex flex-wrap gap-2">
            {concepts.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-1.5 border border-line rounded-full px-3 py-1 text-xs hover:border-accent transition-colors"
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
          <legend className="block text-sm text-muted mb-2">
            Objetos relacionados (opcional)
          </legend>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border border-line rounded-md p-3">
            {objects.map((o) => (
              <label
                key={o.id}
                className="flex items-center gap-1.5 text-xs"
              >
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
          <label htmlFor="links" className="block text-sm text-muted mb-1">
            Links (opcional) — um por linha, no formato{" "}
            <code className="text-accent">Rótulo | https://url</code>
          </label>
          <textarea
            id="links"
            name="links"
            rows={3}
            placeholder="Repositório | https://github.com/..."
            className="w-full border border-line rounded-md bg-transparent px-3 py-2 text-sm placeholder:text-muted/60 focus:border-accent focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-ink text-paper px-6 py-2 text-sm hover:bg-accent transition-colors"
        >
          Publicar objeto
        </button>
      </form>

      <section className="mt-14 border-t border-line pt-8">
        <h2 className="text-xs uppercase tracking-widest text-muted">
          Objetos existentes ({objects.length})
        </h2>
        <ul className="mt-4 divide-y divide-line">
          {objects.map((o) => (
            <li key={o.id} className="py-2 flex items-baseline gap-3">
              <Link
                href={`/objeto/${o.id}`}
                className="text-sm hover:text-accent transition-colors"
              >
                {o.title}
              </Link>
              <span className="text-xs text-muted">
                {o.type} · {o.year}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
