# Admin Pesan Masuk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun antarmuka manajemen pesan masuk di Admin Dashboard (`/admin/pesan`) untuk membaca, menyaring status, membalas via WhatsApp/Email secara langsung, serta mengelola pesan kontak publik MIM PK Dimoro.

**Architecture:** Server Component Next.js 15 (`app/admin/pesan/page.tsx`) memverifikasi autentikasi dan memuat data awal dari Supabase tabel `pesan_masuk`. Client Component (`PesanManagement`) mengelola pencarian instan, filter tab, kartu metrik, tabel data (`PesanTable`), dan Slide-over Drawer (`PesanDetailSheet`). Perubahan status dan penghapusan diproses melalui Server Actions (`actions.ts`) dengan revalidasi path dan umpan balik toast.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI (`Sheet`, `Badge`, `Button`, `Card`, `Table`, `Tabs`, `AlertDialog`, `Textarea`, `Input`), Supabase Client/Server, Lucide Icons, Vitest.

---

### Task 1: Type Definitions & Pesan Utility Functions (TDD)

**Files:**
- Create: `types/pesan.ts`
- Create: `lib/utils/pesan-utils.ts`
- Test: `lib/utils/__tests__/pesan-utils.test.ts`

- [ ] **Step 1: Write failing tests for utility functions**

```typescript
// lib/utils/__tests__/pesan-utils.test.ts
import { describe, it, expect } from 'vitest';
import {
  formatWhatsAppNumber,
  generateWhatsAppReplyUrl,
  generateMailtoUrl,
  calculatePesanStats,
  generateDefaultReplyMessage,
} from '../pesan-utils';
import { PesanMasuk } from '@/types/pesan';

describe('pesan-utils', () => {
  describe('formatWhatsAppNumber', () => {
    it('normalizes local 08xx number to international 628xx format', () => {
      expect(formatWhatsAppNumber('08123456789')).toBe('628123456789');
    });

    it('handles number with spaces, dashes, and + signs', () => {
      expect(formatWhatsAppNumber('+62 812-3456-7890')).toBe('6281234567890');
      expect(formatWhatsAppNumber('0812-3456-7890')).toBe('6281234567890');
    });

    it('returns empty string when number is null or empty', () => {
      expect(formatWhatsAppNumber(null)).toBe('');
      expect(formatWhatsAppNumber('')).toBe('');
    });
  });

  describe('generateDefaultReplyMessage', () => {
    it('creates polite school template with sender name and subject', () => {
      const msg = generateDefaultReplyMessage('Ahmad Subarjo', 'Info PPDB');
      expect(msg).toContain('Ahmad Subarjo');
      expect(msg).toContain('Info PPDB');
      expect(msg).toContain('MIM PK Dimoro');
    });
  });

  describe('generateWhatsAppReplyUrl', () => {
    it('generates wa.me URL with properly encoded text', () => {
      const url = generateWhatsAppReplyUrl('08123456789', 'Halo Ahmad');
      expect(url).toContain('https://wa.me/628123456789?text=Halo%20Ahmad');
    });

    it('returns empty string if phone number is invalid or empty', () => {
      expect(generateWhatsAppReplyUrl('', 'Halo')).toBe('');
      expect(generateWhatsAppReplyUrl(null, 'Halo')).toBe('');
    });
  });

  describe('generateMailtoUrl', () => {
    it('generates mailto link with encoded subject and body', () => {
      const url = generateMailtoUrl('wali@example.com', 'Info PPDB', 'Halo Bapak');
      expect(url).toContain('mailto:wali@example.com');
      expect(url).toContain('subject=Re%3A%20Info%20PPDB%20-%20MIM%20PK%20Dimoro');
      expect(url).toContain('body=Halo%20Bapak');
    });
  });

  describe('calculatePesanStats', () => {
    it('accurately counts total, belum_dibaca, dibaca, and dibalas', () => {
      const mockData: PesanMasuk[] = [
        {
          id: 1,
          nama_pengirim: 'User 1',
          email_pengirim: 'u1@test.com',
          telepon: '081',
          subjek: 'Sub 1',
          isi_pesan: 'Pesan 1',
          status: 'belum_dibaca',
          created_at: '2026-08-21T10:00:00Z',
          updated_at: '2026-08-21T10:00:00Z',
        },
        {
          id: 2,
          nama_pengirim: 'User 2',
          email_pengirim: 'u2@test.com',
          telepon: '082',
          subjek: 'Sub 2',
          isi_pesan: 'Pesan 2',
          status: 'dibaca',
          created_at: '2026-08-21T10:00:00Z',
          updated_at: '2026-08-21T10:00:00Z',
        },
        {
          id: 3,
          nama_pengirim: 'User 3',
          email_pengirim: 'u3@test.com',
          telepon: '083',
          subjek: 'Sub 3',
          isi_pesan: 'Pesan 3',
          status: 'dibalas',
          created_at: '2026-08-21T10:00:00Z',
          updated_at: '2026-08-21T10:00:00Z',
        },
      ];

      const stats = calculatePesanStats(mockData);
      expect(stats.total).toBe(3);
      expect(stats.belumDibaca).toBe(1);
      expect(stats.dibaca).toBe(1);
      expect(stats.dibalas).toBe(1);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test lib/utils/__tests__/pesan-utils.test.ts`
