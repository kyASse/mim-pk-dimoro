// components/admin/pesan/PesanTable.tsx
'use client';

import { PesanMasuk } from '@/types/pesan';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import PesanStatusBadge from './PesanStatusBadge';
import { Eye, Mail, MessageCircle } from 'lucide-react';

interface PesanTableProps {
  pesanList: PesanMasuk[];
  onSelectPesan: (pesan: PesanMasuk) => void;
}

export default function PesanTable({ pesanList, onSelectPesan }: PesanTableProps) {
  if (pesanList.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
        <Mail className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <p className="font-medium text-gray-700 dark:text-gray-300">Tidak ada pesan yang cocok</p>
        <p className="text-xs text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter status Anda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/75 dark:bg-gray-800/80">
            <TableHead className="w-[180px]">Pengirim</TableHead>
            <TableHead className="w-[180px]">Kontak</TableHead>
            <TableHead>Subjek & Pesan</TableHead>
            <TableHead className="w-[140px]">Tanggal</TableHead>
            <TableHead className="w-[130px]">Status</TableHead>
            <TableHead className="w-[80px] text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pesanList.map((item) => {
            const isUnread = item.status === 'belum_dibaca';
            const dateStr = new Date(item.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <TableRow
                key={item.id}
                onClick={() => onSelectPesan(item)}
                className={`cursor-pointer transition-colors ${
                  isUnread
                    ? 'bg-amber-50/40 dark:bg-amber-950/10 font-medium hover:bg-amber-50/70'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {isUnread && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                    <span className="truncate">{item.nama_pengirim}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    <div className="truncate text-gray-600 dark:text-gray-300">{item.email_pengirim}</div>
                    {item.telepon && (
                      <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono">
                        <MessageCircle className="w-3 h-3" /> {item.telepon}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5 max-w-md">
                    <div className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                      {item.subjek || '(Tanpa Subjek)'}
                    </div>
                    <div className="text-xs text-gray-500 truncate line-clamp-1">
                      {item.isi_pesan}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-gray-500">{dateStr}</TableCell>
                <TableCell>
                  <PesanStatusBadge status={item.status} />
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectPesan(item)}
                    className="h-8 w-8 p-0"
                    aria-label={`Lihat detail pesan dari ${item.nama_pengirim}`}
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
