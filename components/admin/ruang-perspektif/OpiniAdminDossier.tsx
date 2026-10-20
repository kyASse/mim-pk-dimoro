import { OpiniPerspektif } from "@/lib/types/ruang-perspektif";
import { User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Data Property Invariance: DO NOT put icons on individual key-value rows
export default function OpiniAdminDossier({
  opini,
  whatsappUrl,
}: {
  opini: OpiniPerspektif;
  whatsappUrl: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-5">
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <User className="size-5 text-primary" />
        <h3 className="font-bold text-sm text-foreground">Dossier Penulis</h3>
      </div>

      <div className="space-y-3 text-xs sm:text-sm">
        <div>
          <span className="text-muted-foreground block text-[11px]">Nama Lengkap</span>
          <span className="font-semibold text-foreground">{opini.nama_penulis}</span>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px]">Peran</span>
          <span className="font-medium text-foreground capitalize">
            {opini.peran_penulis.replace("_", " ")}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px]">Keterangan Peran</span>
          <span className="text-foreground">{opini.keterangan_peran || "-"}</span>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px]">Nomor WhatsApp</span>
          <span className="text-foreground">{opini.kontak_wa}</span>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px]">Email</span>
          <span className="text-foreground">{opini.email || "-"}</span>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px]">Tanggal Masuk</span>
          <span className="text-foreground">
            {new Date(opini.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="hidden lg:block pt-3 border-t border-border/50">
        <Button asChild variant="outline" className="w-full text-xs gap-1.5 h-9">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4 text-emerald-600" /> Sapa via WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
