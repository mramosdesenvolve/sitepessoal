import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8 py-24 text-center">
      <h1 className="font-serif text-3xl">Este nó ainda não existe.</h1>
      <p className="mt-3 text-sm text-muted">
        O objeto que você procura não está no grafo — ou ainda não foi
        conectado a ele.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-accent underline underline-offset-4 hover:no-underline"
      >
        ← voltar ao grafo
      </Link>
    </main>
  );
}
