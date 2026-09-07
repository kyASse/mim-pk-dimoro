"use client";

import React from "react";
import { 
  Calendar, 
  UserCheck, 
  UserX, 
  Trash2, 
  Link as LinkIcon 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { SiswaItem } from "./SiswaTable";

interface SiswaMobileCardProps {
  siswa: SiswaItem;
  rombels: Array<{ id: string; nama: string }>;
  onOpenLinkModal: (siswa: SiswaItem) => void;
  onRombelChange: (siswaId: string, rombelId: string) => void;
  onDelete: (siswaId: string, nama: string) => void;
  isPending: boolean;
}

export default function SiswaMobileCard({
  siswa,
  rombels,
  onOpenLinkModal,
  onRombelChange,
  onDelete,
  isPending,
}: SiswaMobileCardProps) {
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
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-4 space-y-3.5">
        {/* Header: Avatar, Name, DOB, Delete */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-sm truncate">
                {siswa.nama_lengkap}
              </h3>
              {siswa.tanggal_lahir && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3 w-3 shrink-0" />
                  Lahir:{" "}
                  {new Date(siswa.tanggal_lahir).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-9 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 shrink-0"
                title="Hapus Siswa"
                aria-label={`Hapus Siswa ${siswa.nama_lengkap}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Data Siswa</AlertDialogTitle>
                <AlertDialogDescription className="text-xs">
                  Apakah Anda yakin ingin menghapus data siswa{" "}
                  <strong>{siswa.nama_lengkap}</strong>? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="h-10 text-sm">Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(siswa.id, siswa.nama_lengkap)}
                  className="h-10 text-sm bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Status Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-border/50">
          {/* Rombel Selector */}
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground">
              Rombel / Kelas
            </span>
            <Select
              value={activeRombelId}
              onValueChange={(val) => onRombelChange(siswa.id, val)}
              disabled={isPending}
            >
              <SelectTrigger className="w-full h-10 text-sm bg-background border-border">
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

          {/* Parent Account Badge */}
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground">
              Akun Wali Murid
            </span>
            <div className="h-10 flex items-center">
              {siswa.profile_orang_tua_id ? (
                <Badge className="w-full justify-start py-1.5 px-2.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs gap-1.5 font-medium truncate">
                  <UserCheck className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {siswa.parentProfile?.nama_lengkap ||
                      siswa.parentProfile?.email ||
                      "Akun Terhubung"}
                  </span>
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="w-full justify-start py-1.5 px-2.5 text-muted-foreground border-dashed text-xs gap-1.5"
                >
                  <UserX className="h-3.5 w-3.5 shrink-0" />
                  Belum Ada Akun
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Button: Full-width for thumb zone reach */}
        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenLinkModal(siswa)}
            className="w-full h-10 text-sm gap-2 font-medium border-border hover:bg-muted/60"
            aria-label={`Kelola Akun Wali ${siswa.nama_lengkap}`}
          >
            <LinkIcon className="h-4 w-4 text-primary shrink-0" />
            Kelola Akun Wali
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
