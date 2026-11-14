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

      <main className="flex-1 wrap grid-12 items-center py-16">
        <div className="col-span-12 md:col-span-5 md:col-start-4">
          <h1 className="title mb-2 text-step-5">acesso</h1>
          <p className="m-0 mb-8 text-ink-2">
            Entre com a senha para publicar conteúdo.
          </p>

          <form action={login} className="flex flex-col gap-6">
            <div>
              <label htmlFor="password" className="strong mb-2 block">
                senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                className="field"
              />
            </div>

            {searchParams.error && (
              <p role="alert" className="state m-0 text-error">
                Senha incorreta.
              </p>
            )}

            <button type="submit" className="pill pill-signal self-start">
              entrar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
