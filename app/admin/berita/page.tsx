import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BeritaTable, { BeritaItem } from "@/components/admin/berita/BeritaTable";
import { SCHOOL_NAME } from "@/lib/school-config";

export const dynamic = "force-dynamic";

export default async function KelolaBeritaPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect('/auth/login');
    }

    const { data: berita, error } = await supabase
        .from('berita')
        .select('id, judul, ringkasan, tanggal_terbit, image_url, status')
        .order('tanggal_terbit', { ascending: false });

    if (error) {
        console.error('Error fetching berita:', error);
        return (
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
                    <h2 className="font-semibold text-base">Gagal memuat data berita</h2>
                    <p className="text-sm mt-1">Terjadi kesalahan saat mengambil data berita dari server. Cek konsol untuk detail.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
            {/* Header Section with Breadcrumbs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <Link
                            href="/admin"
                            className="hover:text-foreground transition-colors flex items-center gap-1"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            <span>Dasbor</span>
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">Berita</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Kelola Berita & Artikel
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Pusat publikasi informasi, kegiatan, dan pengumuman sekolah {SCHOOL_NAME}
                    </p>
                </div>

                <Button asChild className="gap-2 shadow-xs h-10 text-sm sm:h-9 sm:text-xs">
                    <Link href="/admin/berita/tambah">
                        <Plus className="w-4 h-4" />
                        Tambah Berita Baru
                    </Link>
                </Button>
            </div>

            {/* Interactive Table with Metric Cards & Filter */}
            <BeritaTable berita={(berita as BeritaItem[]) || []} />
        </div>
    );
}
