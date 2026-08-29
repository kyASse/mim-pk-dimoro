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
  QUICK_REPLY_TEMPLATES,
  getQuickReplyTemplateById,
  type QuickReplyCategory,
} from '@/lib/utils/pesan-templates';
import { cn } from '@/lib/utils';
import {
  Mail,
  MessageCircle,
  Phone,
  Trash2,
  ExternalLink,
  ChevronDown,
  Clock,
  User,
  Sparkles,
  RotateCcw,
  FileText,
  GraduationCap,
  CreditCard,
  BookOpen,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

interface PesanDetailSheetProps {
  pesan: PesanMasuk | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, newStatus: StatusPesan) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  defaultTab?: 'whatsapp' | 'email';
}

export default function PesanDetailSheet({
  pesan,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
  defaultTab,
}: PesanDetailSheetProps) {
  const [waMessage, setWaMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>(
    defaultTab || (pesan?.telepon ? 'whatsapp' : 'email')
  );
  const [selectedWaTemplate, setSelectedWaTemplate] = useState<QuickReplyCategory | 'default'>('default');
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<QuickReplyCategory | 'default'>('default');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (pesan) {
      const defaultText = generateDefaultReplyMessage(pesan.nama_pengirim, pesan.subjek);
      setWaMessage(defaultText);
      setEmailMessage(defaultText);
      setSelectedWaTemplate('default');
      setSelectedEmailTemplate('default');
      setActiveTab(defaultTab || (pesan.telepon ? 'whatsapp' : 'email'));
    }
  }, [pesan, defaultTab]);

  if (!pesan) return null;

  const formattedDate = new Date(pesan.created_at).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleApplyTemplate = (
    templateId: QuickReplyCategory | 'default',
    target: 'whatsapp' | 'email'
  ) => {
    if (templateId === 'default') {
      const defaultText = generateDefaultReplyMessage(pesan.nama_pengirim, pesan.subjek);
      if (target === 'whatsapp') {
        setWaMessage(defaultText);
        setSelectedWaTemplate('default');
      } else {
        setEmailMessage(defaultText);
        setSelectedEmailTemplate('default');
      }
      toast.info('Template standar diterapkan');
      return;
    }

    const template = getQuickReplyTemplateById(templateId);
    if (template) {
      const generated = template.generateText({
        namaPengirim: pesan.nama_pengirim,
        subjek: pesan.subjek,
      });
      if (target === 'whatsapp') {
        setWaMessage(generated);
        setSelectedWaTemplate(templateId);
      } else {
        setEmailMessage(generated);
        setSelectedEmailTemplate(templateId);
      }
      toast.success(`Template "${template.label}" diterapkan`);
    }
  };

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

  const renderTemplatePills = (
    target: 'whatsapp' | 'email',
    selectedTemplate: QuickReplyCategory | 'default'
  ) => {
    return (
      <div className="space-y-1.5 mb-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Template Balasan Cepat:
          </span>
          {selectedTemplate !== 'default' && (
            <button
              type="button"
              onClick={() => handleApplyTemplate('default', target)}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Standar
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 -mx-1 px-1">
          {/* Default Template Pill */}
          <button
            type="button"
            onClick={() => handleApplyTemplate('default', target)}
            className={cn(
              'shrink-0 whitespace-nowrap min-w-max px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border',
              selectedTemplate === 'default'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-sm ring-1 ring-emerald-400/20'
                : 'bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60'
            )}
          >
            <FileText
              className={cn(
                'w-3.5 h-3.5',
                selectedTemplate === 'default'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-400'
              )}
            />
            <span>Standar</span>
          </button>

          {QUICK_REPLY_TEMPLATES.map((tpl) => {
            const isActive = selectedTemplate === tpl.id;
            const Icon =
              tpl.id === 'ppdb'
                ? GraduationCap
                : tpl.id === 'biaya'
                ? CreditCard
                : tpl.id === 'program'
                ? BookOpen
                : Building2;

            return (
              <button
                key={tpl.id}
                type="button"
                title={tpl.description}
                onClick={() => handleApplyTemplate(tpl.id, target)}
                className={cn(
                  'shrink-0 whitespace-nowrap min-w-max px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border',
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-sm ring-1 ring-emerald-400/20'
                    : 'bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60'
                )}
              >
                <Icon
                  className={cn(
                    'w-3.5 h-3.5',
                    isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
                  )}
                />
                <span>{tpl.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
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

          {/* Sender Profile Box (Data Property Invariance: Icon strictly on header, clean left-aligned data rows) */}
          <div className="my-4 sm:my-5 rounded-2xl p-1 bg-muted/40 dark:bg-muted/20 border border-border/60 shadow-xs">
            <div className="rounded-xl bg-card p-3.5 sm:p-4 border border-border/80 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60 font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>Profil Calon Wali Murid / Pengirim</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div>
                  <span className="block text-[11px] text-muted-foreground font-medium">Nama Lengkap</span>
                  <span className="font-semibold text-foreground">{pesan.nama_pengirim}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-muted-foreground font-medium">Alamat Email</span>
                  <a href={`mailto:${pesan.email_pengirim}`} className="hover:underline text-blue-600 dark:text-blue-400 font-medium break-all">
                    {pesan.email_pengirim}
                  </a>
                </div>
                <div>
                  <span className="block text-[11px] text-muted-foreground font-medium">Nomor WhatsApp / Telp</span>
                  {pesan.telepon ? (
                    <span className="font-medium text-foreground">{pesan.telepon}</span>
                  ) : (
                    <span className="text-muted-foreground italic text-[11px]">Tidak disertakan</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2 mb-5 sm:mb-6">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Isi Pesan Masuk</span>
            </label>
            <div className="p-3.5 sm:p-4 rounded-xl bg-muted/20 dark:bg-muted/10 border border-border/80 text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {pesan.isi_pesan}
            </div>
          </div>

          {/* Reply Section */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Balas Pesan Cepat</span>
            </label>
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as 'whatsapp' | 'email')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-10 p-1 bg-muted/60 rounded-xl">
                <TabsTrigger value="whatsapp" className="shrink-0 whitespace-nowrap min-w-max px-4 gap-2 text-xs font-semibold rounded-lg">
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> WhatsApp
                </TabsTrigger>
                <TabsTrigger value="email" className="shrink-0 whitespace-nowrap min-w-max px-4 gap-2 text-xs font-semibold rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Email
                </TabsTrigger>
              </TabsList>

              {/* WhatsApp Tab */}
              <TabsContent value="whatsapp" className="space-y-3 pt-2">
                {pesan.telepon ? (
                  <>
                    {renderTemplatePills('whatsapp', selectedWaTemplate)}
                    <Textarea
                      rows={6}
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      placeholder="Tulis balasan WhatsApp..."
                      className="text-base sm:text-xs leading-relaxed font-sans rounded-xl resize-none"
                    />
                    <Button
                      onClick={handleSendWhatsApp}
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white font-semibold rounded-xl flex items-center justify-between px-4 shadow-md"
                    >
                      <span className="flex items-center gap-2 text-xs sm:text-sm">
                        <MessageCircle className="w-4 h-4" /> Buka WhatsApp & Kirim Pesan
                      </span>
                      <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </Button>
                  </>
                ) : (
                  <div className="p-4 text-center rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
                    Pengirim tidak mencantumkan nomor telepon. Silakan gunakan tab Email untuk membalas.
                  </div>
                )}
              </TabsContent>

              {/* Email Tab */}
              <TabsContent value="email" className="space-y-3 pt-2">
                {renderTemplatePills('email', selectedEmailTemplate)}
                <Textarea
                  rows={6}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Tulis balasan Email..."
                  className="text-base sm:text-xs leading-relaxed font-sans rounded-xl resize-none"
                />
                <Button
                  onClick={handleSendEmail}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-semibold rounded-xl flex items-center justify-between px-4 shadow-md"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm">
                    <Mail className="w-4 h-4" /> Buka Aplikasi Email (mailto)
                  </span>
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border flex items-center justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5 text-xs">
                <Trash2 className="w-4 h-4" /> Hapus Pesan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md rounded-2xl p-5 sm:p-6">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base sm:text-lg font-bold">Hapus Pesan Masuk?</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
                  Pesan dari <strong className="text-foreground">{pesan.nama_pengirim}</strong> akan dihapus permanen dari sistem. Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                <AlertDialogCancel className="h-10 sm:h-9 text-xs">Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="h-10 sm:h-9 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold">
                  Hapus Permanen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" size="sm" onClick={onClose} className="h-9 px-4 text-xs">
            Tutup
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
