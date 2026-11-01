// app/admin/akademik/prestasi/tambah/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ChevronRight, Home, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import TambahPrestasiForm from "./TambahPrestasiForm";
import { SCHOOL_NAME } from "@/lib/school-config";

export const dynamic = "force-dynamic";

export const metadata = {
    title: `Tambah Prestasi Siswa | Admin ${SCHOOL_NAME}`,
    description: "Formulir pencatatan prestasi dan kejuaraan santri madrasah",
};

export default async function TambahPrestasiPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return redirect("/auth/login");

    const currentYear = new Date().getFullYear();

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
                <span className="font-semibold text-foreground">Tambah Prestasi</span>
            </nav>

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Trophy className="w-4 h-4" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Tambah Prestasi Siswa
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Tambahkan rekam jejak capaian lomba atau penghargaan santri baru disertai foto dokumentasi.
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

            {/* Form Component with 2-Column Live Preview */}
            <TambahPrestasiForm defaultYear={currentYear} />
        </div>
    );
}
