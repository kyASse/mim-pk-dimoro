import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, ExternalLink, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import GaleriAdminHub from '@/components/admin/galeri/GaleriAdminHub';

export const metadata: Metadata = {
  title: 'Manajemen Galeri | Admin MIM PK Dimoro',
  description: 'Kelola foto dokumentasi dan album kegiatan MIM PK Dimoro',
};

export const dynamic = 'force-dynamic';

export default async function KelolaGaleriPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: galeri, error } = await supabase
    .from('galeri')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching galeri:', error);
  }

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb Navigation & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            <Link
              href="/admin"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Dasbor</span>
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Galeri Foto</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Manajemen Galeri Madrasah
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kelola dokumentasi visual, album kegiatan, dan foto publikasi MIM PK Dimoro
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2 h-10 text-xs sm:h-9 rounded-xl shadow-xs border-border"
          >
            <Link
              href="/galeri"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-primary" />
              <span>Lihat Galeri Publik</span>
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="gap-2 h-10 text-xs sm:h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
          >
            <Link href="/admin/galeri/tambah">
              <Plus className="w-4 h-4" />
              <span>Tambah Foto</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Interactive Hub */}
      <GaleriAdminHub items={galeri || []} />
    </div>
  );
}
