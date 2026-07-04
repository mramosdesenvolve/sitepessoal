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
