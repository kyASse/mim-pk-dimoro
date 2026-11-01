// app/admin/akademik/prestasi/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, ChevronRight, Home, ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrestasiManagement, { type PrestasiItem } from "@/components/admin/akademik/prestasi/PrestasiManagement";
import { SCHOOL_NAME } from "@/lib/school-config";

export const dynamic = "force-dynamic";

export const metadata = {
    title: `Prestasi Siswa | Admin ${SCHOOL_NAME}`,
    description: "Kelola rekam jejak prestasi, kejuaraan lomba, dan penghargaan santri madrasah",
};

export default async function AdminPrestasiPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return redirect("/auth/login");

    const { data: prestasiData, error } = await supabase
        .from("prestasi")
        .select("*")
        .order("tahun", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching prestasi:", error);
    }

    const items: PrestasiItem[] = (prestasiData || []).map((row) => ({
        id: row.id,
        tahun: row.tahun,
        nama_prestasi: row.nama_prestasi,
        tingkat: row.tingkat,
        nama_siswa: row.nama_siswa,
        deskripsi: row.deskripsi,
        dokumentasi_url: row.dokumentasi_url,
        created_at: row.created_at,
    }));

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Breadcrumb Navigation */}
            <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                    <Home className="w-3.5 h-3.5" />
                    <span>Dasbor</span>
                </Link>
                <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                <span className="text-muted-foreground">Akademik</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                <span className="font-semibold text-foreground">Prestasi Siswa</span>
            </nav>

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Trophy className="w-4 h-4" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Prestasi & Kejuaraan
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Kelola rekam jejak capaian penghargaan, medali, dan kejuaraan santri {SCHOOL_NAME}.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 text-xs border-border hover:bg-muted text-foreground"
                    >
                        <Link href="/admin">
                            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                            Dasbor
                        </Link>
                    </Button>

                    <Button
                        asChild
                        size="sm"
                        className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                    >
                        <Link href="/admin/akademik/prestasi/tambah">
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            Tambah Prestasi
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Management Component (Metrics, Filter, Desktop Table & Mobile Cards) */}
            <PrestasiManagement
                initialData={items}
                currentYear={new Date().getFullYear()}
            />
        </div>
    );
}
