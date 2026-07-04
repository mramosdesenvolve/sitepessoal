// Popula a tabela ContentObject com os ~20 objetos fictícios de
// data/objects.json — roda com `npx prisma db seed` (idempotente: usa
// upsert, então rodar de novo não duplica nada).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const objects = JSON.parse(
  readFileSync(path.join(__dirname, "../data/objects.json"), "utf-8")
);

async function main() {
  // deleteMany + createMany em vez de upsert por linha: idempotente do
  // mesmo jeito (pode rodar de novo à vontade), e evita um problema de
  // compatibilidade do driver com bancos Postgres específicos ao repetir
  // upserts em sequência dentro do mesmo processo.
  const ids = objects.map((o) => o.id);
  await prisma.contentObject.deleteMany({ where: { id: { in: ids } } });
  await prisma.contentObject.createMany({
    data: objects.map((o) => ({
      id: o.id,
      title: o.title,
      type: o.type,
      year: o.year,
      shortDescription: o.shortDescription,
      longDescription: o.longDescription,
      concepts: o.concepts,
      relatedObjectIds: o.relatedObjectIds,
      links: o.links ?? undefined,
      status: o.status,
      featured: o.featured,
    })),
  });
  console.log(`Seed concluída: ${objects.length} objetos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
