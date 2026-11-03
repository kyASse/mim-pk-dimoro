// app/admin/kalender/edit/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ChevronRight, Home } from "lucide-react";
import EditKegiatanForm from "./EditKegiatanForm";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Edit Kegiatan Akademik | Admin MIM PK Dimoro",
  description: "Formulir pembaruan data agenda kalender akademik madrasah",
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditKegiatanPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return redirect('/auth/login');
    }

    const kegiatanId = parseInt(id);
    if (isNaN(kegiatanId)) {
        return notFound();
    }

    const { data: kegiatan, error } = await supabase
        .from('kalender_akademik')
        .select('*')
        .eq('id', kegiatanId)
        .single();

    if (error || !kegiatan) {
        return notFound();
    }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 pb-28 lg:pb-8">
            {/* Top Breadcrumb Navigation */}
            <div className="flex items-center justify-between gap-4">
                <nav className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/60">
                    <Link href="/admin" className="hover:text-foreground transition-colors flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" />
                        <span>Dasbor</span>
                    </Link>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                    <Link href="/admin/kalender" className="hover:text-foreground transition-colors">
                        Kalender
                    </Link>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                    <span className="font-semibold text-foreground">Edit Kegiatan</span>
                </nav>

                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    <Link href="/admin/kalender" className="flex items-center gap-1.5">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Kalender</span>
                    </Link>
                </Button>
            </div>

            {/* Header Section */}
            <div className="space-y-1 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Edit Kegiatan Akademik
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Perbarui rincian jadwal, tanggal, dan informasi kegiatan kalender akademik madrasah.
                </p>
            </div>

            {/* Main Interactive Form with 2-Column Split & Live Preview */}
            <EditKegiatanForm kegiatan={kegiatan} />
        </div>
    );
}
