import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GaleriUploadForm from '@/components/admin/galeri/GaleriUploadForm';

export const metadata = {
  title: 'Unggah Foto Baru | Admin MIM PK Dimoro',
  description: 'Studio unggah dokumentasi visual galeri MIM PK Dimoro',
};

export default function TambahGaleriPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header with Breadcrumb Navigation */}
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
            <Link
              href="/admin/galeri"
              className="hover:text-foreground transition-colors"
            >
              <span>Galeri Foto</span>
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Tambah Foto</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Studio Unggah Foto
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Tambahkan dokumentasi baru ke galeri publik madrasah
          </p>
        </div>

        <div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2 h-10 text-xs sm:h-9 rounded-xl border-border shadow-xs"
          >
            <Link href="/admin/galeri">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Upload Form Studio */}
      <GaleriUploadForm />
    </div>
  );
}
