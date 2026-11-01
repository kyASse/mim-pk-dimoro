'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Pencil, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTingkatBadgeClasses } from '@/lib/constants/prestasi';
import DeletePrestasiDialog from './DeletePrestasiDialog';
import { getPrestasiImageUrl, type PrestasiTableItem } from './PrestasiTable';

interface PrestasiMobileListProps {
    items: PrestasiTableItem[];
    onDeleteSuccess?: (id: number) => void;
}

export default function PrestasiMobileList({
    items,
    onDeleteSuccess,
}: PrestasiMobileListProps) {
    return (
        <div className="md:hidden space-y-3">
            {items.map((item) => {
                const badge = getTingkatBadgeClasses(item.tingkat);
                const imageUrl = getPrestasiImageUrl(item.dokumentasi_url);

                return (
                    <div
                        key={item.id}
                        className="rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:border-primary/30"
                    >
                        <div className="flex items-start gap-3.5">
                            {/* Thumbnail Foto / Trophy Icon */}
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/60 flex items-center justify-center text-muted-foreground shadow-2xs">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={item.nama_prestasi || 'Foto Prestasi'}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <Trophy className="w-6 h-6 text-amber-500/80" />
                                )}
                            </div>

                            {/* Content Details */}
                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${badge.combined}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                        {item.tingkat || 'Lainnya'}
                                    </span>

                                    {item.tahun && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                                            <Calendar className="w-3 h-3" />
                                            {item.tahun}
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-semibold text-foreground text-sm line-clamp-2 leading-snug">
                                    {item.nama_prestasi || 'Tanpa Judul'}
                                </h3>

                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <span className="text-foreground font-semibold">
                                        {item.nama_siswa || 'Nama Siswa -'}
                                    </span>
                                </p>

                                {item.deskripsi && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 pt-0.5">
                                        {item.deskripsi}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Mobile Actions Bar */}
                        <div className="mt-3.5 pt-3 border-t border-border/80 flex items-center justify-end gap-2">
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-9 px-3 text-xs font-medium text-foreground border-border hover:bg-muted flex-1 sm:flex-none justify-center"
                            >
                                <Link href={`/admin/akademik/prestasi/edit/${item.id}`}>
                                    <Pencil className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                                    Edit Prestasi
                                </Link>
                            </Button>

                            <DeletePrestasiDialog
                                prestasiId={item.id}
                                prestasiNama={item.nama_prestasi}
                                namaSiswa={item.nama_siswa}
                                onDeleted={onDeleteSuccess}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
