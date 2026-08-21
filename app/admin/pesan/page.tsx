// app/admin/pesan/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PesanManagement from '@/components/admin/pesan/PesanManagement';
import { PesanMasuk } from '@/types/pesan';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pesan Masuk | Admin Panel',
  description: 'Kelola dan balas pesan masuk dari formulir kontak website MIM PK Dimoro',
};

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
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
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
