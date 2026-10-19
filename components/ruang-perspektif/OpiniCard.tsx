import Link from "next/link";
import { OpiniPublicItem } from "@/lib/types/ruang-perspektif";
import { Clock, User } from "lucide-react";

export default function OpiniCard({ item }: { item: OpiniPublicItem }) {
  const peranLabelMap: Record<string, string> = {
    guru: "Guru & Tendik",
    wali_murid: "Wali Murid",
    alumni: "Alumni",
    umum: "Pemerhati",
  };

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-border/50 bg-card/60 p-5 sm:p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {item.kategori}
          </span>
          <span className="inline-flex items-center text-xs text-muted-foreground gap-1">
            <Clock className="size-3.5" />
            {item.waktu_baca_menit} mnt baca
          </span>
        </div>

        <Link href={`/ruang-perspektif/${item.slug}`} className="block">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2 leading-snug mb-2">
            {item.judul}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
            {item.ringkasan}
          </p>
        </Link>
      </div>

      <div className="pt-4 border-t border-border/40 flex items-center gap-3">
        {item.foto_penulis_url ? (
          <img
            src={item.foto_penulis_url}
            alt={item.nama_penulis}
            className="size-9 rounded-full object-cover border border-border/60"
          />
        ) : (
          <div className="size-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border/40">
            <User className="size-4" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">{item.nama_penulis}</p>
          <p className="text-xs text-muted-foreground truncate">
            {item.keterangan_peran || peranLabelMap[item.peran_penulis]}
          </p>
        </div>
      </div>
    </article>
  );
}
