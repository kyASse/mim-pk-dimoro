// app/admin/pendaftar/page.tsx
import { createClient } from "@/lib/supabase/server";
export const dynamic = 'force-dynamic';
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PendaftarTable from "@/components/admin/PendaftarTable";

export default async function KelolaPendaftarPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: pendaftar, error } = await supabase
        .from('pendaftar')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching pendaftar:', error);
        return (
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
                    <h2 className="font-semibold text-base">Gagal memuat data pendaftar</h2>
                    <p className="text-sm mt-1">Terjadi kesalahan saat mengambil data pendaftar dari server. Silakan coba lagi nanti.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Link href="/admin" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Dasbor Admin
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">Kelola Pendaftaran</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Kelola Calon Siswa Baru
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Pusat komando verifikasi, administrasi, dan pemantauan calon siswa baru MIM PK Dimoro
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild className="gap-1.5 shadow-sm">
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Dasbor
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Interactive Table & Command Center */}
            <PendaftarTable pendaftar={pendaftar || []} />
        </div>
    );
}