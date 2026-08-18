import { login } from "./actions";
import { SiteNav } from "@/components/site/SiteNav";

export const metadata = {
  title: "Acesso do administrador — Marcos Ramos",
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav active={null} />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold mb-1">
            Acesso do administrador
          </h1>
          <p className="text-muted text-[13px] mb-6">
            Entre com a senha para publicar conteúdo.
          </p>

          <form action={login} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs text-muted mb-1.5">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                className="w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>

            {searchParams.error && (
              <p role="alert" className="text-xs text-red-700">
                Senha incorreta.
              </p>
            )}

            <button
              type="submit"
              className="w-full border border-ink bg-ink text-paper py-2 text-sm hover:bg-ink/85 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
