# Marcos Ramos — interface de pensamento

Primeira versão funcional do site pessoal experimental de Marcos Ramos: não um portfólio convencional, mas um **ecossistema navegável** que conecta pesquisa, educação, cultura, tecnologia, currículos, artigos, palestras, consultorias, softwares e projetos através de um **grafo de conceitos**.

> "Investigo como cultura, tecnologia e aprendizagem produzem novas formas de imaginar o mundo."

## ⚠️ Sobre os conteúdos

**Todos os conteúdos (artigos, livros, palestras, projetos, cursos etc.) são fictícios, porém plausíveis.** Foram criados como placeholder para dar vida ao grafo e serão substituídos gradualmente por conteúdo real. Os links externos apontam para `example.com`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

1. Suba o repositório para o GitHub (ou GitLab/Bitbucket).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. A Vercel detecta Next.js automaticamente — nenhuma configuração extra e **nenhuma variável de ambiente** é necessária nesta fase (nenhuma API real é chamada).

Alternativa via CLI: `npx vercel`.

## Arquitetura

- **Next.js 14** (App Router, TypeScript) + **Tailwind CSS** + **Framer Motion**
- **react-force-graph-2d** para o grafo de força (modo Explorar)
- **Zustand** para estado global leve (modo ativo, conceito selecionado, query de busca)
- **Fuse.js** para a busca simulada (fuzzy search com peso maior nos conceitos)
- **MDX** (`next-mdx-remote`) para textos longos; **JSON** para metadados estruturados

### Estrutura

```
app/
  layout.tsx            # fontes (Fraunces + Inter), header, footer
  page.tsx              # home — carrega os dados e distribui via props
  objeto/[id]/page.tsx  # detalhe de um objeto (renderiza MDX se existir)
components/
  RhizomeGraph.tsx      # grafo de força (desktop)
  ConceptNode.tsx       # pintura customizada dos nós no canvas
  ObjectPreviewPanel.tsx# painel lateral ao clicar em um nó
  ConceptAccordion.tsx  # substituto do grafo no mobile (chips + lista)
  ModeSwitcher.tsx      # Explorar / Ler / Construir
  EditorialList.tsx     # modo Ler
  BuildArchive.tsx      # modo Construir
  SearchSemanticMock.tsx# campo de busca
  ManifestoSection.tsx  # frase-âncora da home
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
  useAppStore.ts        # Zustand
types/
  index.ts              # ContentObject, ConceptNode, ObjectType, ...
```

### Decisões que valem registrar

- **A fonte de verdade das conexões** é o campo `concepts` de cada objeto em `objects.json`; `lib/data.ts` recomputa os `objectIds` dos conceitos para os dois arquivos nunca dessincronizarem.
- **As arestas do grafo são derivadas**: dois conceitos se conectam quando compartilham ao menos um objeto (peso = nº de objetos em comum).
- **Busca real no futuro**: o ponto de substituição por embeddings/busca vetorial está comentado em `lib/useSearch.ts` — a interface do hook não muda.
- **Mobile**: abaixo do breakpoint `md`, o grafo de força é substituído por chips de conceito roláveis + lista (`ConceptAccordion`), mantendo a mesma lógica de filtro.
- Se o layout de força ficar genérico, a alternativa prevista é d3-force puro em `<svg>` — os pontos de ajuste estão comentados em `RhizomeGraph.tsx`.

## Identidade visual (tokens)

| Token | Valor | Uso |
|---|---|---|
| `paper` | `#FAFAF6` | fundo off-white quente |
| `ink` | `#16160F` | texto quase-preto |
| `accent` | `#B5651D` | ocre/terracota — única cor de destaque |
| serif | Fraunces | títulos e frases-âncora |
| sans | Inter | corpo de texto e UI |

Linhas de 1px, sem sombras pesadas, sem gradientes, grid assimétrico com alinhamento consistente.

## Próximas fases (fora deste escopo)

CMS, busca semântica real (embeddings), animações avançadas, banco de dados. O código atual não antecipa essa infraestrutura além do comentário em `lib/useSearch.ts` — de propósito.
