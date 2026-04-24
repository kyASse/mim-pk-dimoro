import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/berita">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Berita</h1>
          <p className="text-gray-600">Perbarui informasi berita: {berita.judul}</p>
        </div>
      </div>

      {/* Form */}
      <EditForm berita={berita} />
    </div>
  );
}