Expected: FAIL (module or types not found).

- [ ] **Step 3: Implement Types & Pesan Utilities**

```typescript
// types/pesan.ts
export type StatusPesan = 'belum_dibaca' | 'dibaca' | 'dibalas';

export interface PesanMasuk {
  id: number;
  nama_pengirim: string;
  email_pengirim: string;
  telepon: string | null;
  subjek: string | null;
  isi_pesan: string;
  status: StatusPesan;
  created_at: string;
  updated_at: string;
}

export interface PesanStats {
  total: number;
  belumDibaca: number;
  dibaca: number;
  dibalas: number;
}
```

```typescript
// lib/utils/pesan-utils.ts
import { PesanMasuk, PesanStats } from '@/types/pesan';
import { SCHOOL_NAME } from '@/lib/school-config';

export function formatWhatsAppNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s-+()]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }
  return cleaned;
}

export function generateDefaultReplyMessage(
  namaPengirim: string,
  subjek: string | null | undefined
): string {
  const subjekText = subjek ? ` terkait "${subjek}"` : '';
  return `Assalamu’alaikum Wr. Wb. Bapak/Ibu ${namaPengirim},\n\nTerima kasih telah menghubungi ${SCHOOL_NAME}${subjekText}.\n\n[Tulis balasan pesan Anda di sini]\n\nWassalamu’alaikum Wr. Wb.\nAdmin ${SCHOOL_NAME}`;
}

export function generateWhatsAppReplyUrl(
  phone: string | null | undefined,
  message: string
): string {
  const formatted = formatWhatsAppNumber(phone);
  if (!formatted) return '';
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formatted}?text=${encodedMessage}`;
}

export function generateMailtoUrl(
  email: string,
  subjek: string | null | undefined,
  body: string
): string {
  if (!email) return '';
  const subjectPrefix = subjek ? `Re: ${subjek} - ${SCHOOL_NAME}` : `Tanggapan Pesan - ${SCHOOL_NAME}`;
  const encodedSubject = encodeURIComponent(subjectPrefix);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}

export function calculatePesanStats(pesanList: PesanMasuk[] | null | undefined): PesanStats {
  if (!pesanList || !Array.isArray(pesanList)) {
    return { total: 0, belumDibaca: 0, dibaca: 0, dibalas: 0 };
  }

  return pesanList.reduce(
    (acc, item) => {
      acc.total += 1;
      if (item.status === 'belum_dibaca') acc.belumDibaca += 1;
      else if (item.status === 'dibaca') acc.dibaca += 1;
      else if (item.status === 'dibalas') acc.dibalas += 1;
      return acc;
    },
    { total: 0, belumDibaca: 0, dibaca: 0, dibalas: 0 }
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test lib/utils/__tests__/pesan-utils.test.ts`
Expected: PASS with 100% assertions passing.

- [ ] **Step 5: Commit**

```bash
git add types/pesan.ts lib/utils/pesan-utils.ts lib/utils/__tests__/pesan-utils.test.ts
git commit -m "feat(pesan): add type definitions and helper utilities with tests"
```

---

### Task 2: Server Actions for Pesan Management (TDD)

**Files:**
- Create: `app/admin/pesan/actions.ts`
- Test: `app/admin/pesan/__tests__/actions.test.ts`

- [ ] **Step 1: Write failing unit test for Server Actions**

```typescript
// app/admin/pesan/__tests__/actions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updatePesanStatusAction, deletePesanAction, markAllAsReadAction } from '../actions';

// Mock Supabase Server Client
const mockEq = vi.fn();
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockDelete = vi.fn(() => ({ eq: mockEq }));
const mockSelect = vi.fn();
const mockFrom = vi.fn(() => ({
  update: mockUpdate,
  delete: mockDelete,
  select: mockSelect,
}));

const mockGetUser = vi.fn();
const mockCreateClient = vi.fn(() => ({
  auth: { getUser: mockGetUser },
  from: mockFrom,
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => mockCreateClient(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Admin Pesan Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updatePesanStatusAction', () => {
    it('returns error if user is unauthenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });
      const result = await updatePesanStatusAction(1, 'dibaca');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unauthorized');
    });

    it('updates status and revalidates path for authenticated admin', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'admin-123' } }, error: null });
      mockEq.mockResolvedValueOnce({ error: null });

      const result = await updatePesanStatusAction(1, 'dibaca');
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('pesan_masuk');
    });
  });

  describe('deletePesanAction', () => {
    it('deletes message by id for authenticated admin', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'admin-123' } }, error: null });
      mockEq.mockResolvedValueOnce({ error: null });

      const result = await deletePesanAction(1);
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('pesan_masuk');
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test app/admin/pesan/__tests__/actions.test.ts`
Expected: FAIL (actions not defined).

- [ ] **Step 3: Implement Server Actions**

```typescript
// app/admin/pesan/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { StatusPesan } from '@/types/pesan';

