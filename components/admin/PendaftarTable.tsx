"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  MessageCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  User,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PendaftarSearch from "./PendaftarSearch";
import PendaftarDateFilter from "./PendaftarDateFilter";
import PendaftarBulkToolbar from "./PendaftarBulkToolbar";
import PendaftarBulkStatusDialog from "./PendaftarBulkStatusDialog";
import PendaftarMobileCard from "./PendaftarMobileCard";
import PendaftarWhatsAppModal, {
  WhatsAppRecipient,
} from "./PendaftarWhatsAppModal";
import { filterPendaftarList } from "@/lib/utils/pendaftar-filter";
import { exportToExcelEmisDapodik } from "@/lib/utils/pendaftar-export";

export type PendaftarItem = {
  id: string;
  nomor_induk?: string | null;
  nama_lengkap: string | null;
  nama_panggilan?: string | null;
  nama_ayah_kandung: string | null;
  nama_ibu_kandung?: string | null;
  jenis_kelamin: string | null;
  tempat_lahir?: string | null;
  tanggal_lahir?: string | null;
  agama?: string | null;
  kewarganegaraan?: string | null;
  anak_ke?: number | null;
  jumlah_saudara_kandung?: number | null;
  status_anak?: string | null;
  bahasa_sehari_hari?: string | null;
  berat_badan?: number | null;
  tinggi_badan?: number | null;
  golongan_darah?: string | null;
  tk_asal?: string | null;
  memiliki_kebutuhan_khusus?: boolean | null;
  jenis_kebutuhan_khusus?: any;
  alamat_lengkap?: string | null;
  jarak_tempat_tinggal?: string | null;
  transportasi?: string | null;
  nomor_telepon?: string | null;
  email?: string | null;
  pendidikan_ayah?: string | null;
  pekerjaan_ayah?: string | null;
  pendidikan_ibu?: string | null;
  pekerjaan_ibu?: string | null;
  gaji_orang_tua?: string | null;
  alamat_orang_tua?: string | null;
  wali_nama?: string | null;
  wali_hubungan?: string | null;
  wali_pendidikan?: string | null;
  wali_pekerjaan?: string | null;
  wali_telepon?: string | null;
  wali_alamat?: string | null;
  hobi?: string | null;
  cita_cita?: string | null;
  status_pendaftaran: string | null;
  diterima_di_kelas?: string | null;
  diterima_pada_tanggal?: string | null;
  created_at: string;
};

interface PendaftarTableProps {
  pendaftar: PendaftarItem[];
}

const ITEMS_PER_PAGE = 10;

