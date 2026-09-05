"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  ArrowLeft, 
  UserCheck, 
  UserX, 
  Download,
  Plus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createSiswaAction } from "@/app/admin/siswa/actions";
import SiswaTable, { SiswaItem } from "./SiswaTable";
import MasterRombelGrid, { RombelItem } from "./MasterRombelGrid";
import ImportPendaftarList, { AcceptedApplicant } from "./ImportPendaftarList";

interface KelolaSiswaClientProps {
  siswaList: SiswaItem[];
  rombels: RombelItem[];
  acceptedApplicants: AcceptedApplicant[];
  defaultTab?: string;
}

export default function KelolaSiswaClient({
  siswaList,
  rombels,
  acceptedApplicants,
  defaultTab = "siswa",
}: KelolaSiswaClientProps) {
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNama, setNewNama] = useState("");
  const [newTanggalLahir, setNewTanggalLahir] = useState("");
  const [newRombelId, setNewRombelId] = useState("");
  const [isPending, startTransition] = useTransition();

  // Metrics
  const totalSiswa = siswaList.length;
  const linkedCount = siswaList.filter((s) => Boolean(s.profile_orang_tua_id)).length;
  const unlinkedCount = totalSiswa - linkedCount;
  const totalRombel = rombels.length;

  const handleAddSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama) return;

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("nama_lengkap", newNama);
        if (newTanggalLahir) fd.append("tanggal_lahir", newTanggalLahir);
        if (newRombelId && newRombelId !== "NONE") fd.append("rombel_id", newRombelId);

        const res = await createSiswaAction(fd);
        if (res.success) {
          toast.success(`Siswa ${newNama} berhasil ditambahkan`);
          setIsAddDialogOpen(false);
          setNewNama("");
          setNewTanggalLahir("");
          setNewRombelId("");
          router.refresh();
        } else {
          toast.error(res.message || "Gagal menambahkan siswa");
        }
      } catch (err: any) {
        toast.error(err?.message || "Terjadi kesalahan");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header with Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5 w-full sm:w-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Link
              href="/admin"
              className="hover:text-foreground transition-colors flex items-center gap-1 font-medium group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Dasbor Admin</span>
            </Link>
            <span className="opacity-50">/</span>
            <span className="text-foreground font-semibold">Kelola Siswa</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0" />
            <span>Kelola Siswa & Master Rombel</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manajemen buku induk siswa madrasah, penetapan rombongan belajar, dan penautan akun wali murid.
          </p>
        </div>

        {/* Add Student Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto h-10 text-sm sm:h-9 sm:text-xs gap-1.5 font-semibold shadow-sm shrink-0">
              <Plus className="h-4 w-4" />
              Tambah Siswa Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <UserPlus className="h-4 w-4 text-primary" />
                Tambah Data Siswa Baru
              </DialogTitle>
              <DialogDescription className="text-xs">
                Masukkan informasi dasar calon siswa baru untuk dimasukkan ke data madrasah.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddSiswa} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <Label htmlFor="nama-siswa" className="text-xs">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="nama-siswa"
                  required
                  placeholder="Contoh: Muhammad Al-Fatih"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  className="h-10 text-sm sm:h-9 sm:text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="tgl-lahir" className="text-xs">
                    Tanggal Lahir
                  </Label>
                  <Input
                    id="tgl-lahir"
                    type="date"
                    value={newTanggalLahir}
                    onChange={(e) => setNewTanggalLahir(e.target.value)}
                    className="h-10 text-sm sm:h-9 sm:text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="rombel-select" className="text-xs">
                    Rombel / Kelas
                  </Label>
                  <Select value={newRombelId} onValueChange={setNewRombelId}>
                    <SelectTrigger id="rombel-select" className="h-10 text-sm sm:h-9 sm:text-xs">
                      <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">
                        <em>Belum Ditentukan</em>
                      </SelectItem>
                      {rombels.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="h-10 text-sm sm:h-8 sm:text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending || !newNama}
                  className="h-10 text-sm sm:h-8 sm:text-xs"
                >
                  Simpan Siswa
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-border shadow-sm bg-card">
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Siswa</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground mt-0.5">{totalSiswa}</p>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-card">
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Akun Wali Terhubung</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {linkedCount}
              </p>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-card">
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Belum Terhubung</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {unlinkedCount}
              </p>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <UserX className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-card">
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Rombel Aktif</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground mt-0.5">{totalRombel}</p>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs: Mobile-First horizontal swipeable pill bar */}
      <Tabs defaultValue={defaultTab} className="w-full space-y-4">
        <div className="w-full overflow-x-auto no-scrollbar pb-1">
          <TabsList className="flex w-max p-1 bg-muted/60 rounded-xl border border-border/60 gap-1.5 h-auto">
            <TabsTrigger
              value="siswa"
              className="shrink-0 whitespace-nowrap min-w-max px-4 h-10 text-sm sm:h-8 sm:text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <Users className="h-4 w-4 mr-1.5" />
              Data Siswa ({totalSiswa})
            </TabsTrigger>
            <TabsTrigger
              value="rombel"
              className="shrink-0 whitespace-nowrap min-w-max px-4 h-10 text-sm sm:h-8 sm:text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <GraduationCap className="h-4 w-4 mr-1.5" />
              Master Rombel ({totalRombel})
            </TabsTrigger>
            <TabsTrigger
              value="import"
              className="shrink-0 whitespace-nowrap min-w-max px-4 h-10 text-sm sm:h-8 sm:text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Import PPDB ({acceptedApplicants.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="siswa" className="space-y-4">
          <SiswaTable siswaList={siswaList} rombels={rombels} />
        </TabsContent>

        <TabsContent value="rombel" className="space-y-4">
          <MasterRombelGrid rombels={rombels} />
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <ImportPendaftarList
            applicants={acceptedApplicants}
            rombels={rombels}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
