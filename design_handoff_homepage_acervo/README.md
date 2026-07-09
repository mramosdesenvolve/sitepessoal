# Handoff: Homepage "Acervo" — retrato cubista interativo + Problema 10 + rizoma

## Overview
Página inicial de site pessoal (repositório não comercial de um consultor/professor/articulista). É uma peça conceitual em três atos:

1. **Retrato** — a página inteira tem a cor do fundo da foto; no centro, o rosto do autor remontado em 11 recortes fotográficos em escalas diferentes (colagem cubista). O cursor desloca as peças (repulsão por proximidade); ao afastar, o rosto se remonta.
2. **Portão (xadrez)** — clicar na cabeça explode os fragmentos e revela o Problema 10 de Machado de Assis (Ilustração Brasileira, 1877), num tabuleiro interativo. O visitante deve jogar os DOIS lances das brancas (mate em 2), com resposta automática das pretas entre eles.
3. **Rizoma** — resolvido o problema, o tabuleiro se dissolve e nasce uma constelação rizomática de temas ligados por fios; tocar um nó acende suas conexões.

Únicos textos permanentes na tela: "acervo" e "contato" no canto superior direito.

## About the Design Files
Os arquivos deste pacote são **referências de design criadas em HTML** — protótipos que mostram aparência e comportamento pretendidos, não código de produção. A tarefa é **recriar este design no ambiente do codebase de destino** (Next.js/React, Astro, ou o que for escolhido), usando seus padrões. Se ainda não existe codebase, sugerir stack simples (site estático + um componente interativo; React é confortável para a máquina de estados do xadrez).

O protótipo `Homepage Direções.dc.html` contém VÁRIAS direções exploradas em turnos; **a direção a implementar é a opção `7a`** (seção com `id="7a"`, a primeira do arquivo). O restante é histórico de exploração.

## Fidelity
**High-fidelity** para a opção 7a: cores, tipografia, recortes da foto, lógica do xadrez e dados do rizoma são finais. Recriar fielmente. (Conteúdo dos nós do rizoma pode ser ajustado pelo autor.)

## Tela única: "Acervo" (1280×800 de referência; produção = viewport cheia)

### Fundo e moldura
- Fundo da página: `#a9a7a2` (cinza-concreto, tirado do fundo da foto).
- Sem header, sem footer, sem mais nada.
- Canto superior direito (36px do topo, 44px da direita): links `acervo` e `contato` — IBM Plex Mono 12px, letter-spacing 0.14em, minúsculas, cor `#22201d`, gap 32px. `contato` = `mailto:`. Hover: `#8c2f1f`.

### Ato 1 — Retrato cubista
- Fonte da imagem: `IMG_2790.png` (retrato 1024×1024, incluído no pacote). Todos os recortes com `filter: grayscale(1) contrast(1.07)` e `outline: 1px solid #f5f2eb` (borda de "foto impressa").
- 11 tiles absolutos, cluster centrado (~410–870 × 90–720 no frame 1280×800). Cada tile é um recorte via `background-size`/`background-position` (px relativos à imagem escalada):

| # | left,top | w×h | bg-size | bg-position | conteúdo |
|---|---------|-----|---------|-------------|----------|
| 1 | 410,90  | 300×150 | 635 | -143,-25  | testa/calva |
| 2 | 710,90  | 160×150 | 635 | -397,-37  | cabelo dir. |
| 3 | 410,240 | 110×190 | 635 | -112,-167 | têmpora esq. |
| 4 | 520,240 | 170×120 | 870 | -247,-255 | olho esq. (zoom) |
| 5 | 690,260 | 180×130 | 1075| -546,-326 | olho dir. (zoom maior) |
| 6 | 560,360 | 140×140 | 717 | -294,-273 | nariz |
| 7 | 700,390 | 120×160 | 635 | -409,-236 | orelha/bochecha dir. |
| 8 | 540,460 | 180×110 | 737 | -281,-328 | boca/sorriso |
| 9 | 410,430 | 130×180 | 635 | -155,-298 | mandíbula esq. |
| 10| 540,570 | 200×140 | 614 | -210,-336 | queixo/barba |
| 11| 740,520 | 130×190 | 635 | -372,-322 | barba/pescoço dir. |

