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
          className={`bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 font-medium ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
          Belum Dibaca
        </Badge>
      );
    case 'dibaca':
      return (
        <Badge
          variant="outline"
          className={`bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 font-medium ${className}`}
        >
          Sudah Dibaca
        </Badge>
      );
    case 'dibalas':
      return (
        <Badge
          variant="outline"
          className={`bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-medium ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          Dibalas
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
