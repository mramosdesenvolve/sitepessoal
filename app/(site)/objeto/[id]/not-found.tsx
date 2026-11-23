import { Cabecalho } from "@/components/site/Cabecalho";
import { Rodape } from "@/components/site/Rodape";

export default function NotFound() {
  return (
    <div className="page">
      <Cabecalho />

      <main>
        <div className="coluna">
          <h1 className="texto-titulo">Texto não encontrado</h1>
          <p className="texto-subtitulo">
            O item que você procura não existe, ou ainda não foi publicado.
          </p>
          <p className="texto-data">
            <a href="/">Voltar ao início</a>
          </p>
        </div>
      </main>

      <Rodape />
    </div>
  );
}
