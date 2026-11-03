// app/admin/akademik/prestasi/edit/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, Home, Trophy } from "lucide-react";
import EditPrestasiForm from "./EditPrestasiForm";
import { SCHOOL_NAME } from "@/lib/school-config";

export const dynamic = "force-dynamic";

export const metadata = {
    title: `Edit Prestasi Siswa | Admin ${SCHOOL_NAME}`,
    description: "Perbarui data informasi dan dokumentasi prestasi siswa",
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPrestasiPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const prestasiId = parseInt(id, 10);

    if (isNaN(prestasiId)) {
        console.error("ID Prestasi tidak valid:", id);
        return redirect('/admin/akademik/prestasi');
    }

    const { data: prestasi, error } = await supabase
        .from('prestasi')
        .select('*')
        .eq('id', prestasiId)
        .single();
    
    if (error || !prestasi) {
        console.error('Error fetching prestasi:', error);
        return redirect('/admin/akademik/prestasi');
    }

    let imageUrl: string | null = null;
    if (prestasi.dokumentasi_url) {
        const { data } = supabase.storage
            .from('dokumentasi-prestasi')
            .getPublicUrl(prestasi.dokumentasi_url);
        imageUrl = data.publicUrl;
    }

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
                <Link
                    href="/admin/akademik"
                    className="hover:text-foreground transition-colors"
                >
                    Akademik
                </Link>
                <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                <Link
                    href="/admin/akademik/prestasi"
                    className="hover:text-foreground transition-colors"
                >
                    Prestasi Siswa
                </Link>
                <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                <span className="font-semibold text-foreground">Edit Prestasi</span>
            </nav>

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Trophy className="w-4 h-4" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Edit Prestasi Siswa
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Perbarui detail kejuaraan atau kelola foto dokumentasi piagam penghargaan.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 text-xs border-border hover:bg-muted text-foreground"
                    >
                        <Link href="/admin/akademik/prestasi">
                            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                            Kembali ke Daftar
                        </Link>
                    </Button>
                </div>
            </div>

            <EditPrestasiForm prestasi={prestasi} imageUrl={imageUrl} />
        </div>
    );
}
