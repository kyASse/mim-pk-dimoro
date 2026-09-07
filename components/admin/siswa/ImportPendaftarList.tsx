"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  UserPlus, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Loader2, 
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { importSiswaFromPendaftarAction } from "@/app/admin/siswa/actions";

export interface AcceptedApplicant {
  id: string;
  nama_lengkap: string;
  status_pendaftaran: string;
  created_at: string;
  diterima_di_kelas?: string | null;
}

interface ImportPendaftarListProps {
  applicants: AcceptedApplicant[];
  rombels: Array<{ id: string; nama: string }>;
}

export default function ImportPendaftarList({
  applicants,
  rombels,
}: ImportPendaftarListProps) {
  const router = useRouter();
  const [selectedRombels, setSelectedRombels] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRombelSelect = (applicantId: string, rombelId: string) => {
    setSelectedRombels((prev) => ({ ...prev, [applicantId]: rombelId }));
  };

  const handleImport = (applicant: AcceptedApplicant) => {
    setLoadingId(applicant.id);
    startTransition(async () => {
      try {
        const assignedRombelId =
          selectedRombels[applicant.id] ||
          rombels.find((r) => r.nama === applicant.diterima_di_kelas)?.id ||
          "";

        const fd = new FormData();
        fd.append("pendaftar_id", applicant.id);
        if (assignedRombelId) {
          fd.append("rombel_id", assignedRombelId);
        }

        const res = await importSiswaFromPendaftarAction(fd);
        if (res.success) {
          toast.success(`${applicant.nama_lengkap} berhasil ditambahkan sebagai siswa`);
          router.refresh();
        } else {
          toast.error(res.message || "Gagal mengimpor pendaftar");
        }
      } catch (err: any) {
        toast.error(err?.message || "Terjadi kesalahan");
      } finally {
        setLoadingId(null);
      }
    });
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3 border-b border-border/40 p-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Import Pendaftar PPDB Diterima ke Data Siswa</span>
        </CardTitle>
        <CardDescription className="text-xs mt-0.5">
          Daftar calon siswa yang telah berstatus &quot;Diterima&quot; / &quot;Akun Dibuat&quot; di menu PPDB dan siap didaftarkan ke buku induk siswa madrasah.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        {applicants.length > 0 ? (
          <div className="space-y-3">
            {applicants.map((applicant) => {
              const defaultRombelId =
                selectedRombels[applicant.id] ||
                rombels.find((r) => r.nama === applicant.diterima_di_kelas)?.id ||
                "NONE";

              const isLoading = loadingId === applicant.id;

              return (
                <div
                  key={applicant.id}
                  className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3.5 text-xs"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-sm">
                        {applicant.nama_lengkap}
                      </span>
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                        {applicant.status_pendaftaran}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-[11px] flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        Daftar:{" "}
                        {new Date(applicant.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {applicant.diterima_di_kelas && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3 shrink-0" />
                          Rekomendasi Kelas: {applicant.diterima_di_kelas}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-[11px] font-medium text-muted-foreground sm:hidden">
                        Rombel:
                      </span>
                      <Select
                        value={defaultRombelId}
                        onValueChange={(val) =>
                          handleRombelSelect(applicant.id, val)
                        }
                      >
                        <SelectTrigger className="w-full sm:w-[150px] h-10 text-sm sm:h-8 sm:text-xs bg-background">
                          <SelectValue placeholder="Pilih Rombel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">
                            <em>Belum Ditetapkan</em>
                          </SelectItem>
                          {rombels.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleImport(applicant)}
                      disabled={isLoading || isPending}
                      className="w-full sm:w-auto h-10 text-sm sm:h-8 sm:text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-medium"
                    >
                      {isLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5" />
                      )}
                      Tambah ke Siswa
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 opacity-60 mb-2" />
            <p className="font-medium text-foreground text-sm">
              Semua pendaftar berstatus diterima telah diimpor ke data siswa.
            </p>
            <p className="text-muted-foreground mt-0.5">
              Tidak ada data pendaftar baru yang menunggu impor saat ini.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
