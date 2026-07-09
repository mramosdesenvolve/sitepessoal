import { CubistCornerNav } from "@/components/CubistCornerNav";

export default function NotFound() {
  return (
    <>
      <CubistCornerNav />
      <main className="mx-auto max-w-3xl px-6 md:px-8 pt-32 pb-24 text-center">
        <h1 className="text-3xl">Este objeto ainda não existe.</h1>
        <p className="mt-3 text-sm text-cubist-muted">
          O item que você procura não está no acervo — ou ainda não foi
          publicado.
        </p>
        <a
          href="/acervo"
          className="mt-6 inline-block text-sm text-cubist-accent underline underline-offset-4 hover:no-underline"
        >
          ← voltar ao acervo
        </a>
      </main>
    </>
  );
}
