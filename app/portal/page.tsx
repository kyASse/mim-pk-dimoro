// app/portal/page.tsx
import { createClient } from "@/lib/supabase/server";
export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, FileText, Megaphone, HandCoins, MessageSquareQuote } from "lucide-react";

type Siswa = { id: string; nama_lengkap: string; kelompok: string | null };
type Laporan = { id: number; semester: string; tahun_ajaran: string; catatan_guru: string | null; dokumen_rapor_url: string | null };

export default async function PortalPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: siswa } = await supabase
        .from('siswa')
        .select('id, nama_lengkap, kelompok')
        .eq('profile_orang_tua_id', user.id);

    const siswaUtama: Siswa | undefined = siswa?.[0];
    const siswaIds = (siswa || []).map(s => s.id);

    const { data: laporan } = await supabase
        .from('laporan_perkembangan')
        .select('id, semester, tahun_ajaran, catatan_guru, dokumen_rapor_url')
        .in('siswa_id', siswaIds.length ? siswaIds : ['__none__'])
        .order('tahun_ajaran', { ascending: false });

    const laporanTerbaru: Laporan | undefined = laporan?.[0];

    // Placeholder jadwal/agenda hari ini (bisa dihubungkan ke kalender_akademik)
    const jadwalHariIni = {
        label: 'Jadwal Hari Ini',
        keterangan: 'Kegiatan Berikutnya: Membaca Cerita'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
                <header className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-4 sm:p-6 md:p-8 text-white shadow-xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 space-y-2 md:space-y-3">
                        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight">
                            Selamat Datang Kembali, <span className="text-blue-200 block sm:inline">{siswaUtama ? 'Orang Tua' : user.email?.split('@')[0]}</span>!
                        </h1>
                        <p className="text-blue-100 text-sm md:text-lg max-w-3xl leading-relaxed">
                            Berikut ringkasan perkembangan {siswaUtama ? siswaUtama.nama_lengkap : 'anak'} serta informasi terbaru dari TK ABA Mertosanan.
                        </p>
                    </div>
                    {/* Decorative elements - hidden on small screens */}
                    <div className="hidden md:block absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Student Info */}
                    <div className="lg:col-span-2">
                        <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
                            <div className="relative p-4 sm:p-6">
                                <div className="flex items-center gap-3 md:gap-4 mb-4">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                        <span className="text-lg md:text-2xl">👤</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">Informasi Akademik Anak</h3>
                                        <p className="text-gray-500 text-sm">Data terkini siswa</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 rounded-xl">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                <span className="text-sm text-gray-600 font-medium">Nama:</span>
                                                <span className="font-semibold text-gray-900 break-words">{siswaUtama?.nama_lengkap || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-xl">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                <span className="text-sm text-gray-600 font-medium">Kelas:</span>
                                                <span className="font-semibold text-gray-900">{siswaUtama?.kelompok || 'Belum ditentukan'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Schedule */}
                    <div className="lg:col-span-1">
                        <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4 md:mb-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <CalendarDays className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg md:text-xl leading-tight">{jadwalHariIni.label}</h3>
                                </div>
                                
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-white/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white animate-pulse flex-shrink-0"></div>
                                        <span className="text-xs font-medium text-amber-100 uppercase tracking-wider">Kegiatan Selanjutnya</span>
                                    </div>
                                    <div className="text-white font-semibold text-base md:text-lg leading-tight mb-2">
                                        Membaca Cerita
                                    </div>
                                    <div className="flex items-center gap-2 text-amber-100 text-sm">
                                        <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs">⏰</span>
                                        </div>
                                        <span>Dimulai dalam 30 menit</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative elements - hidden on small screens */}
                            <div className="hidden sm:block absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                            <div className="hidden sm:block absolute -bottom-2 -left-2 w-16 h-16 bg-orange-300/20 rounded-full blur-lg"></div>
                        </div>
                    </div>
                </div>

                {/* Action Cards Grid */}
                <div className="space-y-4 md:space-y-6">
                    {/* Lihat Laporan Terbaru */}
                    <Link href="/portal/laporan" className="group block">
                        <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative p-4 sm:p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                            <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm md:text-base">Lihat Laporan Terbaru</h3>
                                            <p className="text-xs md:text-sm text-gray-500 mt-1 break-words">
                                                {laporanTerbaru ? `Terakhir Diperbarui: ${laporanTerbaru.tahun_ajaran}` : 'Belum ada laporan.'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-blue-50 text-blue-600 text-xs md:text-sm font-medium group-hover:bg-blue-100 transition-colors flex-shrink-0">
                                        <span className="hidden sm:inline">Lihat Laporan</span>
                                        <span className="sm:hidden">Lihat</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Pengumuman Terbaru */}
                    <Link href="/portal/pengumuman" className="group block">
                        <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative p-4 sm:p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                            <Megaphone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors text-sm md:text-base">Pengumuman Terbaru</h3>
                                            <p className="text-xs md:text-sm text-gray-500 mt-1 break-words">Acara Mendatang: Pertemuan Orang Tua & Guru</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-rose-50 text-rose-600 text-xs md:text-sm font-medium group-hover:bg-rose-100 transition-colors flex-shrink-0">
                                        <span className="hidden sm:inline">Baca Selengkapnya</span>
                                        <span className="sm:hidden">Baca</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Informasi Pembayaran */}
                    <Link href="/portal/keuangan" className="group block">
                        <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative p-4 sm:p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                            <HandCoins className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors text-sm md:text-base">Informasi Pembayaran</h3>
                                            <p className="text-xs md:text-sm text-gray-500 mt-1 break-words">Informasi terbaru mengenai tagihan dan riwayat pembayaran.</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-emerald-50 text-emerald-600 text-xs md:text-sm font-medium group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                                        <span className="hidden sm:inline">Lihat Selengkapnya</span>
                                        <span className="sm:hidden">Lihat</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Bagikan Pengalaman Anda */}
                    <Link href="/portal/testimoni" className="group block">
                        <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative p-4 sm:p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                            <MessageSquareQuote className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors text-sm md:text-base">Bagikan Pengalaman Anda</h3>
                                            <p className="text-xs md:text-sm text-gray-500 mt-1">Kami menghargai setiap masukan Anda</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-amber-50 text-amber-600 text-xs md:text-sm font-medium group-hover:bg-amber-100 transition-colors flex-shrink-0">
                                        <span className="hidden sm:inline">Tulis Testimoni</span>
                                        <span className="sm:hidden">Tulis</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}