- Cada tile tem uma rotação-base própria (`data-rot`, em décimos de grau: -13, 9, -7, 12, -16, 6, -10, 14, -8, 11, -14).

**Interação (mousemove):** repulsão por proximidade do cursor. Para cada tile: vetor do cursor ao centro do tile, `d = distância`, `k = max(0, 1 - d/320)`, `f = k²`; deslocamento = direção × `95·f` px; rotação = `(rot/10)·f·2.5` graus. `transition: transform .35s ease-out`. No mouseleave, `transform: none` (remonta).

### Ato 2 — Clique → explosão + Problema 10
**Clique na cabeça/fundo (estado fechado):**
- Cada fragmento voa na direção radial a partir do centro (640,400): `translate(dir × 980px) rotate(rot × 1.6°)`, `opacity → 0`, `transition: transform .8s cubic-bezier(.4,0,.7,1), opacity .7s ease .1s`.
- Surge o painel de xadrez (fade-in .6s com delay .3s), centrado.

**Painel de xadrez:**
- Título (mono 11px, 0.14em, centro): `PROBLEMA 10 — POR MACHADO DE ASSIS` / linha 2 em `#4a4843`: `ILUSTRAÇÃO BRASILEIRA, 1877`.
- Tabuleiro 8×8, casas 54px, moldura `outline 1px #55524d`. Casas: clara `#bab7b1`, escura `#918e88` (escura quando `(fileIndex + rank) % 2 === 1`, com a8 clara).
- Peças em glifos Unicode preenchidos (♚♛♝♞♟) em serifa, 36px: brancas `#f6f3ec` com `text-shadow 0 0 2px rgba(0,0,0,.3)`, pretas `#1d1b18`.
- Linha de status abaixo (mono 11px, `#3a3833`, centrado, max-width 440px).
- Casa selecionada: `box-shadow: inset 0 0 0 2px #8c2f1f`.

**Posição (FEN):** `4B1KQ/1p2k2N/1P2p3/2Pp1p2/3P1P2/8/1n6/8 w - - 0 1`
- Brancas: Rg8, Dh8, Be8, Ch7, peões b6, c5, d4, f4.
- Pretas: Re7, Cb2, peões b7, e6, d5, f5.

**Máquina de estados do puzzle:**
- `stage 1` — msg inicial: "as brancas jogam e dão mate em dois lances. jogue os dois lances das brancas para abrir o rizoma."
  - Seleção: clique em peça branca seleciona; clique na mesma casa desseleciona; clique em outra peça branca re-seleciona.
  - Lance correto: **bispo e8 → b5** (`1.Bb5!`). Aplica o lance, msg "1.Bb5! — zugzwang. as pretas pensam…", e após ~1s as pretas respondem com UMA das 6 defesas reais, sorteada:
    - `1…Rd8` (Re7→d8) → mate exigido: **Rei g8→f7** (`2.Rf7#`, mate por descoberta da dama de h8 na 8ª fila)
    - `1…e5` (peão e6→e5), `1…Ca4`, `1…Cc4`, `1…Cd3`, `1…Cd1` (cavalo b2) → mate exigido: **Dama h8→f6** (`2.Df6#`)
  - Qualquer outro destino: msg "não é o lance-chave. procure o lance quieto que deixa as pretas sem defesa." e desseleciona.
- `stage 2` — msg: "1…<lance> — agora dê o mate."
  - Correto (conforme defesa sorteada acima): aplica, msg "2.Rf7# — mate por descoberta: a dama de h8 varre a oitava fila." ou "2.Df6# — mate." + " o rizoma se abre." Após ~1.6s: painel de xadrez fade-out, rizoma fade-in.
  - Errado: msg "não é mate. procure o lance que não deixa nenhuma saída."
