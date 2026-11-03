// app/admin/kalender/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, ExternalLink, ChevronRight, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import KalenderManagement, { type KegiatanAkademik } from "@/components/admin/kalender/KalenderManagement";
import { SCHOOL_NAME } from "@/lib/school-config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manajemen Kalender Akademik | Admin MIM PK Dimoro",
  description: "Kelola agenda, kegiatan belajar, dan kalender pendidikan madrasah",
};

export default async function KelolaKalenderPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: kegiatanData, error } = await supabase
        .from('kalender_akademik')
        .select('*')
        .order('tanggal', { ascending: true });

    if (error) {
        console.error('Error fetching kalender akademik:', error);
    }

    const kegiatan: KegiatanAkademik[] = (kegiatanData as KegiatanAkademik[]) || [];

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
            {/* Top Breadcrumbs & Back Navigation */}
            <div className="flex items-center justify-between gap-4">
                <nav className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/60">
                    <Link href="/admin" className="hover:text-foreground transition-colors flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" />
                        <span>Dasbor</span>
                    </Link>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                    <span className="font-semibold text-foreground">Kalender Akademik</span>
                </nav>

                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden sm:inline-flex"
                >
                    <Link href="/admin" className="flex items-center gap-1.5">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Dasbor</span>
                    </Link>
                </Button>
            </div>

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-border/60">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Manajemen Kalender Akademik
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola jadwal kegiatan, asesmen, hari libur, dan agenda penting {SCHOOL_NAME}
                    </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        asChild
                        className="flex-1 sm:flex-initial h-10 rounded-xl border-border/80 text-foreground hover:bg-muted text-xs sm:text-sm font-medium"
                    >
                        <Link href="/kalender-akademik" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1.5 text-muted-foreground" />
                            <span>Lihat Publik</span>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        className="flex-1 sm:flex-initial h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-semibold shadow-xs"
                    >
                        <Link href="/admin/kalender/tambah">
                            <Plus className="w-4 h-4 mr-1.5" />
                            <span>Tambah Kegiatan</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Main Interactive Management View */}
            <KalenderManagement initialKegiatan={kegiatan} />
        </div>
    );
}
