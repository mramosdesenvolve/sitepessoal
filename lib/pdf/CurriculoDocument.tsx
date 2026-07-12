import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ContentObject, ConceptNode, ObjectType } from "@/types";

/**
 * Currículo em PDF — deriva o cabeçalho/bio do mesmo texto usado em
 * /sobre (duplicado aqui por ora; se o texto mudar lá, atualizar aqui
 * também — candidato a virar uma fonte única depois que o formato do
 * PDF estiver validado). A lista de publicações vem direto do banco
 * (getObjects/getConcepts), sem duplicação.
 *
 * Fontes: só as 4 embutidas no PDF (Helvetica/Times/Courier) — sem
 * precisar registrar arquivo de fonte nenhum. Courier faz o papel do
 * monoespaçado "terminal" do site (labels, tags, cabeçalhos de seção);
 * Times-Roman faz o papel do serifado usado na prosa do /sobre. Fundo
 * branco de propósito — é um documento pra imprimir/anexar, não uma
 * réplica do terminal escuro.
 */

const ACCENT = "#1f6f5c";
const INK = "#18181b";
const MUTED = "#6b6b6b";
const LINE = "#d8d5cc";

const styles = StyleSheet.create({
  page: {
    paddingTop: 54,
    paddingBottom: 54,
    paddingHorizontal: 56,
    fontFamily: "Times-Roman",
    fontSize: 10.5,
    color: INK,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    marginBottom: 4,
  },
  tagline: {
    fontFamily: "Times-Italic",
    fontSize: 11,
    color: MUTED,
    marginBottom: 10,
    maxWidth: 420,
  },
  metaLine: {
    fontFamily: "Courier",
    fontSize: 8.5,
    color: INK,
    marginBottom: 3,
  },
  metaLabel: {
    color: ACCENT,
  },
  metaValue: {
    color: INK,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    marginTop: 14,
    marginBottom: 14,
  },
  sectionHeader: {
    fontFamily: "Courier-Bold",
    fontSize: 10,
    letterSpacing: 1,
    color: ACCENT,
    textTransform: "uppercase",
    marginTop: 18,
    marginBottom: 10,
  },
  paragraph: {
    fontFamily: "Times-Roman",
    fontSize: 10.5,
    lineHeight: 1.5,
    marginBottom: 9,
    color: INK,
  },
  subHeader: {
    fontFamily: "Courier-Bold",
    fontSize: 9,
    color: INK,
    marginTop: 12,
    marginBottom: 6,
  },
  entry: {
    marginBottom: 7,
  },
  entryTitle: {
    fontFamily: "Times-Bold",
    fontSize: 10.5,
    color: INK,
  },
  entryMeta: {
    fontFamily: "Courier",
    fontSize: 8,
    color: MUTED,
    marginTop: 1,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 56,
    right: 56,
    fontFamily: "Courier",
    fontSize: 7.5,
    color: MUTED,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 8,
  },
});

const BIO = {
  papel: [
    "Professor, pesquisador",
    "Consultor em Educação e Tecnologia",
    "Desenvolvedor",
  ],
  formacao: ["Dr. em Letras (UFES)", "Estudos Afro-Latino-Americanos (Harvard)"],
  email: "marcosramos.email@gmail.com",
  orcid: "https://orcid.org/0000-0003-3485-8462",
  intro:
    "Doutor em Letras, certificado em Estudos Afro-Latino-Americanos pela Universidade de Harvard, sou professor e pesquisador. Meus temas principais são literatura, educação e tecnologia. Atuo na pós-graduação com pesquisa e orientação de teses, e concomitantemente, no desenvolvimento de projetos e consultorias para instituições públicas, privadas e do terceiro setor.",
  trajetoria: [
    "Minha formação atravessa os estudos literários e as ciências humanas e sociais. Minha tese de doutorado, O Pacto na Mira do Ofá, investiga os temas como pensamento social brasileiro, tradição radical negra, imaginação radical, música e literatura.",
    "Fui professor visitante no Departamento de Literatura da Universidad Nacional de Colombia entre 2022 e 2025, e professor convidado em instituições como a Universidad de La Habana (Cuba), a Universidad Andina Simón Bolívar (Equador) e a Universidade Eduardo Mondlane (Moçambique). Organizo e curo o Ciclo Afro, iniciativa já em três edições — na Feira Internacional do Livro de Bogotá (FILBo), na Universidade Federal do Recôncavo da Bahia (UFRB) e em sua edição inicial —, articulando ministérios, prefeituras, universidades e instituições culturais em torno das artes e epistemologias das diásporas africanas.",
    "Em paralelo a essa trajetória, atuo também na gestão, no desenho e no desenvolvimento de tecnologias para instituições de ensino e cultura: apoio processos de desenvolvimento institucional e o desenho de soluções — aplicações e softwares — voltadas a esse setor. São duas inscrições profundas e simultâneas: uma na pesquisa; outra na gestão e na tecnologia.",
  ],
};

