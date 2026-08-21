// components/admin/pesan/PesanDetailSheet.tsx
'use client';

import { useState, useEffect } from 'react';
import { PesanMasuk, StatusPesan } from '@/types/pesan';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PesanStatusBadge from './PesanStatusBadge';
import {
  generateDefaultReplyMessage,
  generateWhatsAppReplyUrl,
  generateMailtoUrl,
} from '@/lib/utils/pesan-utils';
import {
  Mail,
  MessageCircle,
  Phone,
  Trash2,
  ExternalLink,
  ChevronDown,
  Clock,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

interface PesanDetailSheetProps {
  pesan: PesanMasuk | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, newStatus: StatusPesan) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function PesanDetailSheet({
  pesan,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
}: PesanDetailSheetProps) {
  const [waMessage, setWaMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (pesan) {
      const template = generateDefaultReplyMessage(pesan.nama_pengirim, pesan.subjek);
      setWaMessage(template);
      setEmailMessage(template);
    }
  }, [pesan]);

  if (!pesan) return null;

  const formattedDate = new Date(pesan.created_at).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleSendWhatsApp = async () => {
    const url = generateWhatsAppReplyUrl(pesan.telepon, waMessage);
    if (!url) {
      toast.error('Nomor telepon tidak valid untuk WhatsApp');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    if (pesan.status !== 'dibalas') {
      setIsUpdating(true);
      await onStatusChange(pesan.id, 'dibalas');
      setIsUpdating(false);
    }
  };

  const handleSendEmail = async () => {
    const url = generateMailtoUrl(pesan.email_pengirim, pesan.subjek, emailMessage);
    if (!url) {
      toast.error('Email pengirim tidak valid');
      return;
    }
    window.location.href = url;
    if (pesan.status !== 'dibalas') {
      setIsUpdating(true);
      await onStatusChange(pesan.id, 'dibalas');
      setIsUpdating(false);
    }
  };

  const handleManualStatusChange = async (status: StatusPesan) => {
    setIsUpdating(true);
    await onStatusChange(pesan.id, status);
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    await onDelete(pesan.id);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6 flex flex-col justify-between">
        <div>
          {/* Header */}
          <SheetHeader className="space-y-3 pb-4 border-b">
            <div className="flex items-center justify-between">
              <PesanStatusBadge status={pesan.status} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isUpdating} className="h-8 gap-1 text-xs">
                    Ubah Status <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleManualStatusChange('belum_dibaca')}>
                    Tandai Belum Dibaca
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleManualStatusChange('dibaca')}>
                    Tandai Sudah Dibaca
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleManualStatusChange('dibalas')}>
                    Tandai Dibalas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <SheetTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {pesan.subjek || '(Tanpa Subjek)'}
            </SheetTitle>
            <SheetDescription className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" /> {formattedDate} WIB
            </SheetDescription>
          </SheetHeader>

          {/* Sender Profile Box */}
          <div className="my-5 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-medium">
              <User className="w-4 h-4 text-gray-400" />
              <span>{pesan.nama_pengirim}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${pesan.email_pengirim}`} className="hover:underline text-blue-600 dark:text-blue-400">
                {pesan.email_pengirim}
              </a>
            </div>
            {pesan.telepon ? (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{pesan.telepon}</span>
              </div>
            ) : (
              <div className="text-xs text-gray-400 italic">Nomor telepon tidak disertakan</div>
            )}
          </div>

          {/* Message Content */}
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Isi Pesan
            </label>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {pesan.isi_pesan}
            </div>
          </div>

          {/* Reply Section */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Balas Pesan Cepat
            </label>
            <Tabs defaultValue={pesan.telepon ? 'whatsapp' : 'email'} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="whatsapp" className="gap-2 text-xs">
                  <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp
                </TabsTrigger>
                <TabsTrigger value="email" className="gap-2 text-xs">
                  <Mail className="w-4 h-4 text-blue-600" /> Email
                </TabsTrigger>
              </TabsList>

              {/* WhatsApp Tab */}
              <TabsContent value="whatsapp" className="space-y-3 pt-2">
                {pesan.telepon ? (
                  <>
                    <Textarea
                      rows={5}
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      placeholder="Tulis balasan WhatsApp..."
                      className="text-xs leading-relaxed"
                    />
                    <Button
                      onClick={handleSendWhatsApp}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> Buka WhatsApp & Kirim
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </>
                ) : (
                  <div className="p-4 text-center rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                    Pengirim tidak mencantumkan nomor telepon. Silakan gunakan tab Email untuk membalas.
                  </div>
                )}
              </TabsContent>

              {/* Email Tab */}
              <TabsContent value="email" className="space-y-3 pt-2">
                <Textarea
                  rows={5}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Tulis balasan Email..."
                  className="text-xs leading-relaxed"
                />
                <Button
                  onClick={handleSendEmail}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Mail className="w-4 h-4" /> Buka Aplikasi Email (mailto)
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 mt-6 border-t flex items-center justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5">
                <Trash2 className="w-4 h-4" /> Hapus Pesan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Pesan Masuk?</AlertDialogTitle>
                <AlertDialogDescription>
                  Pesan dari <strong>{pesan.nama_pengirim}</strong> akan dihapus permanen dari sistem. Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                  Hapus Permanen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
