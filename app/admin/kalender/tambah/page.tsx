// app/admin/kalender/tambah/page.tsx
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ChevronRight, Home } from "lucide-react";
import TambahKegiatanForm from "./TambahKegiatanForm";

export const metadata = {
  title: "Tambah Kegiatan Akademik | Admin MIM PK Dimoro",
  description: "Formulir penambahan agenda kalender akademik madrasah",
};

export default function TambahKegiatanPage() {
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
                    <span className="font-semibold text-foreground">Tambah Kegiatan</span>
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
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Tambah Kegiatan Akademik
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Lengkapi rincian formulir di bawah ini untuk menerbitkan agenda baru ke dalam kalender akademik madrasah.
                </p>
            </div>

            {/* Main Interactive Form with 2-Column Split & Live Preview */}
            <TambahKegiatanForm />
        </div>
    );
}
