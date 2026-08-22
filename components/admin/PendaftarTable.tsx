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
    User
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PendaftarSearch from "./PendaftarSearch";

export type PendaftarItem = {
    id: string;
    nama_lengkap: string | null;
    nama_ayah_kandung: string | null;
    nama_ibu_kandung?: string | null;
    jenis_kelamin: string | null;
    tanggal_lahir?: string | null;
    nomor_telepon?: string | null;
    status_pendaftaran: string | null;
    created_at: string;
};

interface PendaftarTableProps {
    pendaftar: PendaftarItem[];
}

const ITEMS_PER_PAGE = 10;

function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
        return "62" + cleaned.slice(1);
    }
    if (cleaned.startsWith("62")) {
        return cleaned;
    }
    return "62" + cleaned;
}

export default function PendaftarTable({ pendaftar }: PendaftarTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
    const [selectedGender, setSelectedGender] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Compute stable official registration IDs based on index
    const regIdMap = useMemo(() => {
        const map = new Map<string, string>();
        pendaftar.forEach((item, index) => {
            const date = item.created_at ? new Date(item.created_at) : new Date();
            const year = isNaN(date.getFullYear()) ? new Date().getFullYear() : date.getFullYear();
            map.set(item.id, `MIM-${year}-${String(index + 1).padStart(3, "0")}`);
        });
        return map;
    }, [pendaftar]);

    // Calculate metrics counts
    const stats = useMemo(() => {
        const total = pendaftar.length;
        const diterima = pendaftar.filter((p) => p.status_pendaftaran === "Diterima").length;
        const revisi = pendaftar.filter((p) => p.status_pendaftaran === "Revisi" || p.status_pendaftaran === "Validasi Ulang").length;
        const ditolak = pendaftar.filter((p) => p.status_pendaftaran === "Ditolak").length;
        const menunggu = pendaftar.filter((p) => {
            const s = p.status_pendaftaran;
            return s !== "Diterima" && s !== "Revisi" && s !== "Validasi Ulang" && s !== "Ditolak";
        }).length;

        return { total, menunggu, diterima, revisi, ditolak };
    }, [pendaftar]);

    // Filter data
    const filteredPendaftar = useMemo(() => {
        return pendaftar.filter((item) => {
            // Status filter
            if (selectedStatus !== "ALL") {
                const s = item.status_pendaftaran;
                if (selectedStatus === "Menunggu Persetujuan") {
                    if (s === "Diterima" || s === "Revisi" || s === "Validasi Ulang" || s === "Ditolak") {
                        return false;
                    }
                } else if (selectedStatus === "Revisi") {
                    if (s !== "Revisi" && s !== "Validasi Ulang") {
                        return false;
                    }
                } else if (s !== selectedStatus) {
                    return false;
                }
            }

            // Gender filter
            if (selectedGender && item.jenis_kelamin !== selectedGender) {
                return false;
            }

            // Search query
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                const nama = item.nama_lengkap?.toLowerCase() || "";
                const ayah = item.nama_ayah_kandung?.toLowerCase() || "";
                const ibu = item.nama_ibu_kandung?.toLowerCase() || "";
                const regId = regIdMap.get(item.id)?.toLowerCase() || "";
                const phone = item.nomor_telepon?.toLowerCase() || "";

                const matches =
                    nama.includes(query) ||
                    ayah.includes(query) ||
                    ibu.includes(query) ||
                    regId.includes(query) ||
                    phone.includes(query);

                if (!matches) return false;
            }

            return true;
        });
    }, [pendaftar, selectedStatus, selectedGender, searchQuery, regIdMap]);

    // Pagination calculations
    const totalItems = filteredPendaftar.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPendaftar = filteredPendaftar.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleStatusSelect = (status: string) => {
        setSelectedStatus(status);
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setSearchQuery("");
        setSelectedStatus("ALL");
        setSelectedGender("");
        setCurrentPage(1);
    };

    // Export to CSV
    const handleExportCSV = () => {
        if (filteredPendaftar.length === 0) return;

        const headers = ["No", "ID Registrasi", "Nama Siswa", "Jenis Kelamin", "Nama Ayah", "Nama Ibu", "No Telepon", "Tanggal Daftar", "Status"];
        const rows = filteredPendaftar.map((item, index) => [
            index + 1,
            regIdMap.get(item.id) || "",
            `"${(item.nama_lengkap || "").replace(/"/g, '""')}"`,
            item.jenis_kelamin === "L" ? "Laki-laki" : item.jenis_kelamin === "P" ? "Perempuan" : item.jenis_kelamin || "",
            `"${(item.nama_ayah_kandung || "").replace(/"/g, '""')}"`,
            `"${(item.nama_ibu_kandung || "").replace(/"/g, '""')}"`,
            `"${item.nomor_telepon || ""}"`,
            new Date(item.created_at).toLocaleDateString("id-ID"),
            item.status_pendaftaran || "Menunggu Persetujuan",
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `pendaftar_mim_pk_dimoro_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Helper for status badge
    const renderStatusBadge = (status: string | null) => {
        switch (status) {
            case "Diterima":
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
            bgLight: "bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40",
            activeBorder: "ring-2 ring-blue-500 border-blue-500",
        },
        {
            key: "Menunggu Persetujuan",
            title: "Menunggu Persetujuan",
            count: stats.menunggu,
            icon: Clock,
            color: "text-sky-600 dark:text-sky-400",
            bgLight: "bg-sky-50/70 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/40",
            activeBorder: "ring-2 ring-sky-500 border-sky-500",
        },
        {
            key: "Diterima",
            title: "Diterima",
            count: stats.diterima,
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            bgLight: "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40",
            activeBorder: "ring-2 ring-emerald-500 border-emerald-500",
        },
        {
            key: "Revisi",
            title: "Validasi Ulang / Revisi",
            count: stats.revisi,
            icon: AlertCircle,
            color: "text-amber-600 dark:text-amber-400",
            bgLight: "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40",
            activeBorder: "ring-2 ring-amber-500 border-amber-500",
        },
        {
            key: "Ditolak",
            title: "Ditolak",
            count: stats.ditolak,
            icon: XCircle,
            color: "text-rose-600 dark:text-rose-400",
            bgLight: "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40",
            activeBorder: "ring-2 ring-rose-500 border-rose-500",
        },
    ];

    // Tabs configuration
    const tabs = [
        { key: "ALL", label: "Semua", count: stats.total },
        { key: "Menunggu Persetujuan", label: "Menunggu Persetujuan", count: stats.menunggu },
        { key: "Diterima", label: "Diterima", count: stats.diterima },
        { key: "Revisi", label: "Revisi", count: stats.revisi },
        { key: "Ditolak", label: "Ditolak", count: stats.ditolak },
    ];

    return (
        <div className="space-y-6">
            {/* 1. Interactive Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {metricCards.map((card) => {
                    const IconComponent = card.icon;
                    const isActive = selectedStatus === card.key;
                    return (
                        <Card
                            key={card.key}
                            data-testid={`metric-card-${card.key}`}
                            onClick={() => handleStatusSelect(card.key)}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${card.bgLight} ${
                                isActive ? `${card.activeBorder} shadow-sm` : "border-border/60 hover:border-border"
                            }`}
                        >
                            <CardContent className="p-4 flex flex-col justify-between h-full">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-1">
                                        {card.title}
                                    </span>
                                    <div className={`p-1.5 rounded-lg bg-background/80 ${card.color}`}>
                                        <IconComponent className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${card.color}`}>
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
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold tracking-tight text-foreground">
                                Data Calon Siswa
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExportCSV}
                                disabled={filteredPendaftar.length === 0}
                                className="h-9 gap-1.5 text-xs font-medium"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
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
                                        className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                                            isActive
                                                ? "border-primary text-primary font-semibold"
                                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`px-1.5 py-0.5 rounded-full text-[11px] font-semibold ${
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

                {/* Toolbar: Search & Gender Filter */}
                <div className="p-4 sm:px-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-muted/20 border-b border-border/60">
                    <div className="flex flex-1 flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <PendaftarSearch
                            value={searchQuery}
                            onChange={(query) => {
                                setSearchQuery(query);
                                setCurrentPage(1);
                            }}
                            placeholder="Cari nama siswa, orang tua, atau ID registrasi..."
                        />
                        <div className="w-full sm:w-44">
                            <select
                                aria-label="Filter Gender"
                                value={selectedGender}
                                onChange={(e) => {
                                    setSelectedGender(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs sm:text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                            >
                                <option value="">Semua Gender</option>
                                <option value="L">Laki-laki (L)</option>
                                <option value="P">Perempuan (P)</option>
                            </select>
                        </div>
                    </div>

                    {(searchQuery || selectedStatus !== "ALL" || selectedGender) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilter}
                            className="h-9 text-xs text-muted-foreground hover:text-foreground self-end sm:self-auto gap-1"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset Filter
                        </Button>
                    )}
                </div>

                {/* Table View */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/40 hover:bg-muted/40">
                                <TableHead className="w-[140px] font-semibold">ID Registrasi</TableHead>
                                <TableHead className="font-semibold min-w-[200px]">Nama Siswa</TableHead>
                                <TableHead className="font-semibold min-w-[180px]">Nama Orang Tua</TableHead>
                                <TableHead className="font-semibold w-[120px]">Jenis Kelamin</TableHead>
                                <TableHead className="font-semibold w-[130px]">Tanggal Daftar</TableHead>
                                <TableHead className="font-semibold w-[150px]">Status</TableHead>
                                <TableHead className="text-right font-semibold w-[180px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedPendaftar.length > 0 ? (
                                paginatedPendaftar.map((item) => {
                                    const regId = regIdMap.get(item.id) || "MIM-2026-000";
                                    const studentInitials = (item.nama_lengkap || "S")
                                        .split(" ")
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((w) => w[0])
                                        .join("")
                                        .toUpperCase();

                                    const waNumber = item.nomor_telepon ? formatPhoneNumber(item.nomor_telepon) : null;
                                    const waUrl = waNumber
                                        ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
                                              `Assalamu'alaikum Wr. Wb. Terkait pendaftaran calon siswa MIM PK Dimoro atas nama ${item.nama_lengkap || "siswa"}:`
                                          )}`
                                        : null;

                                    return (
                                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
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
                                                        {item.nomor_telepon && (
                                                            <span className="text-[11px] text-muted-foreground mt-0.5">
                                                                {item.nomor_telepon}
                                                            </span>
                                                        )}
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
                                                    {waUrl && (
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                                                            title="Hubungi via WhatsApp"
                                                        >
                                                            <a
                                                                href={waUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label="WhatsApp"
                                                            >
                                                                <MessageCircle className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                                                                <span className="text-xs">WhatsApp</span>
                                                            </a>
                                                        </Button>
                                                    )}
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 px-2.5 text-xs font-medium"
                                                    >
                                                        <Link href={`/admin/pendaftar/detail/${item.id}`} aria-label="Lihat Detail">
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
                                    <TableCell colSpan={7} className="text-center py-12">
                                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-3">
                                            <div className="p-3 rounded-full bg-muted text-muted-foreground">
                                                <Users className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground text-sm">
                                                    Tidak ada data pendaftar
                                                </h3>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {searchQuery || selectedStatus !== "ALL" || selectedGender
                                                        ? "Tidak ditemukan data pendaftar yang sesuai dengan kriteria filter."
                                                        : "Belum ada calon siswa yang mendaftar."}
                                                </p>
                                            </div>
                                            {(searchQuery || selectedStatus !== "ALL" || selectedGender) && (
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

                {/* Pagination & Summary Footer */}
                {totalItems > 0 && (
                    <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80 bg-muted/10">
                        <div className="text-xs text-muted-foreground">
                            Menampilkan <span className="font-medium text-foreground">{startIndex + 1}</span> -{" "}
                            <span className="font-medium text-foreground">
                                {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}
                            </span>{" "}
                            dari <span className="font-medium text-foreground">{totalItems}</span> pendaftar
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={safeCurrentPage <= 1}
                                    className="h-8 px-2 text-xs"
                                    aria-label="Halaman Sebelumnya"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <Button
                                            key={pageNum}
                                            variant={pageNum === safeCurrentPage ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`h-8 w-8 p-0 text-xs ${
                                                pageNum === safeCurrentPage ? "font-bold shadow-sm" : ""
                                            }`}
                                        >
                                            {pageNum}
                                        </Button>
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={safeCurrentPage >= totalPages}
                                    className="h-8 px-2 text-xs"
                                    aria-label="Halaman Berikutnya"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}
