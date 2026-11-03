import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminOpinions } from "@/lib/services/ruang-perspektif";
import OpiniAdminTable from "@/components/admin/ruang-perspektif/OpiniAdminTable";

export const metadata: Metadata = {
  title: "Meja Redaksi Ruang Perspektif | Admin MIM PK Dimoro",
};

export const dynamic = "force-dynamic";

export default async function AdminRuangPerspektifPage() {
  const opinions = await getAdminOpinions();

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb Navigation & Public Link CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <span className="text-foreground font-medium">Ruang Perspektif</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Meja Redaksi Ruang Perspektif
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kurasi naskah opini, proofreading, dan publikasi gagasan komunitas madrasah
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 h-10 text-xs sm:h-9 self-start sm:self-auto rounded-xl shadow-xs"
        >
          <Link
            href="/ruang-perspektif"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
            <span>Lihat Halaman Publik</span>
          </Link>
        </Button>
      </div>

      {/* Main Interactive Table & Highlights */}
      <OpiniAdminTable items={opinions || []} />
    </div>
  );
}
