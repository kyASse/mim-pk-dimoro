import KalenderAkademik from '@/components/kalender/KalenderAkademik';
import { SCHOOL_NAME } from '@/lib/school-config';

export default function KalenderAkademikPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Kalender Akademik</h1>
        <p className="text-gray-600">{SCHOOL_NAME} - Jadwal & Agenda Akademik</p>
      </div>

      <KalenderAkademik />
    </div>
  );
}