import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";

import PDFViewer from "@/components/pdf-viewer";
import Datasheet from "@/components/datasheet";

export default async function DatasheetPage({
  params,
}: {
  params: { id: string };
}) {
  const id = +params.id;
  if (isNaN(id)) redirect("/404");

  const property = await db.property.findUnique({
    where: { id },
  });

  if (!property) redirect("/404");

  return (
    <PDFViewer
      datasheet={<Datasheet property={property} />}
      className="h-[calc(100vh_-_3.5rem)] w-full"
    />
  );
}
