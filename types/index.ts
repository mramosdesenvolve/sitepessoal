export type ObjectType =
  | "artigo"
  | "paper"
  | "livro"
  | "palestra"
  | "projeto"
  | "curriculo"
  | "ferramenta"
  | "software"
  | "consultoria"
  | "ensaio"
  | "curso"
  | "metodologia";

export type ObjectStatus =
  | "publicado"
  | "em desenvolvimento"
  | "arquivado"
  | "prototipo";

export interface ContentObject {
  id: string;
  title: string;
  type: ObjectType;
  year: number;
  shortDescription: string;
  longDescription: string; // pode referenciar um arquivo MDX por id (content/<id>.mdx)
  concepts: string[]; // ids dos ConceptNode relacionados
  relatedObjectIds: string[];
  links?: { label: string; url: string }[];
  status: ObjectStatus;
  featured: boolean;
}

export interface ConceptNode {
  id: string;
  label: string;
  description?: string; // 1 frase, usada em tooltip
  objectIds: string[]; // objetos conectados a este conceito
}

/** Os três modos de navegação do site — consomem os mesmos dados. */
export type Mode = "explorar" | "ler" | "construir";

/** Tipos exibidos no modo Ler (leitura editorial). */
export const READ_TYPES: ObjectType[] = [
  "artigo",
  "ensaio",
  "paper",
  "livro",
  "palestra",
];

/** Tipos exibidos no modo Construir (arquivo de coisas aplicadas). */
export const BUILD_TYPES: ObjectType[] = [
  "ferramenta",
  "software",
  "curriculo",
  "metodologia",
  "consultoria",
  "projeto",
  "curso",
];