/** Ordem e rótulo de exibição de cada tipo — só entram seções que
 * tiverem pelo menos um objeto. */
const TYPE_LABELS: Record<ObjectType, string> = {
  livro: "Livros",
  artigo: "Artigos",
  paper: "Papers",
  ensaio: "Ensaios",
  palestra: "Palestras",
  podcast: "Podcasts",
  metodologia: "Metodologias",
  projeto: "Projetos",
  software: "Softwares",
  ferramenta: "Ferramentas",
  consultoria: "Consultorias",
  curso: "Cursos",
  curriculo: "Currículo",
};
const TYPE_ORDER: ObjectType[] = [
  "livro",
  "artigo",
  "paper",
  "ensaio",
  "palestra",
  "podcast",
  "metodologia",
  "projeto",
  "software",
  "ferramenta",
  "consultoria",
  "curso",
  "curriculo",
];

interface CurriculoDocumentProps {
  objects: ContentObject[];
  concepts: ConceptNode[];
}

export function CurriculoDocument({ objects, concepts }: CurriculoDocumentProps) {
  const conceptLabel = new Map(concepts.map((c) => [c.id, c.label]));
  const published = objects.filter((o) => o.status === "publicado");

  const byType = new Map<ObjectType, ContentObject[]>();
  for (const o of published) {
    if (!byType.has(o.type)) byType.set(o.type, []);
    byType.get(o.type)!.push(o);
  }
  for (const list of Array.from(byType.values())) {
    list.sort((a, b) => b.year - a.year);
  }

  return (
    <Document title="Marcos Ramos — Currículo">
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>Marcos Ramos</Text>
        <Text style={styles.tagline}>
          Investigo como a educação e a tecnologia podem produzir novas
          formas de imaginar o mundo.
        </Text>

        <Text style={styles.metaLine}>
          <Text style={styles.metaLabel}>papel: </Text>
          <Text style={styles.metaValue}>{BIO.papel.join(" | ")}</Text>
        </Text>
        <Text style={styles.metaLine}>
          <Text style={styles.metaLabel}>formação: </Text>
          <Text style={styles.metaValue}>{BIO.formacao.join(" | ")}</Text>
        </Text>
        <Text style={styles.metaLine}>
          <Text style={styles.metaLabel}>contato: </Text>
          <Link src={`mailto:${BIO.email}`} style={styles.metaValue}>
            {BIO.email}
          </Link>
          <Text style={styles.metaValue}> · </Text>
          <Link src={BIO.orcid} style={styles.metaValue}>
            ORCID
          </Link>
        </Text>

        <View style={styles.divider} />

        <Text style={styles.paragraph}>{BIO.intro}</Text>

        <Text style={styles.sectionHeader}># Trajetória</Text>
        {BIO.trajetoria.map((p, i) => (
          <Text key={i} style={styles.paragraph}>
            {p}
          </Text>
        ))}

        <Text style={styles.sectionHeader} break>
          # Publicações
        </Text>

        {TYPE_ORDER.filter((t) => byType.has(t)).map((type) => (
          <View key={type}>
            <Text style={styles.subHeader}>
              {TYPE_LABELS[type]} ({byType.get(type)!.length})
            </Text>
            {byType.get(type)!.map((o) => {
              const keywords = o.concepts
                .map((cid) => conceptLabel.get(cid) ?? cid)
                .join(", ");
              return (
                <View key={o.id} style={styles.entry} wrap={false}>
                  <Text style={styles.entryTitle}>{o.title}</Text>
                  <Text style={styles.entryMeta}>
                    {o.year}
                    {keywords ? `  ·  ${keywords}` : ""}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Marcos Ramos · marcosramos.xyz · gerado em ${new Date().toLocaleDateString(
              "pt-BR"
            )} · página ${pageNumber}/${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
