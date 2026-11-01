'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTingkatBadgeClasses } from '@/lib/constants/prestasi';
import DeletePrestasiDialog from './DeletePrestasiDialog';

export interface PrestasiTableItem {
    id: number;
    tahun: number | null;
    nama_prestasi: string | null;
    tingkat: string | null;
    nama_siswa: string | null;
    deskripsi?: string | null;
    dokumentasi_url?: string | null;
    created_at?: string;
}

interface PrestasiTableProps {
    items: PrestasiTableItem[];
    onDeleteSuccess?: (id: number) => void;
}

export function getPrestasiImageUrl(path?: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!supabaseUrl) return null;
    return `${supabaseUrl}/storage/v1/object/public/dokumentasi-prestasi/${path}`;
}

export default function PrestasiTable({ items, onDeleteSuccess }: PrestasiTableProps) {
    return (
        <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6 w-12 text-center">
                                No
                            </th>
                            <th scope="col" className="px-4 py-3.5 min-w-[200px]">
                                Santri / Siswa
                            </th>
                            <th scope="col" className="px-4 py-3.5 min-w-[240px]">
                                Prestasi & Kejuaraan
                            </th>
                            <th scope="col" className="px-4 py-3.5 min-w-[130px]">
                                Tingkat
                            </th>
                            <th scope="col" className="px-4 py-3.5 min-w-[90px] text-center">
                                Tahun
                            </th>
                            <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 text-right min-w-[120px]">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card text-foreground">
                        {items.map((item, index) => {
                            const badge = getTingkatBadgeClasses(item.tingkat);
                            const imageUrl = getPrestasiImageUrl(item.dokumentasi_url);

                            return (
                                <tr
                                    key={item.id}
                                    className="transition-colors hover:bg-muted/40 group"
                                >
                                    {/* Kolom No */}
                                    <td className="py-4 pl-4 pr-3 sm:pl-6 text-center text-xs font-medium text-muted-foreground">
                                        {index + 1}
                                    </td>

                                    {/* Kolom Siswa & Thumbnail */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/60 flex items-center justify-center text-muted-foreground shadow-xs">
                                                {imageUrl ? (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={item.nama_prestasi || 'Foto Prestasi'}
                                                        fill
                                                        sizes="40px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Trophy className="w-5 h-5 text-amber-500/80" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-foreground text-sm truncate max-w-[180px]">
                                                    {item.nama_siswa || 'Nama Siswa -'}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                                    MIM PK Dimoro
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Kolom Nama Prestasi */}
                                    <td className="px-4 py-4">
                                        <div className="space-y-1">
                                            <p className="font-medium text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                                {item.nama_prestasi || 'Tanpa Judul'}
                                            </p>
                                            {item.deskripsi && (
                                                <p className="text-xs text-muted-foreground line-clamp-1 max-w-[320px]">
                                                    {item.deskripsi}
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    {/* Kolom Tingkat */}
                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badge.combined}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                            {item.tingkat || 'Lainnya'}
                                        </span>
                                    </td>

                                    {/* Kolom Tahun */}
                                    <td className="px-4 py-4 text-center">
                                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-muted text-foreground border border-border">
                                            {item.tahun || '-'}
                                        </span>
                                    </td>

                                    {/* Kolom Aksi */}
                                    <td className="py-4 pl-3 pr-4 sm:pr-6 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="h-8 px-2.5 text-xs font-medium text-foreground border-border hover:bg-muted"
                                                title="Edit data prestasi"
                                            >
                                                <Link href={`/admin/akademik/prestasi/edit/${item.id}`}>
                                                    <Pencil className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                                                    Edit
                                                </Link>
                                            </Button>

                                            <DeletePrestasiDialog
                                                prestasiId={item.id}
                                                prestasiNama={item.nama_prestasi}
                                                namaSiswa={item.nama_siswa}
                                                onDeleted={onDeleteSuccess}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
