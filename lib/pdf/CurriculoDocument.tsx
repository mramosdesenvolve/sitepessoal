import path from "path";
import {
  Document,
  Font,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ContentObject, ConceptNode, ObjectType } from "@/types";

/**
 * Currículo em PDF, no mesmo sistema visual do site (ID Pessoal): Jost em
 * voz de cartaz para o nome, Archivo para títulos e texto, IBM Plex Mono
 * para dados; preto, branco e um vermelho; fio de 1px em vez de caixa ou
 * sombra. O fundo é branco (e não o papel do site) porque é um documento
 * para imprimir e anexar.
 *
 * O cabeçalho/bio repete o texto de /sobre (duplicado aqui — se mudar lá,
 * atualizar aqui também). A lista de publicações vem direto do banco
 * (getObjects/getConcepts), sem duplicação.
 *
 * Fontes: arquivos estáticos em lib/pdf/fonts (ver LEIA-ME.md de lá). O
 * next.config.mjs inclui essa pasta no pacote da rota /api/curriculo.
 */

const FONTS_DIR = path.join(process.cwd(), "lib", "pdf", "fonts");
const font = (file: string) => path.join(FONTS_DIR, file);

Font.register({ family: "Jost", src: font("jost-latin-700-normal.ttf"), fontWeight: 700 });
Font.register({
  family: "Archivo",
  fonts: [
    { src: font("archivo-latin-400-normal.ttf"), fontWeight: 400 },
    { src: font("archivo-latin-400-italic.ttf"), fontWeight: 400, fontStyle: "italic" },
    { src: font("archivo-latin-600-normal.ttf"), fontWeight: 600 },
  ],
});
Font.register({ family: "Plex Mono", src: font("ibm-plex-mono-latin-400-normal.ttf") });
// sem hifenização automática (as regras embutidas são do inglês)
Font.registerHyphenationCallback((word) => [word]);

const INK = "#0b0b0b";
const RED = "#e2231a"; // sinal: tipo grande
const GRAY = "#6b6a66";
const HAIR = "#d6d5d1";

const MARGIN = 48;
const LABEL_COL = 96;

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 60,
    paddingHorizontal: MARGIN,
    fontFamily: "Archivo",
    fontSize: 10,
    lineHeight: 1.45,
    color: INK,
  },
  data: {
    fontFamily: "Plex Mono",
    fontSize: 8,
    lineHeight: 1.4,
    color: GRAY,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  name: {
    fontFamily: "Jost",
    fontWeight: 700,
    fontSize: 58,
    lineHeight: 0.92,
    letterSpacing: -1.2,
    marginBottom: 22,
  },
  phrase: {
    fontSize: 15,
    lineHeight: 1.25,
    letterSpacing: -0.2,
    maxWidth: 380,
    marginBottom: 26,
  },
  phraseKey: {
    color: RED,
  },
  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: INK,
    paddingVertical: 9,
  },
  rowLabel: {
    width: LABEL_COL,
    fontWeight: 600,
  },
  rowValue: {
    flex: 1,
  },
  link: {
    color: INK,
    textDecoration: "none",
  },
  intro: {
    borderTopWidth: 1,
    borderTopColor: INK,
    paddingTop: 16,
    fontSize: 12.5,
    lineHeight: 1.4,
    letterSpacing: -0.1,
  },
  sectionLabel: {
    marginTop: 24,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: HAIR,
    fontWeight: 600,
    fontSize: 12,
    marginBottom: 8,
  },
  paragraph: {
    maxWidth: 400,
    marginBottom: 9,
  },
  title: {
    fontSize: 34,
    lineHeight: 1.04,
    letterSpacing: -0.9,
    color: RED,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 22,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: INK,
  },
  chartCol: {
    flex: 1,
    flexDirection: "column-reverse",
    paddingHorizontal: 1,
    paddingBottom: 1,
  },
  chartMark: {
    height: 3.4,
    marginTop: 1,
    backgroundColor: INK,
  },
  chartAxis: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 6,
  },
  chartYear: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Plex Mono",
    fontSize: 6.5,
    color: GRAY,
  },
  typeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 22,
    paddingTop: 8,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: INK,
  },
  typeLabel: {
    fontWeight: 600,
    fontSize: 12,
  },
  entry: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: HAIR,
    paddingVertical: 6,
  },
  entryYear: {
    width: 44,
    fontFamily: "Plex Mono",
    fontSize: 8.5,
    color: GRAY,
    paddingTop: 1,
  },
  entryBody: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 10.5,
    lineHeight: 1.3,
  },
  entryConcepts: {
    fontSize: 8.5,
    lineHeight: 1.35,
    color: GRAY,
    marginTop: 1.5,
  },
  footerRule: {
    position: "absolute",
    bottom: 44,
    left: MARGIN,
    right: MARGIN,
    borderTopWidth: 1,
    borderTopColor: HAIR,
  },
  footerSite: {
    position: "absolute",
    bottom: 26,
    left: MARGIN,
    right: MARGIN,
    fontFamily: "Plex Mono",
    fontSize: 8,
    color: GRAY,
  },
});

