# Marcos Ramos — interface de pensamento

Site pessoal experimental de Marcos Ramos: não um portfólio convencional, mas uma **interface de pensamento** — um grafo de conceitos navegável que conecta pesquisa, educação, cultura, tecnologia, currículos, artigos, palestras, consultorias, softwares e projetos.

> "Investigo como cultura, tecnologia e aprendizagem produzem novas formas de imaginar o mundo."

A home é deliberadamente minimalista: **busca + grafo**, nada mais. Clicar em "Marcos Ramos" no cabeçalho leva a [/sobre](app/sobre/page.tsx) (currículo e contato); clicar em um conceito no grafo abre o painel lateral com os objetos daquele conceito; clicar em um objeto leva à página de detalhe dele. Em [/admin](app/admin/page.tsx), atrás de senha, dá para publicar objetos novos direto no banco — aparecem no grafo na hora, sem rebuild.

## ⚠️ Sobre os conteúdos

**Todos os conteúdos (artigos, livros, palestras, projetos, cursos, currículo/contato em `/sobre` etc.) são fictícios, porém plausíveis.** Foram criados como placeholder para dar vida ao grafo e serão substituídos gradualmente por conteúdo real (via `/admin` ou editando a seed). Os links externos apontam para `example.com`.

## Rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o `.env` (copie de `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Preencha `DATABASE_URL` com uma connection string Postgres (ver "Banco de dados" abaixo), e escolha `ADMIN_PASSWORD`/`SESSION_SECRET`.
3. Crie as tabelas e popule com os objetos fictícios iniciais:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
4. Rode o site:
   ```bash
   npm run dev
   ```

