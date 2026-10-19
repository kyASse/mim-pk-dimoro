import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminOpinionById } from "@/lib/services/ruang-perspektif";
import { generateWhatsAppUrl } from "@/lib/utils/ruang-perspektif";
import { SCHOOL_DOMAIN } from "@/lib/school-config";
import OpiniAdminDossier from "@/components/admin/ruang-perspektif/OpiniAdminDossier";
import OpiniAdminEditor from "@/components/admin/ruang-perspektif/OpiniAdminEditor";
import OpiniDetailActionWrapper from "@/components/admin/ruang-perspektif/OpiniDetailActionWrapper";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Telaah Naskah Opini | Admin MIM PK Dimoro",
};

export default async function AdminOpiniDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opini = await getAdminOpinionById(id);

  if (!opini) {
    notFound();
  }

  const articleUrl = `${SCHOOL_DOMAIN}/ruang-perspektif/${opini.slug}`;
  const whatsappUrl = generateWhatsAppUrl({
    phone: opini.kontak_wa,
    namaPenulis: opini.nama_penulis,
    judul: opini.judul,
    status: (opini.status as any) === "ditolak" ? "ditolak" : "terbit",
    urlArtikel: articleUrl,
    catatanRedaksi: opini.catatan_redaksi || "",
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/ruang-perspektif" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Kembali ke Meja Redaksi
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <OpiniAdminEditor opini={opini} />
        </div>
        <div className="space-y-6">
          <OpiniAdminDossier opini={opini} whatsappUrl={whatsappUrl} />
          <OpiniDetailActionWrapper opiniId={opini.id} status={opini.status} whatsappUrl={whatsappUrl} />
        </div>
      </div>
    </div>
  );
}
