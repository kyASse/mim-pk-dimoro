// components/admin/pesan/PesanManagement.tsx
'use client';

import { useState, useMemo } from 'react';
import { PesanMasuk, StatusPesan } from '@/types/pesan';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PesanTable from './PesanTable';
import PesanDetailSheet from './PesanDetailSheet';
import { calculatePesanStats } from '@/lib/utils/pesan-utils';
import {
  updatePesanStatusAction,
  deletePesanAction,
  markAllAsReadAction,
} from '@/app/admin/pesan/actions';
import { Search, Inbox, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface PesanManagementProps {
  initialPesan: PesanMasuk[];
}

export default function PesanManagement({ initialPesan }: PesanManagementProps) {
  const [pesanList, setPesanList] = useState<PesanMasuk[]>(initialPesan);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | StatusPesan>('semua');
  const [selectedPesan, setSelectedPesan] = useState<PesanMasuk | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const stats = useMemo(() => calculatePesanStats(pesanList), [pesanList]);

  const filteredPesan = useMemo(() => {
    return pesanList.filter((item) => {
      const matchesStatus = statusFilter === 'semua' ? true : item.status === statusFilter;
      if (!matchesStatus) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.nama_pengirim.toLowerCase().includes(q) ||
        item.email_pengirim.toLowerCase().includes(q) ||
        (item.subjek && item.subjek.toLowerCase().includes(q)) ||
        item.isi_pesan.toLowerCase().includes(q) ||
        (item.telepon && item.telepon.includes(q))
      );
    });
  }, [pesanList, searchQuery, statusFilter]);

  const handleOpenDetail = async (pesan: PesanMasuk) => {
    setSelectedPesan(pesan);
    setIsSheetOpen(true);

    if (pesan.status === 'belum_dibaca') {
      // Optimistic update
      setPesanList((prev) =>
        prev.map((p) => (p.id === pesan.id ? { ...p, status: 'dibaca' } : p))
      );
      setSelectedPesan((prev) => (prev ? { ...prev, status: 'dibaca' } : null));

      await updatePesanStatusAction(pesan.id, 'dibaca');
    }
  };

  const handleStatusChange = async (id: number, newStatus: StatusPesan) => {
    setPesanList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    if (selectedPesan && selectedPesan.id === id) {
      setSelectedPesan((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    const res = await updatePesanStatusAction(id, newStatus);
    if (res.success) {
      toast.success(`Status berhasil diubah menjadi ${newStatus.replace('_', ' ')}`);
    } else {
      toast.error(res.error || 'Gagal mengubah status');
    }
  };

  const handleDelete = async (id: number) => {
    setPesanList((prev) => prev.filter((p) => p.id !== id));
    const res = await deletePesanAction(id);
    if (res.success) {
      toast.success('Pesan berhasil dihapus');
    } else {
      toast.error(res.error || 'Gagal menghapus pesan');
    }
  };

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    setPesanList((prev) =>
      prev.map((p) => (p.status === 'belum_dibaca' ? { ...p, status: 'dibaca' } : p))
    );
    const res = await markAllAsReadAction();
    setIsMarkingAll(false);
    if (res.success) {
      toast.success('Semua pesan ditandai sudah dibaca');
    } else {
      toast.error(res.error || 'Gagal memperbarui status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Pesan</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-gray-700 rounded-lg">
              <Inbox className="w-5 h-5 text-slate-700 dark:text-gray-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Belum Dibaca</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.belumDibaca}</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Sudah Dibalas</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.dibalas}</p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar: Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as 'semua' | StatusPesan)}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="semua" className="text-xs">
              Semua ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="belum_dibaca" className="text-xs">
              Belum Dibaca ({stats.belumDibaca})
            </TabsTrigger>
            <TabsTrigger value="dibaca" className="text-xs">
              Dibaca ({stats.dibaca})
            </TabsTrigger>
            <TabsTrigger value="dibalas" className="text-xs">
              Dibalas ({stats.dibalas})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengirim, subjek, email..."
              className="pl-9 text-xs h-9"
            />
          </div>

          {stats.belumDibaca > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={isMarkingAll}
              className="text-xs h-9 gap-1.5 whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isMarkingAll ? 'animate-spin' : ''}`} />
              Tandai Semua Dibaca
            </Button>
          )}
        </div>
      </div>

      {/* Message Table */}
      <PesanTable pesanList={filteredPesan} onSelectPesan={handleOpenDetail} />

      {/* Slide-over Detail Sheet */}
      <PesanDetailSheet
        pesan={selectedPesan}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedPesan(null);
        }}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
