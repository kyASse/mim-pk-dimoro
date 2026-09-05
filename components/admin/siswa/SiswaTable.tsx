"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Trash2, 
  GraduationCap, 
  Calendar, 
  MoreHorizontal,
  Link as LinkIcon,
  Loader2,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { assignSiswaRombelAction, deleteSiswaAction } from "@/app/admin/siswa/actions";
import LinkParentModal, { SiswaLinkProps } from "./LinkParentModal";
import SiswaMobileCard from "./SiswaMobileCard";

export interface SiswaItem {
  id: string;
  nama_lengkap: string;
  tanggal_lahir?: string | null;
  kelompok?: string | null;
  rombel_id?: string | null;
  profile_orang_tua_id?: string | null;
  parentProfile?: {
    id: string;
    nama_lengkap: string | null;
    email?: string | null;
  } | null;
  rombel?: {
    id: string;
    nama: string;
    wali_kelas_nama?: string | null;
  } | null;
}

interface SiswaTableProps {
  siswaList: SiswaItem[];
  rombels: Array<{ id: string; nama: string }>;
}

export default function SiswaTable({ siswaList, rombels }: SiswaTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterRombel, setFilterRombel] = useState("ALL");
  const [filterParentStatus, setFilterParentStatus] = useState("ALL");
  const [selectedSiswaForLink, setSelectedSiswaForLink] = useState<SiswaLinkProps | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredSiswa = useMemo(() => {
    return siswaList.filter((s) => {
      // Search
      const matchSearch =
        !search ||
        s.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
        (s.parentProfile?.nama_lengkap &&
          s.parentProfile.nama_lengkap.toLowerCase().includes(search.toLowerCase())) ||
        (s.parentProfile?.email &&
          s.parentProfile.email.toLowerCase().includes(search.toLowerCase()));

      // Rombel filter
      const matchRombel =
        filterRombel === "ALL" ||
        s.rombel_id === filterRombel ||
        s.kelompok === filterRombel;

      // Parent filter
      const matchParent =
        filterParentStatus === "ALL" ||
        (filterParentStatus === "LINKED" && Boolean(s.profile_orang_tua_id)) ||
        (filterParentStatus === "UNLINKED" && !s.profile_orang_tua_id);

      return matchSearch && matchRombel && matchParent;
    });
  }, [siswaList, search, filterRombel, filterParentStatus]);

  const handleRombelChange = (siswaId: string, rombelId: string) => {
    startTransition(async () => {
      try {
        const targetRombel = rombelId === "NONE" ? null : rombelId;
        const res = await assignSiswaRombelAction(siswaId, targetRombel);
        if (res.success) {
          toast.success("Rombel siswa berhasil diperbarui");
          router.refresh();
        } else {
          toast.error(res.message || "Gagal memperbarui rombel");
        }
      } catch (err: any) {
        toast.error(err?.message || "Terjadi kesalahan");
      }
    });
  };

  const handleDelete = (siswaId: string, nama: string) => {
    startTransition(async () => {
      try {
        const res = await deleteSiswaAction(siswaId);
        if (res.success) {
          toast.success(`Siswa ${nama} berhasil dihapus`);
          router.refresh();
        } else {
          toast.error(res.message || "Gagal menghapus siswa");
        }
      } catch (err: any) {
        toast.error(err?.message || "Terjadi kesalahan");
      }
    });
  };

  const handleOpenLinkModal = (siswa: SiswaItem) => {
    setSelectedSiswaForLink({
      id: siswa.id,
      nama_lengkap: siswa.nama_lengkap,
      profile_orang_tua_id: siswa.profile_orang_tua_id,
      parentProfile: siswa.parentProfile,
    });
    setIsLinkModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar: Mobile-First full width & 44px touch targets */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 sm:top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama siswa atau nama/email wali..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-sm sm:h-9 sm:text-xs bg-background"
          />
        </div>

        <div className="grid grid-cols-1 sm:flex items-center gap-2 w-full sm:w-auto">
          {/* Rombel Filter */}
          <Select value={filterRombel} onValueChange={setFilterRombel}>
            <SelectTrigger className="w-full sm:w-auto sm:min-w-[130px] h-10 text-sm sm:h-9 sm:text-xs bg-background">
              <SelectValue placeholder="Semua Rombel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Rombel</SelectItem>
              {rombels.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Parent Status Filter */}
          <Select value={filterParentStatus} onValueChange={setFilterParentStatus}>
            <SelectTrigger className="w-full sm:w-auto sm:min-w-[140px] h-10 text-sm sm:h-9 sm:text-xs bg-background">
              <SelectValue placeholder="Status Akun Wali" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status Wali</SelectItem>
              <SelectItem value="LINKED">Terhubung Akun</SelectItem>
              <SelectItem value="UNLINKED">Belum Terhubung</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MOBILE VIEW (< 768px): Card-based thumb-friendly list */}
      <div className="block md:hidden space-y-3">
        {filteredSiswa.length > 0 ? (
          filteredSiswa.map((siswa) => (
            <SiswaMobileCard
              key={siswa.id}
              siswa={siswa}
              rombels={rombels}
              onOpenLinkModal={handleOpenLinkModal}
              onRombelChange={handleRombelChange}
              onDelete={handleDelete}
              isPending={isPending}
            />
          ))
        ) : (
          <div className="p-8 rounded-xl border border-border bg-card text-center text-xs text-muted-foreground">
            <Users className="h-8 w-8 mx-auto opacity-30 mb-2" />
            <p>Tidak ada data siswa yang cocok dengan filter pencarian.</p>
          </div>
        )}
      </div>

      {/* DESKTOP VIEW (>= 768px): Dense Command Center Table */}
      <div className="hidden md:block rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Rombel / Kelas</th>
                <th className="py-3 px-4">Akun Orang Tua (Wali)</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSiswa.length > 0 ? (
                filteredSiswa.map((siswa) => {
                  const initials = (siswa.nama_lengkap || "S")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase();

                  const activeRombelId =
                    siswa.rombel_id ||
                    rombels.find((r) => r.nama === siswa.kelompok)?.id ||
                    "NONE";

                  return (
                    <tr
                      key={siswa.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Siswa Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {siswa.nama_lengkap}
                            </p>
                            {siswa.tanggal_lahir && (
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Lahir:{" "}
                                {new Date(siswa.tanggal_lahir).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Rombel Selector */}
                      <td className="py-3.5 px-4">
                        <Select
                          value={activeRombelId}
                          onValueChange={(val) =>
                            handleRombelChange(siswa.id, val)
                          }
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-[140px] text-xs h-8 bg-background">
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
                      </td>

                      {/* Parent Account Status */}
                      <td className="py-3.5 px-4">
                        {siswa.profile_orang_tua_id ? (
                          <div className="space-y-0.5">
                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[11px] gap-1 font-medium">
                              <UserCheck className="h-3 w-3" />
                              {siswa.parentProfile?.nama_lengkap ||
                                siswa.parentProfile?.email ||
                                "Akun Terhubung"}
                            </Badge>
                            {siswa.parentProfile?.email && (
                              <p className="text-[11px] text-muted-foreground pl-1">
                                {siswa.parentProfile.email}
                              </p>
                            )}
                          </div>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground border-dashed text-[11px] gap-1"
                          >
                            <UserX className="h-3 w-3" />
                            Belum Ada Akun
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenLinkModal(siswa)}
                            className="text-xs h-8 gap-1.5 border-border hover:bg-muted/60"
                            aria-label={`Kelola Akun Wali ${siswa.nama_lengkap}`}
                          >
                            <LinkIcon className="h-3.5 w-3.5 text-primary" />
                            <span className="hidden sm:inline">Kelola Akun Wali</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs h-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 p-2"
                                title="Hapus Siswa"
                                aria-label={`Hapus Siswa ${siswa.nama_lengkap}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Data Siswa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus data siswa{" "}
                                  <strong>{siswa.nama_lengkap}</strong>? Tindakan
                                  ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(siswa.id, siswa.nama_lengkap)
                                  }
                                  className="bg-rose-600 hover:bg-rose-700 text-white"
                                >
                                  Ya, Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-xs text-muted-foreground"
                  >
                    <Users className="h-8 w-8 mx-auto opacity-30 mb-2" />
                    <p>Tidak ada data siswa yang cocok dengan filter pencarian.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Link Parent Modal */}
      <LinkParentModal
        siswa={selectedSiswaForLink}
        open={isLinkModalOpen}
        onOpenChange={setIsLinkModalOpen}
      />
    </div>
  );
}