export async function updatePesanStatusAction(
  id: number,
  status: StatusPesan
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Harap login terlebih dahulu' };
    }

    const { error } = await supabase
      .from('pesan_masuk')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/pesan');
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return { success: false, error: errorMsg };
  }
}

export async function deletePesanAction(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Harap login terlebih dahulu' };
    }

    const { error } = await supabase
      .from('pesan_masuk')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/pesan');
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return { success: false, error: errorMsg };
  }
}

export async function markAllAsReadAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Harap login terlebih dahulu' };
    }

    const { error } = await supabase
      .from('pesan_masuk')
      .update({
        status: 'dibaca',
        updated_at: new Date().toISOString(),
      })
      .eq('status', 'belum_dibaca');

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/pesan');
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return { success: false, error: errorMsg };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test app/admin/pesan/__tests__/actions.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/admin/pesan/actions.ts app/admin/pesan/__tests__/actions.test.ts
git commit -m "feat(pesan): add server actions for message status and deletion with tests"
```

---

### Task 3: Status Badge & Detail Slide-Over Drawer Components

**Files:**
- Create: `components/admin/pesan/PesanStatusBadge.tsx`
- Create: `components/admin/pesan/PesanDetailSheet.tsx`

- [ ] **Step 1: Create `PesanStatusBadge.tsx`**

```tsx
// components/admin/pesan/PesanStatusBadge.tsx
import { Badge } from '@/components/ui/badge';
import { StatusPesan } from '@/types/pesan';

interface PesanStatusBadgeProps {
  status: StatusPesan;
  className?: string;
}

