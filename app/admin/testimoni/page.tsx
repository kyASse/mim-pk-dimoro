import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TestimoniAdminHub from '@/components/admin/testimoni/TestimoniAdminHub';
import type { TestimoniItem } from '@/components/admin/testimoni/TestimoniCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Manajemen Testimoni | Admin MIM PK Dimoro',
    description: 'Kelola testimoni dan apresiasi orang tua siswa MIM PK Dimoro',
};

export default async function KelolaTestimoniPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return redirect('/auth/login');
    }

    const { data: testimoni, error } = await supabase
        .from('testimoni')
        .select('id, nama_orang_tua, status_orang_tua, is_featured, isi_testimoni, created_at, created_by')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching testimoni:', error);
        return (
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
                    <h2 className="font-semibold text-base">Gagal memuat data testimoni</h2>
                    <p className="text-sm mt-1">
                        Terjadi kesalahan saat mengambil data testimoni dari server: {error.message}
                    </p>
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
                        <span className="text-foreground font-medium">Testimoni</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Manajemen Testimoni & Aspirasi
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Kelola testimoni dan apresiasi orang tua siswa untuk dipublikasikan pada halaman utama madrasah
                    </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                    <Button
                        variant="outline"
                        asChild
                        className="h-10 text-xs sm:h-9 rounded-xl border-border/80 flex-1 sm:flex-initial"
                    >
                        <Link href="/#testimoni" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                            Lihat di Beranda
                        </Link>
                    </Button>
                    <Button
                        asChild
                        className="h-10 text-xs sm:h-9 rounded-xl gap-1.5 flex-1 sm:flex-initial shadow-xs"
                    >
                        <Link href="/admin/testimoni/tambah">
                            <Plus className="w-4 h-4" />
                            <span>Tambah Testimoni</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Interactive Admin Hub (Metrics, Filters, Grid/Table Views) */}
            <TestimoniAdminHub initialTestimoni={(testimoni as TestimoniItem[]) || []} />
        </div>
    );
}