export default function PendaftarTable({
  pendaftar: initialPendaftar,
}: PendaftarTableProps) {
  const [pendaftar, setPendaftar] = useState<PendaftarItem[]>(initialPendaftar);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkStatusOpen, setIsBulkStatusOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppRecipients, setWhatsAppRecipients] = useState<
    WhatsAppRecipient[]
  >([]);

  // Official registration ID mapping
  const regIdMap = useMemo(() => {
    const map = new Map<string, string>();
    pendaftar.forEach((item, index) => {
      const date = item.created_at ? new Date(item.created_at) : new Date();
      const year = isNaN(date.getFullYear())
        ? new Date().getFullYear()
        : date.getFullYear();
      map.set(item.id, `MIM-${year}-${String(index + 1).padStart(3, "0")}`);
    });
    return map;
  }, [pendaftar]);

  // Summary metric counts
  const stats = useMemo(() => {
    const total = pendaftar.length;
    const diterima = pendaftar.filter(
      (p) =>
        p.status_pendaftaran === "Diterima" ||
        p.status_pendaftaran === "Akun Dibuat"
    ).length;
    const revisi = pendaftar.filter(
      (p) =>
        p.status_pendaftaran === "Revisi" ||
        p.status_pendaftaran === "Validasi Ulang"
    ).length;
    const ditolak = pendaftar.filter(
      (p) => p.status_pendaftaran === "Ditolak"
    ).length;
    const menunggu = pendaftar.filter((p) => {
      const s = p.status_pendaftaran;
      return (
        s !== "Diterima" &&
        s !== "Akun Dibuat" &&
        s !== "Revisi" &&
        s !== "Validasi Ulang" &&
        s !== "Ditolak"
      );
    }).length;

    return { total, menunggu, diterima, revisi, ditolak };
  }, [pendaftar]);

  // Filter data using pure helper
  const filteredPendaftar = useMemo(() => {
    return filterPendaftarList(pendaftar, {
      searchQuery,
      status: selectedStatus,
      gender: selectedGender,
      startDate,
      endDate,
      regIdMap,
    });
  }, [
    pendaftar,
    selectedStatus,
    selectedGender,
    searchQuery,
    startDate,
    endDate,
    regIdMap,
  ]);

  // Pagination
  const totalItems = filteredPendaftar.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPendaftar = filteredPendaftar.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Selection handlers
  const isAllCurrentPageSelected =
    paginatedPendaftar.length > 0 &&
    paginatedPendaftar.every((p) => selectedIds.has(p.id));

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllCurrentPageSelected) {
        paginatedPendaftar.forEach((p) => next.delete(p.id));
      } else {
        paginatedPendaftar.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setSelectedStatus("ALL");
    setSelectedGender("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Export to Excel EMIS 4.0 & Dapodik
  const handleExportExcel = () => {
    if (filteredPendaftar.length === 0) return;
    exportToExcelEmisDapodik(filteredPendaftar, regIdMap);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredPendaftar.length === 0) return;

    const headers = [
      "No",
      "ID Registrasi",
      "NIK",
      "Nama Siswa",
      "Jenis Kelamin",
      "Nama Ayah",
      "Nama Ibu",
      "No Telepon",
      "Tanggal Daftar",
      "Status",
    ];
    const rows = filteredPendaftar.map((item, index) => [
      index + 1,
      regIdMap.get(item.id) || "",
      `"${(item.nomor_induk || "").replace(/"/g, '""')}"`,
      `"${(item.nama_lengkap || "").replace(/"/g, '""')}"`,
      item.jenis_kelamin === "L"
        ? "Laki-laki"
        : item.jenis_kelamin === "P"
        ? "Perempuan"
        : item.jenis_kelamin || "",
      `"${(item.nama_ayah_kandung || "").replace(/"/g, '""')}"`,
      `"${(item.nama_ibu_kandung || "").replace(/"/g, '""')}"`,
      `"${item.nomor_telepon || ""}"`,
      new Date(item.created_at).toLocaleDateString("id-ID"),
      item.status_pendaftaran || "Menunggu Persetujuan",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `pendaftar_mim_pk_dimoro_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open WhatsApp Modal for single contact
  const handleOpenSingleWhatsApp = (item: PendaftarItem) => {
    setWhatsAppRecipients([
      {
        id: item.id,
        nama_lengkap: item.nama_lengkap,
        nama_ayah_kandung: item.nama_ayah_kandung,
        nomor_telepon: item.nomor_telepon,
        status_pendaftaran: item.status_pendaftaran,
        regId: regIdMap.get(item.id),
      },
    ]);
    setIsWhatsAppModalOpen(true);
  };

  // Open WhatsApp Modal for bulk selected contacts
  const handleOpenBulkWhatsApp = () => {
    const selectedList = pendaftar.filter((p) => selectedIds.has(p.id));
    const recipients: WhatsAppRecipient[] = selectedList.map((p) => ({
      id: p.id,
      nama_lengkap: p.nama_lengkap,
      nama_ayah_kandung: p.nama_ayah_kandung,
      nomor_telepon: p.nomor_telepon,
      status_pendaftaran: p.status_pendaftaran,
      regId: regIdMap.get(p.id),
    }));
    setWhatsAppRecipients(recipients);
    setIsWhatsAppModalOpen(true);
  };

  // Handle bulk status update callback
  const handleBulkStatusSuccess = (newStatus: string) => {
    setPendaftar((prev) =>
      prev.map((item) => {
        if (selectedIds.has(item.id)) {
          return { ...item, status_pendaftaran: newStatus };
        }
        return item;
      })
    );
    setSelectedIds(new Set());
  };

  // Helper for status badge
  const renderStatusBadge = (status: string | null) => {
    switch (status) {
      case "Diterima":
      case "Akun Dibuat":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-medium">
            Diterima
          </Badge>
        );
      case "Revisi":
      case "Validasi Ulang":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-medium">
            Revisi
          </Badge>
        );
      case "Ditolak":
        return (
          <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 font-medium">
            Ditolak
          </Badge>
        );
      default:
        return (
          <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 font-medium">
            Menunggu Persetujuan
          </Badge>
        );
    }
  };

  // Metric cards configuration
  const metricCards = [
    {
      key: "ALL",
      title: "Total Pendaftar",
      count: stats.total,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgLight:
        "bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40",
      activeBorder: "ring-2 ring-blue-500 border-blue-500",
    },
    {
      key: "Menunggu Persetujuan",
      title: "Menunggu Persetujuan",
      count: stats.menunggu,
      icon: Clock,
      color: "text-sky-600 dark:text-sky-400",
      bgLight:
        "bg-sky-50/70 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/40",
      activeBorder: "ring-2 ring-sky-500 border-sky-500",
    },
    {
      key: "Diterima",
      title: "Diterima",
      count: stats.diterima,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgLight:
        "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40",
      activeBorder: "ring-2 ring-emerald-500 border-emerald-500",
    },
    {
      key: "Revisi",
      title: "Validasi Ulang / Revisi",
      count: stats.revisi,
      icon: AlertCircle,
      color: "text-amber-600 dark:text-amber-400",
      bgLight:
        "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40",
      activeBorder: "ring-2 ring-amber-500 border-amber-500",
    },
    {
      key: "Ditolak",
      title: "Ditolak",
      count: stats.ditolak,
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      bgLight:
        "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40",
      activeBorder: "ring-2 ring-rose-500 border-rose-500",
    },
  ];

  // Tabs configuration
  const tabs = [
    { key: "ALL", label: "Semua", count: stats.total },
    {
      key: "Menunggu Persetujuan",
      label: "Menunggu",
      count: stats.menunggu,
    },
    { key: "Diterima", label: "Diterima", count: stats.diterima },
    { key: "Revisi", label: "Revisi", count: stats.revisi },
    { key: "Ditolak", label: "Ditolak", count: stats.ditolak },
  ];

  const hasActiveFilters = Boolean(
    searchQuery ||
      selectedStatus !== "ALL" ||
      selectedGender ||
      startDate ||
      endDate
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Interactive Metric Cards: Horizontal Swipeable on mobile, Grid on desktop */}
      <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-1 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        {metricCards.map((card) => {
          const IconComponent = card.icon;
          const isActive = selectedStatus === card.key;
          return (
            <Card
              key={card.key}
              data-testid={`metric-card-${card.key}`}
              onClick={() => handleStatusSelect(card.key)}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md shrink-0 w-36 sm:w-auto ${
                card.bgLight
              } ${
                isActive
                  ? `${card.activeBorder} shadow-sm`
                  : "border-border/60 hover:border-border"
              }`}
            >
              <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground line-clamp-1">
                    {card.title}
                  </span>
                  <div
                    className={`p-1 rounded-md sm:rounded-lg bg-background/80 ${card.color}`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-2 sm:mt-3">
                  <p
                    className={`text-xl sm:text-3xl font-bold tracking-tight ${card.color}`}
                  >
                    {card.count}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 2. Main Data Card with Tabs & Toolbar */}
      <Card className="border-border shadow-sm">
        {/* Header & Status Tabs */}
        <div className="border-b border-border/80 px-4 sm:px-6 pt-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                Data Calon Siswa
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportExcel}
                  disabled={filteredPendaftar.length === 0}
                  className="h-8 sm:h-9 gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Export Excel</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  disabled={filteredPendaftar.length === 0}
                  className="h-8 sm:h-9 gap-1.5 text-xs font-medium"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>

            {/* Status Tabs Navigation */}
            <div className="flex overflow-x-auto no-scrollbar gap-1 border-b border-transparent -mb-[1px]">
              {tabs.map((tab) => {
                const isActive = selectedStatus === tab.key;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleStatusSelect(tab.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Toolbar: Single-Row Aligned on Desktop, Responsive Grid on Mobile */}
        <div className="p-3.5 sm:px-6 bg-muted/20 border-b border-border/60">
          <div className="flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-0">
              <PendaftarSearch
                value={searchQuery}
                onChange={(query) => {
                  setSearchQuery(query);
                  setCurrentPage(1);
                }}
                placeholder="Cari nama siswa, NIK, orang tua, atau ID registrasi..."
              />
            </div>

            {/* Controls Row: Gender + Date Range + Reset Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2.5 shrink-0">
              {/* Gender Dropdown */}
              <div className="w-full sm:w-auto lg:w-40">
                <Select
                  value={selectedGender || "ALL"}
                  onValueChange={(val) => {
                    setSelectedGender(val === "ALL" ? "" : val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger
                    aria-label="Filter Gender"
                    className="h-10 sm:h-9 w-full bg-background text-xs font-medium border-input shadow-2xs cursor-pointer"
                  >
                    <SelectValue placeholder="Semua Gender" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="ALL">Semua Gender</SelectItem>
                    <SelectItem value="L">Laki-laki (L)</SelectItem>
                    <SelectItem value="P">Perempuan (P)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Connected Date Range Capsule */}
              <div className="w-full sm:w-auto">
                <PendaftarDateFilter
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={(val) => {
                    setStartDate(val);
                    setCurrentPage(1);
                  }}
                  onEndDateChange={(val) => {
                    setEndDate(val);
                    setCurrentPage(1);
                  }}
                  onResetDates={() => {
                    setStartDate("");
                    setEndDate("");
                    setCurrentPage(1);
                  }}
                  className="w-full"
                />
              </div>

              {/* Reset Filter Button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilter}
                  className="h-10 sm:h-9 text-xs text-muted-foreground hover:text-foreground gap-1.5 px-3 shrink-0 col-span-1 sm:col-span-2 lg:col-span-1 border border-border/70 sm:border-transparent"
                  title="Reset Semua Filter"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Filter</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW A: MOBILE ADAPTIVE CARDS (< md) */}
        {/* ============================================================ */}
        <div className="block md:hidden">
          {/* Mobile Select All Header */}
          {paginatedPendaftar.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <Checkbox
                  aria-label="Pilih Semua Pendaftar"
                  checked={isAllCurrentPageSelected}
                  onCheckedChange={handleToggleSelectAll}
                  className="h-4 w-4"
                />
                <span className="font-semibold text-muted-foreground">
                  Pilih Semua
                </span>
              </div>
              <span className="text-muted-foreground text-[11px]">
                {paginatedPendaftar.length} Siswa di Halaman Ini
              </span>
            </div>
          )}

          {/* Cards List */}
          <div className="p-3.5 space-y-3">
            {paginatedPendaftar.length > 0 ? (
              paginatedPendaftar.map((item) => (
                <PendaftarMobileCard
                  key={item.id}
                  item={item}
                  regId={regIdMap.get(item.id) || "MIM-2026-000"}
                  isSelected={selectedIds.has(item.id)}
                  onToggleSelect={handleToggleSelectRow}
                  onOpenWhatsApp={handleOpenSingleWhatsApp}
                />
              ))
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="p-3 rounded-full bg-muted text-muted-foreground w-12 h-12 mx-auto flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  Tidak ada data pendaftar
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  {hasActiveFilters
                    ? "Tidak ditemukan data yang cocok dengan filter pencarian."
                    : "Belum ada calon siswa yang mendaftar."}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilter}
                    className="text-xs mt-2"
                  >
                    Reset Filter
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW B: DESKTOP COMPLETE DATA TABLE (≥ md) */}
        {/* ============================================================ */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[45px] text-center">
                  <Checkbox
                    aria-label="Pilih Semua"
                    checked={isAllCurrentPageSelected}
                    onCheckedChange={handleToggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[130px] font-semibold">
                  ID Registrasi
                </TableHead>
                <TableHead className="font-semibold min-w-[200px]">
                  Nama Calon Siswa
                </TableHead>
                <TableHead className="font-semibold min-w-[170px]">
                  Nama Orang Tua
                </TableHead>
                <TableHead className="font-semibold w-[110px]">Gender</TableHead>
                <TableHead className="font-semibold w-[130px]">
                  Tanggal Daftar
                </TableHead>
                <TableHead className="font-semibold w-[140px]">Status</TableHead>
                <TableHead className="text-right font-semibold w-[170px]">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPendaftar.length > 0 ? (
                paginatedPendaftar.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  const regId = regIdMap.get(item.id) || "MIM-2026-000";
                  const studentInitials = (item.nama_lengkap || "S")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <TableRow
                      key={item.id}
                      data-state={isSelected ? "selected" : undefined}
                      className={`hover:bg-muted/30 transition-colors ${
                        isSelected ? "bg-primary/5 font-medium" : ""
                      }`}
                    >
                      {/* Row Selection Checkbox */}
                      <TableCell className="text-center">
                        <Checkbox
                          aria-label={`Pilih ${item.nama_lengkap || "Pendaftar"}`}
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSelectRow(item.id)}
                        />
                      </TableCell>

                      {/* ID Registrasi */}
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {regId}
                      </TableCell>

                      {/* Nama Siswa */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {studentInitials || <User className="h-4 w-4" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground leading-tight">
                              {item.nama_lengkap || "Nama tidak tersedia"}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                              {item.nomor_induk && (
                                <span className="font-mono">
                                  NIK: {item.nomor_induk}
                                </span>
                              )}
                              {item.nomor_telepon && (
                                <span>{item.nomor_telepon}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Orang Tua */}
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-foreground">
                            {item.nama_ayah_kandung || "-"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Ibu: {item.nama_ibu_kandung || "-"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Jenis Kelamin */}
                      <TableCell>
                        {item.jenis_kelamin === "L" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                            Laki-laki
                          </span>
                        ) : item.jenis_kelamin === "P" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-500/10 text-pink-700 dark:text-pink-400 border border-pink-500/20">
                            Perempuan
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      {/* Tanggal Daftar */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {renderStatusBadge(item.status_pendaftaran)}
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenSingleWhatsApp(item)}
                            disabled={!item.nomor_telepon}
                            className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                            title="Kirim Pesan WhatsApp Cepat"
                            aria-label="Kirim Pesan WhatsApp"
                          >
                            <MessageCircle className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                            <span className="text-xs">WhatsApp</span>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-8 px-2.5 text-xs font-medium"
                          >
                            <Link
                              href={`/admin/pendaftar/detail/${item.id}`}
                              aria-label="Lihat Detail"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Detail
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-3">
                      <div className="p-3 rounded-full bg-muted text-muted-foreground">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">
                          Tidak ada data pendaftar
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {hasActiveFilters
                            ? "Tidak ditemukan data pendaftar yang sesuai dengan kriteria filter."
                            : "Belum ada calon siswa yang mendaftar."}
                        </p>
                      </div>
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetFilter}
                          className="text-xs mt-2"
                        >
                          Reset Semua Filter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 4. Pagination & Summary Footer */}
        {totalItems > 0 && (
          <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80 bg-muted/10">
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              Menampilkan{" "}
              <span className="font-medium text-foreground">
                {startIndex + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium text-foreground">
                {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}
              </span>{" "}
              dari{" "}
              <span className="font-medium text-foreground">{totalItems}</span>{" "}
              pendaftar
            </div>

            {totalPages > 1 && (
              <>
                {/* Mobile Compact Pagination */}
                <div className="flex sm:hidden items-center justify-between w-full pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={safeCurrentPage <= 1}
                    className="h-8 text-xs px-3"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Prev
                  </Button>

                  <span className="text-xs font-semibold text-muted-foreground">
                    Hal {safeCurrentPage} dari {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={safeCurrentPage >= totalPages}
                    className="h-8 text-xs px-3"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>

                {/* Desktop Numbered Pagination */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={safeCurrentPage <= 1}
                    className="h-8 px-2 text-xs"
                    aria-label="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === safeCurrentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-8 w-8 p-0 text-xs ${
                            pageNum === safeCurrentPage
                              ? "font-bold shadow-xs"
                              : ""
                          }`}
                        >
                          {pageNum}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={safeCurrentPage >= totalPages}
                    className="h-8 px-2 text-xs"
                    aria-label="Halaman Berikutnya"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {/* Floating Bulk Action Toolbar */}
      <PendaftarBulkToolbar
        selectedCount={selectedIds.size}
        totalCount={filteredPendaftar.length}
        onOpenBulkStatus={() => setIsBulkStatusOpen(true)}
        onOpenBulkWhatsApp={handleOpenBulkWhatsApp}
        onClearSelection={handleClearSelection}
      />

      {/* Bulk Status Update Dialog */}
      <PendaftarBulkStatusDialog
        open={isBulkStatusOpen}
        onOpenChange={setIsBulkStatusOpen}
        selectedIds={Array.from(selectedIds)}
        onSuccess={handleBulkStatusSuccess}
      />

      {/* WhatsApp Quick & Batch Modal */}
      <PendaftarWhatsAppModal
        open={isWhatsAppModalOpen}
        onOpenChange={setIsWhatsAppModalOpen}
        recipients={whatsAppRecipients}
      />
    </div>
  );
}
