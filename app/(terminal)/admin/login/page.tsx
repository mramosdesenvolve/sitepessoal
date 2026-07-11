import { login } from "./actions";
import { TermTitlebar, TermStatusbar } from "@/components/terminal/TermChrome";

export const metadata = {
  title: "Acesso do administrador — Marcos Ramos",
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="h-screen flex flex-col bg-term-bg text-term-ink font-term-mono text-sm">
      <TermTitlebar path="admin/login.sh" />

      <div className="flex-1 flex items-center justify-center bg-term-inset px-6">
        <div className="w-full max-w-sm">
          <p className="text-term-muted text-xs mb-1">$ ./login.sh</p>
          <h1 className="text-lg font-bold text-term-ink mb-1">
            Acesso do administrador
          </h1>
          <p className="text-term-muted text-xs mb-6">
            // entre com a senha para publicar conteúdo
          </p>

          <form action={login} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs text-term-accent2-dim mb-1.5">
                password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                className="w-full border border-term-line rounded-none bg-term-bg px-3 py-2 text-sm text-term-ink focus:border-term-accent2 focus:outline-none"
              />
            </div>

            {searchParams.error && (
              <p role="alert" className="text-xs text-term-danger">
                // Error: senha incorreta
              </p>
            )}

            <button
              type="submit"
              className="w-full border border-term-accent2-dim bg-term-accent2/10 text-term-accent2 py-2 text-sm hover:bg-term-accent2/20 transition-colors"
            >
              $ entrar
            </button>
          </form>
        </div>
      </div>

      <TermStatusbar left="⎇ main" right="protected" />
    </div>
  );
}