const SITE = "marcosramos.base73.com.br";
const PHRASE_LEAD = "Estudo como a literatura pode produzir novas formas de ";
const PHRASE_KEY = "imaginar o mundo";

const BIO = {
  papel: [
    "Professor, pesquisador",
    "Consultor em Educação e Tecnologia",
  ],
  formacao: ["Dr. em Letras (UFES)", "Estudos Afro-Latino-Americanos (Harvard)"],
  email: "marcosramos.email@gmail.com",
  orcid: "https://orcid.org/0000-0003-3485-8462",
  intro:
    "Marcos Ramos é professor e pesquisador, doutor em Letras, com estudos sobre literatura e pensamento social brasileiro.",
  trajetoria: [
    "Sua tese de doutorado, O Pacto na Mira do Ofá, investiga esse campo a partir da tradição radical negra, da imaginação radical, da música e da literatura. Certificado em Estudos Afro-Latino-Americanos pela Universidade de Harvard, foi bolsista do Instituto Guimarães Rosa, do Ministério das Relações Exteriores, e professor visitante no Departamento de Literatura da Universidad Nacional de Colombia entre 2022 e 2025. Deu cursos e conferências como professor convidado na Universidad de La Habana (Cuba), na Universidad Andina Simón Bolívar (Equador), na Universidade Eduardo Mondlane (Moçambique), entre outras. Organiza e cura o Ciclo Afro (cicloafro.com.br).",
    "Atualmente é Especialista em Educação da Cápsula de Inovação do Senac Rio de Janeiro e consultor de instituições públicas, privadas e do terceiro setor em temas como gestão, tecnologia, cultura e educação.",
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
  sistema: "Sistemas",
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
  "sistema",
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

  // cronologia: a mesma do panorama da capa do site, uma marca por objeto
  const allYears = published.map((o) => o.year);
  const firstYear = Math.min(...allYears);
  const lastYear = Math.max(...allYears);
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i);
  const countByYear = new Map<number, number>();
  for (const y of allYears) countByYear.set(y, (countByYear.get(y) ?? 0) + 1);

  const generatedAt = new Date().toLocaleDateString("pt-BR");

  return (
    <Document title="Marcos Ramos — Currículo" author="Marcos Ramos" language="pt-BR">
      <Page size="A4" style={styles.page}>
        <View style={styles.topRow}>
          <Text style={styles.data}>currículo</Text>
          <Text style={styles.data}>gerado em {generatedAt}</Text>
        </View>

        <Text style={styles.name}>marcos ramos</Text>
        <Text style={styles.phrase}>
          {PHRASE_LEAD}
          <Text style={styles.phraseKey}>{PHRASE_KEY}</Text>.
        </Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>papel</Text>
          <Text style={styles.rowValue}>{BIO.papel.join(" · ")}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>formação</Text>
          <Text style={styles.rowValue}>{BIO.formacao.join(" · ")}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>contato</Text>
          <Text style={styles.rowValue}>
            <Link src={`mailto:${BIO.email}`} style={styles.link}>
              {BIO.email}
            </Link>
            {" · "}
            <Link src={BIO.orcid} style={styles.link}>
              {BIO.orcid.replace("https://", "")}
            </Link>
            {" · "}
            <Link src={`https://${SITE}`} style={styles.link}>
              {SITE}
            </Link>
          </Text>
        </View>

        <Text style={styles.intro}>{BIO.intro}</Text>

        <Text style={styles.sectionLabel}>trajetória</Text>
        {BIO.trajetoria.map((p, i) => (
          <Text key={i} style={styles.paragraph}>
            {p}
          </Text>
        ))}

        <View style={styles.titleRow} break>
          <Text style={styles.title}>publicações</Text>
          <Text style={styles.data}>
            {published.length} objetos · {firstYear}–{lastYear}
          </Text>
        </View>

        <View style={styles.chart}>
          {years.map((year) => (
            <View key={year} style={styles.chartCol}>
              {Array.from({ length: countByYear.get(year) ?? 0 }, (_, i) => (
                <View key={i} style={styles.chartMark} />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.chartAxis}>
          {years.map((year) => (
            <Text key={year} style={styles.chartYear}>
              {year}
            </Text>
          ))}
        </View>

        {TYPE_ORDER.filter((t) => byType.has(t)).map((type) => (
          <View key={type}>
            <View style={styles.typeHeader} minPresenceAhead={60} wrap={false}>
              <Text style={styles.typeLabel}>{TYPE_LABELS[type].toLowerCase()}</Text>
              <Text style={styles.data}>{byType.get(type)!.length}</Text>
            </View>
            {byType.get(type)!.map((o) => {
              const keywords = o.concepts
                .map((cid) => conceptLabel.get(cid) ?? cid)
                .join(" / ");
              return (
                <View key={o.id} style={styles.entry} wrap={false}>
                  <Text style={styles.entryYear}>{o.year}</Text>
                  <View style={styles.entryBody}>
                    <Text style={styles.entryTitle}>{o.title}</Text>
                    {keywords !== "" && (
                      <Text style={styles.entryConcepts}>{keywords}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        <View style={styles.footerRule} fixed />
        <Text style={styles.footerSite} fixed>
          {SITE}
        </Text>
      </Page>
    </Document>
  );
}