Abra [http://localhost:3000](http://localhost:3000). O painel do administrador fica em `/admin` (pede a senha de `ADMIN_PASSWORD`).

### Banco de dados

Os objetos (artigos, projetos, softwares...) vivem numa tabela Postgres — é nela que `/admin` grava conteúdo novo. Qualquer Postgres serve, via `DATABASE_URL` padrão:

- **[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)** — mais simples se o deploy já é na Vercel.
- **[Supabase](https://supabase.com)** ou **[Neon](https://neon.tech)** — free tier generoso, funciona igual.

Depois de criar o banco, copie a connection string para `DATABASE_URL` no `.env` e rode `npx prisma migrate deploy` (aplica `prisma/migrations/`) seguido de `npm run db:seed`.

Os conceitos (os 19 nós do grafo) continuam num vocabulário fixo em `data/concepts.json` — este projeto ainda não expõe edição de conceitos, só de objetos.

## Deploy na Vercel

O projeto já é um repositório git local (sem remoto configurado ainda).

1. Crie um repositório vazio no GitHub (ou GitLab/Bitbucket) e aponte o remoto: `git remote add origin <url>` seguido de `git push -u origin main`.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Configure as variáveis de ambiente do projeto na Vercel: `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET` (mesmos valores/formato do `.env.example`).
4. Rode a migração contra o banco de produção uma vez (`npx prisma migrate deploy` com o `DATABASE_URL` de produção no ambiente, ou via `vercel env pull` + o comando local) e a seed se quiser os objetos fictícios iniciais também em produção.

Alternativa via CLI: `npx vercel`.

## Painel do administrador (`/admin`)

- **Login** (`/admin/login`): uma senha só (`ADMIN_PASSWORD`), sem cadastro. Ao acertar, grava um cookie de sessão assinado (JWT via `jose`, 7 dias) — ver `lib/auth.ts`. `middleware.ts` protege `/admin` e subrotas, redirecionando para o login quem não tem sessão válida.
- **Criar objeto** (`/admin`): formulário para publicar um objeto novo completo — título, tipo, ano, status, destaque, descrições curta/longa, conceitos relacionados (obrigatório ao menos um), objetos relacionados (opcional) e links (um por linha, `Rótulo | https://url`). O id/slug é gerado automaticamente a partir do título. Ao salvar, redireciona para a página do objeto recém-criado — já visível no grafo, na busca, em tudo.
- Não há edição/remoção pela UI ainda — só criação. Para corrigir ou remover algo, use `npx prisma studio` (abre uma interface visual do banco) ou edite direto via SQL.

## Arquitetura

- **Next.js 14** (App Router, TypeScript) + **Tailwind CSS** + **Framer Motion**
- **Prisma** + **Postgres** para os objetos (`prisma/schema.prisma`); conceitos continuam estáticos em JSON
- **jose** para o cookie de sessão do admin (compatível com Edge Runtime, usado no `middleware.ts`)
- **react-force-graph-2d** para o grafo de força (home)
- **Zustand** para estado global leve (conceito selecionado, query de busca, tema)
- **Fuse.js** para a busca simulada (fuzzy search com peso maior nos conceitos)
- **MDX** (`next-mdx-remote`) para textos longos opcionais; o texto gravado pelo admin fica direto no banco
- **Tema claro/escuro** via classe `.dark` em `<html>` + variáveis CSS RGB (ver "Identidade visual" abaixo)

### Estrutura

```
app/
  layout.tsx            # fontes (Space Grotesk 700/400), header (nome → /sobre, tema), footer
  page.tsx              # home — carrega os dados e distribui via props (dynamic: dados vêm do banco)
  sobre/page.tsx         # currículo e contato (destino do clique no nome) — retrato + texto
  objeto/[id]/page.tsx  # detalhe de um objeto (renderiza MDX se existir em content/, senão o texto do banco)
  admin/
    page.tsx             # painel: formulário de criação + lista de objetos existentes
    actions.ts           # server actions: createObjectAction, logout
    login/
      page.tsx            # formulário de senha
      actions.ts          # server action: login (verifica senha, grava cookie)
middleware.ts            # protege /admin e subrotas (exceto /admin/login)
components/
  RhizomeGraph.tsx      # grafo de força (desktop)
  PortraitPhoto.tsx     # retrato atrás do grafo (desktop, z-0 — o grafo é z-10 e transparente)
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
  concepts.json         # 19 conceitos (nós do grafo) — vocabulário fixo
  objects.json          # objetos fictícios iniciais — usados só pela seed (prisma/seed.mjs)
content/
  *.mdx                 # textos longos por id de objeto (opcional, tem precedência sobre o texto do banco)
lib/
  data.ts               # única camada de acesso aos dados (Prisma) — getObjects, getConcepts, createObject...
  prisma.ts             # singleton do Prisma Client
  auth.ts               # cria/verifica o token de sessão do admin
  slug.ts               # gera o id do objeto a partir do título
  useSearch.ts          # busca Fuse.js — ver comentário sobre embeddings
prisma/
  schema.prisma         # modelo ContentObject (Postgres)
  migrations/           # histórico de migrações — rodar com `prisma migrate deploy`
  seed.mjs              # popula a tabela com data/objects.json (`npm run db:seed`)
store/
  useAppStore.ts        # Zustand (conceito selecionado, busca, tema)
types/
  index.ts              # ContentObject, ConceptNode, ObjectType, OBJECT_TYPES, ...
```

### Decisões que valem registrar

- **Objetos no banco, conceitos em JSON**: só os objetos (artigos, projetos...) viraram dinâmicos/editáveis via `/admin`; os 19 conceitos continuam um vocabulário fixo em `data/concepts.json`. `lib/data.ts` ainda recomputa `objectIds` dos conceitos a partir do banco a cada leitura, então nunca dessincroniza.
- **Sem `generateStaticParams` em `/objeto/[id]`**: como objetos podem ser criados a qualquer momento via admin, as páginas de objeto e a home são `force-dynamic` — sem isso, um objeto novo só apareceria depois de um rebuild.
- **Sessão simples**: um `ADMIN_PASSWORD` comparado em tempo constante (`timingSafeEqual`), sem hash — é uma variável de ambiente secreta, não uma senha de usuário guardada em banco, então o modelo de risco é diferente e não justifica bcrypt aqui.
- **Server Actions puras, sem JS de formulário customizado**: o formulário de criação usa só `<input>`/`<select>`/`<textarea>`/checkboxes nativos — concepts/relatedObjectIds são checkboxes (`formData.getAll`), links é uma textarea com um formato simples (`Rótulo | url` por linha) em vez de uma lista dinâmica com estado React. Menos JS, funciona igual.
- **Retrato atrás do grafo (`marcos-portrait.png`)**: fundo recortado (transparente) a partir de duas fotos enviadas (fundo preto e branco, mesma pose) — como o sujeito não muda entre elas, a diferença pixel a pixel separa sujeito de fundo com bordas limpas (script Python/Pillow, não versionado; ver histórico do commit), sem precisar de matting por ML nem se preocupar com o fundo original não ser 100% uniforme. Um único PNG RGBA funciona nos dois temas — sem transparência, cada tema precisaria da sua própria versão. `PortraitPhoto.tsx` fica em `z-0` dentro do mesmo contêiner do `RhizomeGraph` (que é `z-10` com canvas transparente), então o grafo desenha por cima da foto em vez de cobri-la com um retângulo opaco. Chegou a existir uma versão com a cor/luz ajustada por transferência de estatísticas (para casar com uma outra foto usada em `/sobre`), mas voltou para a iluminação original a pedido.
- **`unoptimized` no `<Image>` do retrato**: o otimizador de imagem do Next em dev (sem `sharp` global) falhava com "Input Buffer is empty" para esse PNG especificamente — instalar `sharp` como dependência resolveria o pipeline padrão, mas a otimização automática (redimensionar/reamostrar no servidor) não traz benefício aqui, já que as imagens já vêm pré-dimensionadas pelo processamento em Python. `unoptimized` evita o pipeline problemático de vez.
- **`/sobre` está sem foto por ora**: chegou a ter um retrato ao lado do texto (`marcos-bio-portrait.png`, ver histórico do commit) mas foi removido a pedido — a página voltou ao layout de duas colunas (texto + contato) sem coluna de imagem.
- **Banco local sem Docker**: para desenvolver/testar sem precisar de uma conta Postgres na nuvem, `npx prisma dev` (ver [docs do Prisma](https://www.prisma.io/docs)) sobe um Postgres local de verdade — útil só em dev, nunca use em produção.
- **Busca real no futuro**: o ponto de substituição por embeddings/busca vetorial está comentado em `lib/useSearch.ts` — a interface do hook não muda.
- **Busca sem conceito selecionado**: quando não há um conceito ativo, o `SearchResultsPanel` aparece ao lado do grafo (desktop) ou abaixo dos chips (mobile) listando os objetos que bateram com a busca, ranqueados por relevância do Fuse.js (`rankedObjectIds` em `lib/useSearch.ts`). Ao selecionar um conceito, esse painel some e o `ObjectPreviewPanel`/lista do acordeão volta a filtrar dentro do conceito escolhido.
- **Mobile**: abaixo do breakpoint `md`, o grafo de força é substituído por chips de conceito roláveis + lista (`ConceptAccordion`), mantendo a mesma lógica de filtro.
- Se o layout de força ficar genérico, a alternativa prevista é d3-force puro em `<svg>` — os pontos de ajuste estão comentados em `RhizomeGraph.tsx`.
- **Zoom inicial do grafo (`fitGraph` em `RhizomeGraph.tsx`)**: `onEngineStop` pode disparar antes de a força de colisão (aplicada assincronamente em `handleFgRef`) convergir de verdade, deixando um `zoomToFit` prematuro e nós sobrepostos. Por isso há uma segunda chamada de segurança ~2.2s após o mount, além das dos primeiros `onEngineStop`. Um `userInteractedRef` impede que essa rede de segurança sobrescreva zoom/pan manual do usuário — mas a janela em que se ignora o próprio `onZoom` disparado pela lib (`onZoom` dispara a cada frame de qualquer animação de `zoomToFit`/`centerAt`, não só em interação real) precisa cobrir a sequência automática **inteira**, não cada chamada individualmente: uma janela curta que expira entre uma chamada e a próxima deixa um intervalo onde um `onZoom` (real ou da própria lib) marca `userInteractedRef` como `true` cedo demais, cancelando a rede de segurança antes dela rodar aos 2.2s. Por isso `mountTimeRef` + `AUTO_FIT_GRACE_MS` (3.6s, cobrindo com folga os ~3.1s do pior caso: 2 fits do `onEngineStop` + a rede de segurança + a animação do deslocamento de câmera dela) substituem a janela por-chamada que existia antes.
- **Grafo afastado do retrato, de propósito**: depois do `zoomToFit`, `fitGraph()` desloca a câmera (`centerAt`) 110px para a direita (o conteúdo aparece deslocado para a direita na tela) — o pedido foi manter o grafo mais ao centro-direita do contêiner largo (foto+grafo compartilham o mesmo espaço), ao lado do retrato, não por cima dele. (Uma versão anterior fazia o oposto — deslocava para sobrepor a foto — antes do pedido mudar.)
- **Acessibilidade por teclado no grafo (desktop)**: os nós são pintados em `<canvas>`, sem elemento de DOM para focar. `RhizomeGraph.tsx` renderiza um `<button>` por conceito, visualmente oculto até receber foco (padrão "skip link": `sr-only`-like até `:focus`, aí aparece fixo no canto) — Tab alcança cada conceito, Enter/Espaço seleciona (mesmo handler do clique no nó). Ao selecionar, `ObjectPreviewPanel` move o foco para o próprio heading (`useEffect` + `tabIndex={-1}`), então quem navega por teclado não precisa tabular por todos os outros conceitos ocultos para chegar ao painel recém-aberto. A versão mobile (`ConceptAccordion`) já era 100% navegável por teclado (chips são `<button>` nativos).
- O site já teve modos "Ler" e "Construir" (listas editoriais separadas do grafo) — foram removidos da home a pedido, e os componentes correspondentes foram deletados. Se fizerem falta de novo, dá para recriá-los como rotas próprias (ex. `/ler`, `/construir`) reaproveitando os dados de `lib/data.ts`.

## Identidade visual (tokens)

Os tokens vivem como variáveis CSS RGB em `app/globals.css` (`--color-paper`, `--color-ink`, `--color-accent`), redefinidas dentro de `.dark`, e o Tailwind (`tailwind.config.ts`) as expõe como `bg-paper`, `text-ink`, `text-accent` etc. — funcionam nos dois temas sem duplicar classes.

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `paper` | `#FAFAF6` | `#0A0A09` | fundo |
| `ink` | `#16160F` | `#F0EEE7` | texto principal |
| `accent` | `#B5651D` | `#D68A4A` | única cor de destaque |
| `font-serif` (peso 700) | Space Grotesk | | títulos e frases-âncora |
| `font-sans` (peso 400) | Space Grotesk | | corpo de texto e UI |

A identidade pedia "Neue Augenblick Bold" e "Neue Augenblick" — uma fonte paga/licenciada, sem equivalente gratuito exato. Space Grotesk (Google Fonts) é a grotesca geométrica gratuita mais próxima do mesmo espírito contemporâneo, carregada em `app/layout.tsx` como duas instâncias travadas cada uma num peso único (700 e 400) — assim as classes `font-serif`/`font-sans`, já usadas por todo o código, continuam funcionando sem precisar adicionar `font-bold` em cada título. Se depois vocês conseguirem os arquivos reais da Neue Augenblick, é só trocar esse loader em `app/layout.tsx` por `next/font/local` apontando pros arquivos — nada mais no código muda.

Linhas de 1px, sem sombras pesadas, sem gradientes, grid assimétrico com alinhamento consistente. O `<canvas>` do grafo não lê CSS, então `components/ConceptNode.tsx` mantém as duas paletas em hex puro, escolhidas em `RhizomeGraph.tsx` conforme o tema ativo.

## Próximas fases (fora deste escopo)

CMS completo (edição/remoção pela UI, não só criação), busca semântica real (embeddings), animações avançadas, upload de imagens. O código atual não antecipa essa infraestrutura além dos comentários já deixados no código — de propósito.
