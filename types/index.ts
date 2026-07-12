export type ObjectType =
  | "artigo"
  | "paper"
  | "livro"
  | "palestra"
  | "podcast"
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

/** Arrays de valor (não só tipo) para popular <select> no formulário do admin. */
export const OBJECT_TYPES: ObjectType[] = [
  "artigo",
  "paper",
  "livro",
  "palestra",
  "podcast",
  "projeto",
  "curriculo",
  "ferramenta",
  "software",
  "consultoria",
  "ensaio",
  "curso",
  "metodologia",
];

export const OBJECT_STATUSES: ObjectStatus[] = [
  "publicado",
  "em desenvolvimento",
  "arquivado",
  "prototipo",
];

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
  createdAt: Date;
}

export interface ConceptNode {
  id: string;
  label: string;
  description?: string; // 1 frase, usada em tooltip
  objectIds: string[]; // objetos conectados a este conceito
}