- Resolvido = persistente na sessão: fechar e reabrir vai direto ao rizoma.
- Clique no fundo cinza (fora do tabuleiro/nós): fecha tudo, fragmentos remontam (`transform none`, opacity 1, transition .7s), painéis somem.

### Ato 3 — Rizoma de temas
- Camada absoluta cobrindo o frame, fade-in `.7s ease .25s`.
- 11 nós: educação (600,170), universidades (330,220), escolas (400,380), museus (860,180), cultura (760,300), escrita (620,420), política (400,540), memória (930,400), esquerda (250,450), xadrez (880,560), jazz (740,610). Coordenadas = posição do ponto (dot 8px, círculo preenchido `#22201d`); rótulo mono 11px letter-spacing 0.14em minúsculas ao lado.
- 17 arestas (linhas SVG 1px, repouso `#8e8b86`): edu–uni, edu–escolas, edu–cultura, edu–política, uni–escrita, escolas–política, museus–cultura, cultura–escrita, escrita–política, escrita–memória, museus–memória, cultura–memória, política–esquerda, escolas–esquerda, xadrez–jazz, jazz–escrita, xadrez–política.
- **Hover num nó:** arestas conectadas ficam `#8c2f1f` (demais opacity .2); nós conectados opacity 1, demais .22. Mouseleave: tudo volta.
- Futuro (produção): cada nó vira link para a listagem do acervo filtrada pelo tema.

## State Management
- `open` (retrato/aberto), `stage` (1|2), `mateWith` ('K'|'Q'), `solved` (bool, sessão), `sel` (casa selecionada), `pieces` (mapa casa→peça), `msg` (status).
- Sem fetch; tudo local. Em produção, o acervo/rizoma pode vir de um JSON/CMS.

## Design Tokens
- Fundo página: `#a9a7a2` · tinta: `#22201d` / `#1d1b18` · secundário mono: `#4a4843`, `#3a3833` · papel (outlines das fotos): `#f5f2eb` · casas do tabuleiro: `#bab7b1` / `#918e88` · moldura: `#55524d` · fios em repouso: `#8e8b86` · **acento único: `#8c2f1f`** (carmim — seleção no tabuleiro e constelação acesa).
- Tipografia: serifa **EB Garamond** (se precisar de serifa em outras páginas); utilitária **IBM Plex Mono** (11–12px, letter-spacing 0.1–0.14em) para tudo que é aparato: links, títulos do problema, status, rótulos do rizoma. Máximo 2 famílias.
- Sem sombras, sem cantos arredondados, sem gradientes.

## Interações — resumo de timing
- Repulsão dos tiles: transform .35s ease-out.
- Explosão: .8s cubic-bezier(.4,0,.7,1); remontagem: .7s cubic-bezier(.2,.6,.2,1).
- Fades de painéis: .6–.7s com delay ~.3s.
- Resposta das pretas: ~1s após 1.Bb5; abertura do rizoma: ~1.6s após o mate.

## Acessibilidade / produção (recomendações)
- Fallback sem hover (touch): no mobile, tap na cabeça já abre o portão; tiles podem pular a repulsão.
- `prefers-reduced-motion`: desabilitar repulsão e usar fades simples.
- Os links "acervo"/"contato" devem funcionar sempre, independentemente do puzzle (o puzzle guarda só o rizoma, nunca o conteúdo institucional).
- Título/`<h1>` visualmente oculto com o nome do autor para SEO/leitores de tela.

## Assets
- `IMG_2790.png` — retrato base (1024×1024), fornecido pelo autor.
- `problema10.png` — reprodução do diagrama original (Fundação Biblioteca Nacional), apenas referência histórica; o tabuleiro é renderizado em código.
- Glifos de xadrez: Unicode (sem imagens).

## Files
- `Homepage Direções.dc.html` — protótipo completo (implementar a opção `7a`; o JS relevante está na classe `Component`: handlers `onScatter`, `onHeadClick`, `cellClick`, `onWeb`).
- `IMG_2790.png`, `problema10.png`.
