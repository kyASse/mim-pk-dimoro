"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  UserCheck, 
  Users, 
  Settings2, 
  Loader2, 
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateRombelWaliKelasAction } from "@/app/admin/siswa/actions";

export interface RombelItem {
  id: string;
  nama: string;
  tingkat: number;
  tahun_ajaran: string;
  wali_kelas_nama: string | null;
  kapasitas: number;
  siswaCount?: number;
}

interface MasterRombelGridProps {
  rombels: RombelItem[];
}

export default function MasterRombelGrid({ rombels }: MasterRombelGridProps) {
  const router = useRouter();
  const [selectedRombel, setSelectedRombel] = useState<RombelItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [waliKelasNama, setWaliKelasNama] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("2026/2027");
  const [kapasitas, setKapasitas] = useState(28);
  const [isPending, startTransition] = useTransition();

  const handleOpenEdit = (rombel: RombelItem) => {
    setSelectedRombel(rombel);
    setWaliKelasNama(rombel.wali_kelas_nama || "");
    setTahunAjaran(rombel.tahun_ajaran || "2026/2027");
    setKapasitas(rombel.kapasitas || 28);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRombel) return;

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("wali_kelas_nama", waliKelasNama);
        fd.append("tahun_ajaran", tahunAjaran);
        fd.append("kapasitas", kapasitas.toString());

        const res = await updateRombelWaliKelasAction(selectedRombel.id, fd);
        if (res.success) {
          toast.success(`Data ${selectedRombel.nama} berhasil diperbarui`);
          setIsDialogOpen(false);
          router.refresh();
        } else {
          toast.error(res.message || "Gagal memperbarui rombel");
        }
      } catch (err: any) {
        toast.error(err?.message || "Terjadi kesalahan");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary shrink-0" />
            <span>Master Rombongan Belajar (Rombel)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar 12 rombel aktif (Kelas 1A s.d. 6B) beserta penetapan Guru Wali Kelas dan kapasitas daya tampung.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
        {rombels.map((rombel) => {
          const currentCount = rombel.siswaCount || 0;
          const maxCapacity = rombel.kapasitas || 28;
          const fillPercentage = Math.min(
            100,
            Math.round((currentCount / maxCapacity) * 100)
          );
          const isAlmostFull = fillPercentage >= 90;

          return (
            <Card
              key={rombel.id}
              className="border-border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <CardHeader className="pb-3 border-b border-border/40 space-y-1.5 p-4">
                <div className="flex items-center justify-between">
                  <Badge className="font-bold text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                    {rombel.nama}
                  </Badge>
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {rombel.tahun_ajaran}
                  </span>
                </div>
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5 pt-1">
                  <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    {rombel.wali_kelas_nama || "Wali Kelas Belum Diatur"}
                  </span>
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Tingkat {rombel.tingkat} Madrasah Ibtidaiyah
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-3 pb-3 space-y-3">
                {/* Capacity Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      Siswa Terdaftar
                    </span>
                    <span
                      className={
                        isAlmostFull
                          ? "text-amber-600 font-bold"
                          : "text-foreground font-semibold"
                      }
                    >
                      {currentCount} / {maxCapacity} Siswa
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isAlmostFull ? "bg-amber-500" : "bg-primary"
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(rombel)}
                  className="w-full h-10 text-sm sm:h-8 sm:text-xs gap-1.5 border-border hover:bg-muted/60"
                  aria-label={`Atur Rombel ${rombel.nama}`}
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Atur Rombel
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Rombel Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Settings2 className="h-4 w-4 text-primary" />
              Atur Wali Kelas & Kapasitas ({selectedRombel?.nama})
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ubah penetapan nama guru wali kelas, tahun ajaran aktif, atau daya tampung kelas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="wali-kelas" className="text-xs">
                Nama Guru Wali Kelas
              </Label>
              <Input
                id="wali-kelas"
                placeholder="Contoh: Ustz. Siti Rahmawati, S.Pd.I"
                value={waliKelasNama}
                onChange={(e) => setWaliKelasNama(e.target.value)}
                className="h-10 text-sm sm:h-9 sm:text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="tahun-ajaran" className="text-xs">
                  Tahun Ajaran
                </Label>
                <Input
                  id="tahun-ajaran"
                  placeholder="2026/2027"
                  value={tahunAjaran}
                  onChange={(e) => setTahunAjaran(e.target.value)}
                  className="h-10 text-sm sm:h-9 sm:text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="kapasitas" className="text-xs">
                  Kapasitas (Maks. Siswa)
                </Label>
                <Input
                  id="kapasitas"
                  type="number"
                  min={1}
                  max={50}
                  value={kapasitas}
                  onChange={(e) => setKapasitas(parseInt(e.target.value, 10) || 28)}
                  className="h-10 text-sm sm:h-9 sm:text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="h-10 text-sm sm:h-8 sm:text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="h-10 text-sm sm:h-8 sm:text-xs gap-1.5"
              >
                {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
