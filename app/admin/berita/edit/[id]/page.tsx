import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditForm from "../EditForm";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBeritaPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const beritaId = parseInt(id, 10);

  if (isNaN(beritaId)) {
    console.error("ID Berita tidak valid:", id);
    return redirect("/admin/berita");
  }

  const { data: berita, error } = await supabase
    .from("berita")
    .select("*")
    .eq("id", beritaId)
    .single();

  if (error || !berita) {
    console.error("Gagal menemukan berita dengan ID:", beritaId, error);
    return redirect("/admin/berita");
  }

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb Back Navigation */}
      <div className="space-y-1.5 sm:space-y-2">
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group w-fit -ml-1 px-2 py-1 rounded-md hover:bg-muted/60"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Kelola Berita</span>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Edit Berita
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Perbarui informasi berita: {berita.judul}
          </p>
        </div>
      </div>

      {/* Form */}
      <EditForm berita={berita} />
    </div>
  );
}