import { renderToBuffer } from "@react-pdf/renderer";
import { getConcepts, getObjects } from "@/lib/data";
import { CurriculoDocument } from "@/lib/pdf/CurriculoDocument";

export const dynamic = "force-dynamic";

export async function GET() {
  const [objects, concepts] = await Promise.all([getObjects(), getConcepts()]);

  const buffer = await renderToBuffer(
    CurriculoDocument({ objects, concepts })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="marcos-ramos-curriculo.pdf"',
    },
  });
}
