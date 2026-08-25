"use client";

import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendaftarDocumentCardProps {
  documentUrl?: string | null;
}

export default function PendaftarDocumentCard({
  documentUrl,
}: PendaftarDocumentCardProps) {
  if (!documentUrl) {
    return (
      <div className="py-8 px-4 rounded-xl border border-dashed border-border/80 text-center text-xs text-muted-foreground/80 space-y-1.5 bg-muted/10">
        <FileText className="h-6 w-6 mx-auto text-muted-foreground/50" />
        <p className="font-medium text-foreground/80">
          Tidak ada dokumen lampiran
        </p>
        <p className="text-[11px] text-muted-foreground">
          Pendaftar tidak mengunggah berkas lampiran saat pendaftaran online.
        </p>
      </div>
    );
  }

  const finalUrl = documentUrl.startsWith("http")
    ? documentUrl
    : `/api/dokumen/download?path=${encodeURIComponent(documentUrl)}`;

  return (
    <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-muted border border-border/70 flex items-center justify-center text-foreground/80 shrink-0">
          <FileText className="h-4 w-4" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            Dokumen Lampiran Pendaftar
          </p>
          <p className="text-[11px] text-muted-foreground">
            Akta Kelahiran / Kartu Keluarga / Surat Keterangan
          </p>
        </div>
      </div>

      <a
        href={finalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-2xs transition-colors shrink-0"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Buka / Unduh Berkas</span>
        <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
      </a>
    </div>
  );
}
