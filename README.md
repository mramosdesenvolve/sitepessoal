# Marcos Ramos — interface de pensamento

Site pessoal experimental de Marcos Ramos: não um portfólio convencional, mas uma **interface de pensamento** — um grafo de conceitos navegável que conecta pesquisa, educação, cultura, tecnologia, currículos, artigos, palestras, consultorias, softwares e projetos.

> "Investigo como cultura, tecnologia e aprendizagem produzem novas formas de imaginar o mundo."

A home é deliberadamente minimalista: **busca + grafo**, nada mais. Clicar em "Marcos Ramos" no cabeçalho leva a [/sobre](app/sobre/page.tsx) (currículo e contato); clicar em um conceito no grafo abre o painel lateral com os objetos daquele conceito; clicar em um objeto leva à página de detalhe dele.

## ⚠️ Sobre os conteúdos

**Todos os conteúdos (artigos, livros, palestras, projetos, cursos, currículo/contato em `/sobre` etc.) são fictícios, porém plausíveis.** Foram criados como placeholder para dar vida ao grafo e serão substituídos gradualmente por conteúdo real. Os links externos apontam para `example.com`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

O projeto já é um repositório git local (sem remoto configurado ainda).

1. Crie um repositório vazio no GitHub (ou GitLab/Bitbucket) e aponte o remoto: `git remote add origin <url>` seguido de `git push -u origin main`.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. A Vercel detecta Next.js automaticamente — nenhuma configuração extra e **nenhuma variável de ambiente** é necessária nesta fase (nenhuma API real é chamada).

Alternativa via CLI: `npx vercel`.

## Arquitetura

- **Next.js 14** (App Router, TypeScript) + **Tailwind CSS** + **Framer Motion**
- **react-force-graph-2d** para o grafo de força (home)
- **Zustand** para estado global leve (conceito selecionado, query de busca, tema)
- **Fuse.js** para a busca simulada (fuzzy search com peso maior nos conceitos)
- **MDX** (`next-mdx-remote`) para textos longos; **JSON** para metadados estruturados
- **Tema claro/escuro** via classe `.dark` em `<html>` + variáveis CSS RGB (ver "Identidade visual" abaixo)

### Estrutura

```
app/
  layout.tsx            # fontes (Fraunces + Inter), header (nome → /sobre, tema), footer
  page.tsx              # home — carrega os dados e distribui via props
  sobre/page.tsx         # currículo e contato (destino do clique no nome)
  objeto/[id]/page.tsx  # detalhe de um objeto (renderiza MDX se existir)
components/
  RhizomeGraph.tsx      # grafo de força (desktop)
  ConceptNode.tsx       # pintura customizada dos nós no canvas (paletas claro/escuro)
  ObjectPreviewPanel.tsx# painel lateral ao clicar em um nó
  SearchResultsPanel.tsx# resultados da busca sem conceito selecionado
  ConceptAccordion.tsx  # substituto do grafo no mobile (chips + lista)
  SearchSemanticMock.tsx# campo de busca
  ThemeToggle.tsx       # alterna claro/escuro, persiste em localStorage
  ObjectDetailView.tsx  # moldura da página de detalhe
  RelatedObjects.tsx    # "continua em" no fim do detalhe
  TagSystem.tsx         # chips de tipo/status/conceitos
data/
  concepts.json         # 19 conceitos (nós do grafo)
  objects.json          # ~20 objetos cobrindo os 12 tipos
content/
  *.mdx                 # textos longos por id de objeto (opcional)
lib/
  data.ts               # única camada de acesso aos dados
  useSearch.ts          # busca Fuse.js — ver comentário sobre embeddings
store/
  useAppStore.ts        # Zustand (conceito selecionado, busca, tema)
types/
  index.ts              # ContentObject, ConceptNode, ObjectType, ...
```

### Decisões que valem registrar

- **A fonte de verdade das conexões** é o campo `concepts` de cada objeto em `objects.json`; `lib/data.ts` recomputa os `objectIds` dos conceitos para os dois arquivos nunca dessincronizarem.
- **As arestas do grafo são derivadas**: dois conceitos se conectam quando compartilham ao menos um objeto (peso = nº de objetos em comum).
- **Busca real no futuro**: o ponto de substituição por embeddings/busca vetorial está comentado em `lib/useSearch.ts` — a interface do hook não muda.
- **Busca sem conceito selecionado**: quando não há um conceito ativo, o `SearchResultsPanel` aparece ao lado do grafo (desktop) ou abaixo dos chips (mobile) listando os objetos que bateram com a busca, ranqueados por relevância do Fuse.js (`rankedObjectIds` em `lib/useSearch.ts`). Ao selecionar um conceito, esse painel some e o `ObjectPreviewPanel`/lista do acordeão volta a filtrar dentro do conceito escolhido.
- **Mobile**: abaixo do breakpoint `md`, o grafo de força é substituído por chips de conceito roláveis + lista (`ConceptAccordion`), mantendo a mesma lógica de filtro.
- Se o layout de força ficar genérico, a alternativa prevista é d3-force puro em `<svg>` — os pontos de ajuste estão comentados em `RhizomeGraph.tsx`.
- **Acessibilidade por teclado**: os nós do grafo são pintados em `<canvas>` e não são focáveis por teclado no desktop; a versão mobile (`ConceptAccordion`) é 100% navegável por teclado.
- O site já teve modos "Ler" e "Construir" (listas editoriais separadas do grafo) — foram removidos da home a pedido, e os componentes correspondentes foram deletados. Se fizerem falta de novo, dá para recriá-los como rotas próprias (ex. `/ler`, `/construir`) reaproveitando os dados de `lib/data.ts`.

## Identidade visual (tokens)

Os tokens vivem como variáveis CSS RGB em `app/globals.css` (`--color-paper`, `--color-ink`, `--color-accent`), redefinidas dentro de `.dark`, e o Tailwind (`tailwind.config.ts`) as expõe como `bg-paper`, `text-ink`, `text-accent` etc. — funcionam nos dois temas sem duplicar classes.

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `paper` | `#FAFAF6` | `#0A0A09` | fundo |
| `ink` | `#16160F` | `#F0EEE7` | texto principal |
| `accent` | `#B5651D` | `#D68A4A` | única cor de destaque |
| serif | Fraunces | | títulos e frases-âncora |
| sans | Inter | | corpo de texto e UI |

Linhas de 1px, sem sombras pesadas, sem gradientes, grid assimétrico com alinhamento consistente. O `<canvas>` do grafo não lê CSS, então `components/ConceptNode.tsx` mantém as duas paletas em hex puro, escolhidas em `RhizomeGraph.tsx` conforme o tema ativo.

## Próximas fases (fora deste escopo)

CMS, busca semântica real (embeddings), animações avançadas, banco de dados. O código atual não antecipa essa infraestrutura além do comentário em `lib/useSearch.ts` — de propósito.
