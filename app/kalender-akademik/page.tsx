import KalenderAkademik from '@/components/kalender/KalenderAkademik';

export default function KalenderAkademikPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Kalender Akademik</h1>
        <p className="text-gray-600">TK ABA Mertosanan Tahun Ajaran 2024/2025</p>
      </div>

      <KalenderAkademik />
    </div>
  );
}