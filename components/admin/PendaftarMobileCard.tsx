"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Eye, Phone, User, Calendar, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PendaftarItem } from "./PendaftarTable";

export interface PendaftarMobileCardProps {
  item: PendaftarItem;
  regId: string;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenWhatsApp: (item: PendaftarItem) => void;
}

export default function PendaftarMobileCard({
  item,
  regId,
  isSelected,
  onToggleSelect,
  onOpenWhatsApp,
}: PendaftarMobileCardProps) {
  const studentInitials = (item.nama_lengkap || "S")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const renderStatusBadge = (status: string | null) => {
    switch (status) {
      case "Diterima":
      case "Akun Dibuat":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-medium text-[11px]">
            Diterima
          </Badge>
        );
      case "Revisi":
      case "Validasi Ulang":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-medium text-[11px]">
            Revisi
          </Badge>
        );
      case "Ditolak":
        return (
          <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-medium text-[11px]">
            Ditolak
          </Badge>
        );
      default:
        return (
          <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/30 font-medium text-[11px]">
            Menunggu Persetujuan
          </Badge>
        );
    }
  };

  return (
    <div
      data-testid={`mobile-card-${item.id}`}
      className={`rounded-2xl border transition-all p-4 space-y-3 bg-card ${
        isSelected
          ? "border-primary/60 bg-primary/5 ring-1 ring-primary/40 shadow-xs"
          : "border-border/80 shadow-xs hover:border-border"
      }`}
    >
      {/* 1. Card Top Bar: Checkbox + Reg ID + Status */}
      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5">
        <div className="flex items-center gap-2.5">
          <Checkbox
            aria-label={`Pilih ${item.nama_lengkap || "Pendaftar"}`}
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(item.id)}
            className="h-4 w-4"
          />
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-muted text-foreground/90 border border-border/70 tracking-wide">
            {regId}
          </span>
        </div>

        <div>{renderStatusBadge(item.status_pendaftaran)}</div>
      </div>

      {/* 2. Card Body: Avatar, Name, Gender, NIK, Parent, Phone */}
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20 select-none">
          {studentInitials || <User className="h-4 w-4" />}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-bold text-sm text-foreground break-words leading-tight">
              {item.nama_lengkap || "Nama tidak tersedia"}
            </h3>
            {item.nama_panggilan && (
              <span className="text-xs text-muted-foreground font-normal">
                ({item.nama_panggilan})
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
            {item.jenis_kelamin && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 font-medium border-border/70"
              >
                {item.jenis_kelamin === "L" || item.jenis_kelamin === "Laki-laki"
                  ? "Laki-laki (L)"
                  : "Perempuan (P)"}
              </Badge>
            )}

            {item.nomor_induk && (
              <span className="font-mono text-muted-foreground/90">
                NIK: {item.nomor_induk}
              </span>
            )}
          </div>

          {/* Parents & Phone */}
          <div className="text-xs text-muted-foreground pt-1 space-y-0.5">
            <div className="text-foreground/90 font-medium truncate">
              Ayah: {item.nama_ayah_kandung || "-"}
              {item.nama_ibu_kandung && (
                <span className="text-muted-foreground font-normal ml-1">
                  · Ibu: {item.nama_ibu_kandung}
                </span>
              )}
            </div>

            {item.nomor_telepon && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Phone className="h-3 w-3 text-muted-foreground/70" />
                <span className="font-mono">{item.nomor_telepon}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Card Footer: Date & Quick Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50 gap-2">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Calendar className="h-3 w-3 text-muted-foreground/60" />
          <span>
            {new Date(item.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenWhatsApp(item)}
            disabled={!item.nomor_telepon}
            className="h-8 px-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 gap-1 transition-all active:scale-[0.98]"
            title="Kirim Pesan WhatsApp"
            aria-label="Kirim Pesan WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-8 px-2.5 text-xs font-semibold gap-1 border-border/80 hover:bg-muted transition-all active:scale-[0.98]"
          >
            <Link
              href={`/admin/pendaftar/detail/${item.id}`}
              aria-label="Lihat Detail"
            >
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Detail</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
