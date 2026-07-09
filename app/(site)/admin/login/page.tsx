import { login } from "./actions";

export const metadata = {
  title: "Acesso do administrador — Marcos Ramos",
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="mx-auto max-w-sm px-5 py-24">
      <h1 className="font-serif text-2xl">Acesso do administrador</h1>
      <p className="mt-2 text-sm text-muted">
        Entre com a senha para adicionar conteúdo ao ecossistema.
      </p>

      <form action={login} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm text-muted mb-1"
          >
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="w-full border border-line rounded-md bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        {searchParams.error && (
          <p role="alert" className="text-sm text-accent">
            Senha incorreta.
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-ink text-paper py-2 text-sm hover:bg-accent transition-colors"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
