import { createClient } from "@/lib/supabase/server";
export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";
import { BookOpen, Calendar, Clock, User, GraduationCap, Star } from "lucide-react";
import KalenderAkademik from "@/components/kalender/KalenderAkademik";

export default async function PortalAkademikPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: siswa } = await supabase
    .from('siswa')
    .select('id, nama_lengkap, kelompok, tanggal_lahir, wali_kelas, tahun_ajaran')
    .eq('profile_orang_tua_id', user.id);

  // Jadwal kegiatan memakai kalender_akademik umum (bisa dikembangkan per siswa/ekstra di masa depan)
  const { data: _events } = await supabase
    .from('kalender_akademik')
    .select('*')
    .order('tanggal', { ascending: true });

  // Normalisasi agar properti selalu ada saat render (hindari error saat data DB tidak memiliki field opsional)
  const s = siswa?.[0];
  const birth = s?.tanggal_lahir ? new Date(s.tanggal_lahir) : null;
  const now = new Date();
  let umur = '-';
  if (birth && !Number.isNaN(birth.getTime())) {
    let years = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
    umur = `${years} Tahun`;
  }
  const siswaData = {
    id: s?.id ?? '-',
    nama_lengkap: s?.nama_lengkap ?? '-',
    kelompok: s?.kelompok ?? '-',
    umur,
    wali_kelas: s?.wali_kelas ?? '-',
    tahun_ajaran: s?.tahun_ajaran ?? '-',
  };

  const catatanGuru = [
    "Sudah lancar berhitung 1-10 secara berurutan.",
    "Mulai belajar berhitung saat bermain.",
    "Perlu bimbingan meningkatkan kesabaran saat menulis."
  ];

  const jadwalHarian = [
    { waktu: '08:00 - 08:30', kegiatan: 'Lorem ipsum dolor sit amet consectetur' },
    { waktu: '08:30 - 09:00', kegiatan: 'Lorem ipsum dolor sit amet consectetur' },
    { waktu: '09:30 - 10:00', kegiatan: 'Lorem ipsum dolor sit amet consectetur' },
    { waktu: '10:00 - 10:30', kegiatan: 'Lorem ipsum dolor sit amet consectetur' },
    { waktu: '10:30 - 10:45', kegiatan: 'Lorem ipsum dolor sit amet consectetur' }
  ];

  const riwayatPenilaian = [
    { kegiatan: 'Mengenal Huruf Undangan', tanggal: '19 Agustus 2025', nilai: 'A', catatan: 'Sudah bagus dari awal' },
    { kegiatan: 'Menyelemat Doa Harian', tanggal: '19 Agustus 2025', nilai: 'B+', catatan: 'Bagus' },
    { kegiatan: 'Senam Pagi', tanggal: '19 Agustus 2025', nilai: 'A', catatan: 'Aktif' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Enhanced Header */}
        <header className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-4 sm:p-6 md:p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 space-y-2 md:space-y-3">
            <div className="flex items-center gap-3 md:gap-4 mb-3">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight">
                  Informasi Akademik
                </h1>
                <p className="text-blue-100 text-sm md:text-lg leading-relaxed">
                  Laporan Perkembangan Anak
                </p>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="hidden md:block absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
        </header>

        {/* Main Content Grid - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Column - Profile & Teacher Notes */}
          <div className="space-y-4 md:space-y-6">
            {/* Student Profile Card */}
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-lg border border-gray-100">
              <div className="relative p-4 sm:p-6">
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Profil Anak</h3>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                      {siswaData.nama_lengkap?.charAt(0) || 'P'}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900 text-lg md:text-xl mb-1">{siswaData.nama_lengkap}</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Kelas:</span>
                        <span className="text-sm font-medium text-gray-900">{siswaData.kelompok}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Umur:</span>
                        <span className="text-sm font-medium text-gray-900">{siswaData.umur || '5 Tahun'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Wali Kelas:</span>
                        <span className="text-sm font-medium text-gray-900">{siswaData.wali_kelas || 'Bu Asjar'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Tahun Ajaran:</span>
                        <span className="text-sm font-medium text-gray-900">{siswaData.tahun_ajaran || '2024/2025'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Notes Card */}
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-lg border border-gray-100">
              <div className="relative p-4 sm:p-6">
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Catatan Guru</h3>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-4 space-y-3">
                  {catatanGuru.map((catatan, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700 leading-relaxed">{catatan}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Calendar, Schedule & Assessment */}
          <div className="space-y-4 md:space-y-6">
            {/* Attendance Progress Card */}
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-lg border border-gray-100">
              <div className="relative p-4 sm:p-6">
                <div className="flex items-center gap-3 md:gap-4 mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Kehadiran</h3>
                </div>

                {/* Attendance Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 font-bold text-lg">23</span>
                    </div>
                    <p className="text-xs text-gray-500">Hadir</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-red-600 font-bold text-lg">2</span>
                    </div>
                    <p className="text-xs text-gray-500">Tidak Hadir</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-yellow-600 font-bold text-lg">0</span>
                    </div>
                    <p className="text-xs text-gray-500">Izin</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Tingkat Kehadiran</span>
                    <span className="text-sm font-bold text-green-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm" style={{width: '92%'}}></div>
                  </div>
                </div>

                {/* Recent Attendance */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Kehadiran 7 Hari Terakhir</h4>
                  <div className="flex gap-2">
                    {[
                      { day: 'Sen', status: 'hadir' },
                      { day: 'Sel', status: 'hadir' },
                      { day: 'Rab', status: 'hadir' },
                      { day: 'Kam', status: 'tidak' },
                      { day: 'Jum', status: 'hadir' },
                      { day: 'Sab', status: 'hadir' },
                      { day: 'Min', status: 'hadir' }
                    ].map((item, index) => (
                      <div key={index} className="flex-1 text-center">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-1
                          ${item.status === 'hadir' ? 'bg-green-100 text-green-600' : 
                            item.status === 'tidak' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}
                        `}>
                          {item.status === 'hadir' ? '✓' : item.status === 'tidak' ? '✗' : 'I'}
                        </div>
                        <p className="text-xs text-gray-500">{item.day}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Summary */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Bulan Ini</p>
                      <p className="text-lg font-bold text-gray-900">23/25</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Semester Ini</p>
                      <p className="text-lg font-bold text-gray-900">89/95</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Schedule Card */}
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-lg border border-gray-100">
              <div className="relative p-4 sm:p-6">
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Jadwal Harian</h3>
                </div>
                
                <div className="space-y-2">
                  {jadwalHarian.map((item, index) => (
                    <div key={index} className="bg-amber-50 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <div className="text-xs font-medium text-amber-700 bg-amber-200 px-2 py-1 rounded flex-shrink-0 min-w-[80px] text-center">
                          {item.waktu}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.kegiatan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assessment History Card */}
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-lg border border-gray-100">
              <div className="relative p-4 sm:p-6">
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Riwayat Penilaian</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-600">Kegiatan</th>
                        <th className="text-center py-2 font-medium text-gray-600">Tanggal</th>
                        <th className="text-center py-2 font-medium text-gray-600">Nilai</th>
                        <th className="text-center py-2 font-medium text-gray-600">Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {riwayatPenilaian.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 text-gray-900">{item.kegiatan}</td>
                          <td className="py-3 text-center text-gray-600">{item.tanggal}</td>
                          <td className="py-3 text-center">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                              {item.nilai}
                            </span>
                          </td>
                          <td className="py-3 text-center text-gray-600">{item.catatan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Calendar Section */}
        <div className="mt-6 md:mt-8">
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-lg border border-gray-100">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center gap-3 md:gap-4 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Kalender Akademik</h3>
                  <p className="text-sm text-gray-500">Jadwal kegiatan dan agenda sekolah</p>
                </div>
              </div>
              
              {/* Calendar Component */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 md:p-6">
                <KalenderAkademik />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
