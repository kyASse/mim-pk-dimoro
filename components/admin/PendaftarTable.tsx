"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import PendaftarSearch from "./PendaftarSearch";
import { getStatusBadgeVariant, getStatusDisplayText } from "@/lib/utils/pendaftar-stats";

type Pendaftar = {
    id: string;
    nama_lengkap: string | null;
    nama_ayah_kandung: string | null;
    nama_ibu_kandung?: string | null;
    jenis_kelamin: string | null;
    tanggal_lahir: string | null;
    status_pendaftaran: string | null;
    created_at: string;
};

interface PendaftarTableProps {
    pendaftar: Pendaftar[];
}

export default function PendaftarTable({ pendaftar }: PendaftarTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter data berdasarkan search query
    const filteredPendaftar = useMemo(() => {
        if (!searchQuery) return pendaftar;
    
        return pendaftar.filter((item) => {
        const nama = item.nama_lengkap?.toLowerCase() || '';
        const ayah = item.nama_ayah_kandung?.toLowerCase() || '';
        const ibu = item.nama_ibu_kandung?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        
        return nama.includes(query) || ayah.includes(query) || ibu.includes(query);
        });
    }, [pendaftar, searchQuery]);

    // Helper function untuk status badge menggunakan utility function
    const getStatusBadge = (status: string | null) => {
        const variant = getStatusBadgeVariant(status || '');
        const displayText = getStatusDisplayText(status || '');
        
        // Custom styling berdasarkan status untuk konsistensi visual
        const getCustomClass = (status: string | null) => {
            switch (status) {
                case 'Diterima':
                    return "bg-green-100 text-green-800 border-green-300";
                case 'Revisi':
                    return "bg-orange-100 text-orange-800 border-orange-300";
                case 'Ditolak':
                    return "bg-red-100 text-red-800 border-red-300";
                default:
                    return "bg-gray-100 text-gray-800 border-gray-300";
            }
        };

        return (
            <Badge variant={variant} className={getCustomClass(status)}>
                {displayText}
            </Badge>
        );
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <PendaftarSearch 
                onSearch={setSearchQuery}
                placeholder="Cari nama siswa atau ID registrasi"
            />

            {/* Daftar Siswa Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Siswa</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Id</TableHead>
                                <TableHead>Nama Anak</TableHead>
                                <TableHead>Nama Orang Tua</TableHead>
                                <TableHead>Jenis Kelamin</TableHead>
                                <TableHead>Tanggal Daftar</TableHead>
                                <TableHead>Status Pendaftaran</TableHead>
                                <TableHead className="w-[100px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPendaftar && filteredPendaftar.length > 0 ? (
                                filteredPendaftar.map((item: Pendaftar, index: number) => (
                                    <TableRow key={item.id}>
                                        <TableCell>TK25-{String(index + 1).padStart(2, '0')}</TableCell>
                                        <TableCell className="font-medium">{item.nama_lengkap || 'Nama tidak tersedia'}</TableCell>
                                        <TableCell>
                                            {item.nama_ayah_kandung || 'Tidak tersedia'} / {item.nama_ibu_kandung || 'Tidak tersedia'}
                                        </TableCell>
                                        <TableCell>
                                            {item.jenis_kelamin === 'L' ? 'Laki-laki' : 
                                            item.jenis_kelamin === 'P' ? 'Perempuan' : 
                                            item.jenis_kelamin || 'Tidak tersedia'}
                                        </TableCell>
                                        <TableCell>{new Date(item.created_at).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell>
                                            {getStatusBadge(item.status_pendaftaran)}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/pendaftar/detail/${item.id}`}>
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Lihat Detail
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                        {searchQuery ? 'Tidak ada hasil yang ditemukan.' : 'Belum ada pendaftar baru.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