export default function PesanStatusBadge({ status, className = '' }: PesanStatusBadgeProps) {
  switch (status) {
    case 'belum_dibaca':
      return (
        <Badge
          variant="outline"
          className={`bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 font-medium ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
          Belum Dibaca
        </Badge>
      );
    case 'dibaca':
      return (
        <Badge
          variant="outline"
          className={`bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-medium ${className}`}
        >
          Sudah Dibaca
        </Badge>
      );
    case 'dibalas':
      return (
        <Badge
          variant="outline"
          className={`bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-medium ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          Dibalas
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
```

- [ ] **Step 2: Create `PesanDetailSheet.tsx`**

```tsx
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
  Calendar,
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
```

- [ ] **Step 3: Commit**

```bash
git add components/admin/pesan/PesanStatusBadge.tsx components/admin/pesan/PesanDetailSheet.tsx
git commit -m "feat(pesan): add PesanStatusBadge and PesanDetailSheet components"
```

---

### Task 4: Pesan Table & Pesan Management Client Container (TDD)

**Files:**
- Create: `components/admin/pesan/PesanTable.tsx`
- Create: `components/admin/pesan/PesanManagement.tsx`
- Test: `components/admin/pesan/__tests__/PesanManagement.test.tsx`

- [ ] **Step 1: Write component test for PesanManagement**

```tsx
// components/admin/pesan/__tests__/PesanManagement.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PesanManagement from '../PesanManagement';
import { PesanMasuk } from '@/types/pesan';

const mockPesanList: PesanMasuk[] = [
  {
    id: 1,
    nama_pengirim: 'Budi Santoso',
    email_pengirim: 'budi@test.com',
    telepon: '08123456789',
    subjek: 'Pertanyaan Biaya Masuk',
    isi_pesan: 'Mohon info rincian biaya pendaftaran tahun ini.',
    status: 'belum_dibaca',
    created_at: '2026-08-21T09:00:00Z',
    updated_at: '2026-08-21T09:00:00Z',
  },
  {
    id: 2,
    nama_pengirim: 'Siti Aminah',
    email_pengirim: 'siti@test.com',
    telepon: null,
    subjek: 'Jadwal Observasi',
    isi_pesan: 'Kapan jadwal observasi siswa baru dimulai?',
    status: 'dibalas',
    created_at: '2026-08-20T10:00:00Z',
    updated_at: '2026-08-20T11:00:00Z',
  },
];

vi.mock('@/app/admin/pesan/actions', () => ({
  updatePesanStatusAction: vi.fn().mockResolvedValue({ success: true }),
  deletePesanAction: vi.fn().mockResolvedValue({ success: true }),
  markAllAsReadAction: vi.fn().mockResolvedValue({ success: true }),
}));

describe('PesanManagement', () => {
  it('renders stats cards with correct numbers', () => {
    render(<PesanManagement initialPesan={mockPesanList} />);
    expect(screen.getByText('Total Pesan')).toBeDefined();
    expect(screen.getByText('Belum Dibaca')).toBeDefined();
    expect(screen.getByText('Sudah Dibalas')).toBeDefined();
  });

  it('filters message list when searching', () => {
    render(<PesanManagement initialPesan={mockPesanList} />);
    const searchInput = screen.getByPlaceholderText(/Cari pengirim, subjek, email/i);
    fireEvent.change(searchInput, { target: { value: 'Budi' } });

    expect(screen.getByText('Budi Santoso')).toBeDefined();
    expect(screen.queryByText('Siti Aminah')).toBeNull();
  });

  it('filters message by status tab', () => {
    render(<PesanManagement initialPesan={mockPesanList} />);
    const unreadTab = screen.getByRole('tab', { name: /Belum Dibaca/i });
    fireEvent.click(unreadTab);

    expect(screen.getByText('Budi Santoso')).toBeDefined();
    expect(screen.queryByText('Siti Aminah')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test components/admin/pesan/__tests__/PesanManagement.test.tsx`
Expected: FAIL (component not found).

- [ ] **Step 3: Implement `PesanTable.tsx` & `PesanManagement.tsx`**

```tsx
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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
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
```

```tsx
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
import { Search, Mail, Inbox, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
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
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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

        <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50">
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

        <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50">
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test components/admin/pesan/__tests__/PesanManagement.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/admin/pesan/PesanTable.tsx components/admin/pesan/PesanManagement.tsx components/admin/pesan/__tests__/PesanManagement.test.tsx
git commit -m "feat(pesan): add PesanTable and PesanManagement client container with tests"
```

---

### Task 5: Admin Page Route & Sidebar Integration

**Files:**
- Create: `app/admin/pesan/page.tsx`
- Modify: `components/app-sidebar.tsx`

- [ ] **Step 1: Create `app/admin/pesan/page.tsx`**

```tsx
// app/admin/pesan/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PesanManagement from '@/components/admin/pesan/PesanManagement';
import { PesanMasuk } from '@/types/pesan';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPesanPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }

  const { data: pesanData, error } = await supabase
    .from('pesan_masuk')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pesan_masuk:', error);
  }

  const listPesan: PesanMasuk[] = (pesanData as PesanMasuk[]) || [];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Pesan Masuk
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Kelola dan balas pesan pertanyaan serta masukan dari formulir kontak website
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Link href="/admin" className="flex items-center gap-2 text-xs">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dasbor
          </Link>
        </Button>
      </div>

      {/* Main Interactive Management View */}
      <PesanManagement initialPesan={listPesan} />
    </div>
  );
}
```

- [ ] **Step 2: Update `components/app-sidebar.tsx` with Pesan Masuk menu**

Add `Inbox` icon import and insert menu entry in `navMainData`:
```tsx
{
  title: "Pesan Masuk",
  url: "/admin/pesan",
  icon: Inbox,
  items: [
    {
      title: "Daftar Pesan",
      url: "/admin/pesan",
    },
  ],
},
```

- [ ] **Step 3: Run Vitest test suite**

Run: `npm test`
Expected: All tests PASS.

- [ ] **Step 4: Commit**

```bash
git add app/admin/pesan/page.tsx components/app-sidebar.tsx
git commit -m "feat(pesan): add admin pesan page route and sidebar menu entry"
```

---

### Task 6: End-to-End Verification & Quality Audit

- [ ] **Step 1: Run TypeScript type check**

Run: `npm run type-check` (or `npx tsc --noEmit`)
Expected: No type errors.

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: No lint warnings or errors.

- [ ] **Step 3: Run all unit and integration tests**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 4: Commit final verification adjustments**

```bash
git commit --allow-empty -m "chore(pesan): verify complete implementation and test coverage"
```
