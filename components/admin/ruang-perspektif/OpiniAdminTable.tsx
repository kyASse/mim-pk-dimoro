"use client";

import Link from "next/link";
import { OpiniPerspektif } from "@/lib/types/ruang-perspektif";
import { Star, Eye } from "lucide-react";
import { toggleFeaturedOpiniAction } from "@/app/admin/ruang-perspektif/actions";
import { toast } from "sonner";

export default function OpiniAdminTable({ items }: { items: OpiniPerspektif[] }) {
  const handleToggleFeatured = async (id: string, current: boolean) => {
    const res = await toggleFeaturedOpiniAction(id, !current);
    if (res.success) {
      toast.success(current ? "Dilepas dari sorotan" : "Dijadikan naskah sorotan");
    } else {
      toast.error(res.error || "Gagal mengubah sorotan");
    }
  };

  const statusBadge = (st: string) => {
    switch (st) {
      case "menunggu_kurasi":
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400">Menunggu Kurasi</span>;
      case "terbit":
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Terbit</span>;
      case "ditolak":
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400">Ditolak</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">Arsip</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile Card List */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {items.map((op) => (
          <div key={op.id} className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-primary">{op.kategori}</span>
              {statusBadge(op.status)}
            </div>
            <Link href={`/admin/ruang-perspektif/${op.id}`} className="block">
              <h4 className="font-bold text-sm text-foreground line-clamp-2">{op.judul}</h4>
            </Link>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>{op.nama_penulis}</span>
              <Link href={`/admin/ruang-perspektif/${op.id}`} className="text-primary font-semibold">
                Tinjau Naskah &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Data Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border/60 bg-card">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 text-muted-foreground border-b uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Judul & Kategori</th>
              <th className="py-3 px-4">Penulis</th>
              <th className="py-3 px-4">Tanggal Masuk</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Sorotan</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {items.map((op) => (
              <tr key={op.id} className="hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 max-w-xs">
                  <Link href={`/admin/ruang-perspektif/${op.id}`} className="font-bold text-foreground hover:text-primary line-clamp-1">
                    {op.judul}
                  </Link>
                  <span className="text-[11px] text-muted-foreground">{op.kategori}</span>
                </td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-foreground">{op.nama_penulis}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">{op.peran_penulis.replace("_", " ")}</p>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {new Date(op.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="py-3 px-4">{statusBadge(op.status)}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleToggleFeatured(op.id, op.is_featured)}
                    className="p-1 text-muted-foreground hover:text-amber-500 transition-colors"
                  >
                    <Star className={`size-4 ${op.is_featured ? "fill-amber-500 text-amber-500" : ""}`} />
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/admin/ruang-perspektif/${op.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted text-foreground font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Eye className="size-3.5" /> Tinjau
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
