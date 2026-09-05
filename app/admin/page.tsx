// app/admin/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/logout-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BookOpen, 
  Users, 
  ImageIcon, 
  MessageSquare, 
  TrendingUp,
  Edit,
  GraduationCap,
  Calendar,
  Layers
} from "lucide-react";
import DashboardMetricCards from "@/components/admin/dashboard/DashboardMetricCards";
import DashboardCharts from "@/components/admin/dashboard/DashboardCharts";
import DashboardAuditFeed from "@/components/admin/dashboard/DashboardAuditFeed";
import CetakLaporanEksekutifButton from "@/components/admin/dashboard/CetakLaporanEksekutifButton";
import {
  calculatePPDBDemographics,
  calculateDailyRegistrationTrends,
  calculateRombelSummary,
  calculateAttendanceSummary,
  formatAuditLogActivity,
  RombelItem,
  RawAuditLog,
} from "@/lib/utils/dashboard-stats";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }

  // 1. Fetch User Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('nama_lengkap, role')
    .eq('id', user.id)
    .single();

  // 2. Parallel Data Fetching for Maximum Performance
  const [
    recentNewsRes,
    pendaftarRes,
    rombelRes,
    siswaRes,
    pesanRes,
    auditLogsRes
  ] = await Promise.all([
    // Berita terkini
    supabase
      .from('berita')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),

    // Data Pendaftar PPDB
    supabase
      .from('pendaftar')
      .select('id, jenis_kelamin, status_pendaftaran, created_at, nama_lengkap'),

    // Master Rombel (1A - 6B)
    supabase
      .from('rombel')
      .select('id, nama, tingkat, kapasitas, wali_kelas_nama')
      .order('tingkat', { ascending: true })
      .order('nama', { ascending: true }),

    // Data Siswa Aktif
    supabase
      .from('siswa')
      .select('id, nama_lengkap, rombel_id, kelompok'),

    // Pesan Masuk
    supabase
      .from('pesan_masuk')
      .select('id, status'),

    // Audit Logs Terbaru (Join Profiles)
    supabase
      .from('audit_logs')
      .select(`
        id, 
        user_id, 
        table_name, 
        action, 
        record_id, 
        created_at,
        profiles:user_id(nama_lengkap, email, role)
      `)
      .order('created_at', { ascending: false })
      .limit(8)
  ]);

  const rawNews = recentNewsRes.data || [];
  const rawPendaftar = pendaftarRes.data || [];
  const rawRombels = rombelRes.data || [];
  const rawSiswa = siswaRes.data || [];
  const rawPesan = pesanRes.data || [];
  const rawAuditLogs = (auditLogsRes.data || []) as unknown as RawAuditLog[];

  // 3. Compute Aggregated Metrics
  const ppdbStats = calculatePPDBDemographics(rawPendaftar);
  const dailyTrends = calculateDailyRegistrationTrends(rawPendaftar, 14);

  const rombelItems: RombelItem[] = rawRombels.map((r: any) => {
    const siswaCount = rawSiswa.filter(
      (s: any) => s.rombel_id === r.id || s.kelompok === r.nama
    ).length;
    return {
      id: r.id,
      nama: r.nama,
      tingkat: r.tingkat,
      kapasitas: r.kapasitas || 28,
      wali_kelas_nama: r.wali_kelas_nama,
      siswaCount,
    };
  });

  const rombelSummary = calculateRombelSummary(rombelItems);
  const attendanceSummary = calculateAttendanceSummary(rombelSummary.totalSiswa);

  const pesanBelumDibalas = rawPesan.filter((p: any) => p.status === 'belum_dibaca').length;
  const totalPesan = rawPesan.length;

  const formattedAuditActivities = rawAuditLogs.map(formatAuditLogActivity);

  // Status badge styling helper for news
  const getNewsStatusColor = (status: string | null) => {
    switch (status) {
      case 'terbit': 
      case 'published': return 'default';
      case 'draft': return 'secondary';  
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };
  
  const getNewsStatusText = (status: string | null) => {
    switch (status) {
      case 'terbit':
      case 'published': return 'Terpublikasi';
      case 'draft': return 'Draf';
      case 'archived': return 'Diarsipkan'; 
      default: return 'Draf';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Section with Executive Action Dock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/80 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Dasbor Utama
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            Selamat datang, <strong className="text-gray-900 dark:text-white">{profile?.nama_lengkap || user.email}</strong>!
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <CetakLaporanEksekutifButton
            data={{
              ppdbDemographics: ppdbStats,
              rombels: rombelItems,
              rombelSummary,
              attendanceSummary,
              pesanStats: {
                total: totalPesan,
                belumDibaca: pesanBelumDibalas,
              },
            }}
          />
          <LogoutButton />
        </div>
      </div>

      {/* 2. Top Performance Metric Cards (Double-Bezel Architecture) */}
      <DashboardMetricCards
        ppdbStats={ppdbStats}
        rombelSummary={rombelSummary}
        attendanceSummary={attendanceSummary}
        pesanBelumDibalas={pesanBelumDibalas}
        totalPesan={totalPesan}
      />

      {/* 3. Interactive Data Visualizations (Daily Trend & Gender Comparison) */}
      <DashboardCharts
        trends={dailyTrends}
        demographics={ppdbStats}
      />

      {/* 4. Two-Column Dashboard Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols Desktop): Berita Terkini & Akses Cepat */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pembaruan Berita Terkini */}
          <Card className="rounded-2xl border-gray-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-base sm:text-lg font-bold">
                  Pembaruan Berita Terkini
                </CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs text-emerald-600 hover:text-emerald-700">
                <Link href="/admin/berita">
                  Lihat Semua
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {rawNews && rawNews.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-zinc-800/40">
                      <TableRow>
                        <TableHead className="text-xs font-bold text-gray-700 dark:text-gray-300">Judul</TableHead>
                        <TableHead className="text-xs font-bold text-gray-700 dark:text-gray-300">Status</TableHead>
                        <TableHead className="text-xs font-bold text-gray-700 dark:text-gray-300">Tanggal</TableHead>
                        <TableHead className="text-xs font-bold text-gray-700 dark:text-gray-300 text-right w-[80px]">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rawNews.map((berita) => (
                        <TableRow key={berita.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30">
                          <TableCell className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 max-w-[240px] truncate">
                            {berita.judul}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getNewsStatusColor(berita.status)} className="text-[10px]">
                              {getNewsStatusText(berita.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(berita.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                              <Link href={`/admin/berita/edit/${berita.id}`} aria-label={`Sunting berita ${berita.judul}`}>
                                <Edit className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-gray-500">
                  Belum ada berita yang dipublikasikan.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Akses Cepat Navigasi Modul */}
          <Card className="rounded-2xl border-gray-200/80 dark:border-zinc-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-base sm:text-lg font-bold">Akses Cepat</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <Link href="/admin/pendaftar" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs font-semibold h-10 bg-amber-50/70 hover:bg-amber-100 text-amber-900 border-amber-200/80 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50"
                  >
                    <Users className="w-3.5 h-3.5 mr-1.5 shrink-0 text-amber-600" />
                    <span className="truncate">PPDB Online</span>
                  </Button>
                </Link>

                <Link href="/admin/siswa" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs font-semibold h-10 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 border-emerald-200/80 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50"
                  >
                    <GraduationCap className="w-3.5 h-3.5 mr-1.5 shrink-0 text-emerald-600" />
                    <span className="truncate">Data Siswa</span>
                  </Button>
                </Link>

                <Link href="/admin/pesan" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs font-semibold h-10 bg-purple-50/70 hover:bg-purple-100 text-purple-900 border-purple-200/80 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/50"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5 shrink-0 text-purple-600" />
                    <span className="truncate">Pesan Masuk</span>
                  </Button>
                </Link>

                <Link href="/admin/berita" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs font-semibold h-10 bg-blue-50/70 hover:bg-blue-100 text-blue-900 border-blue-200/80 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/50"
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1.5 shrink-0 text-blue-600" />
                    <span className="truncate">Kelola Berita</span>
                  </Button>
                </Link>

                <Link href="/admin/galeri" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs font-semibold h-10 bg-teal-50/70 hover:bg-teal-100 text-teal-900 border-teal-200/80 dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-900/50"
                  >
                    <ImageIcon className="w-3.5 h-3.5 mr-1.5 shrink-0 text-teal-600" />
                    <span className="truncate">Galeri Foto</span>
                  </Button>
                </Link>

                <Link href="/admin/konten" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs font-semibold h-10 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 border-indigo-200/80 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-900/50"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1.5 shrink-0 text-indigo-600" />
                    <span className="truncate">Konten Web</span>
                  </Button>
                </Link>

                <Link href="/admin/akademik" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs font-semibold h-10 bg-pink-50/70 hover:bg-pink-100 text-pink-900 border-pink-200/80 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-900/50"
                  >
                    <TrendingUp className="w-3.5 h-3.5 mr-1.5 shrink-0 text-pink-600" />
                    <span className="truncate">Akademik/SPP</span>
                  </Button>
                </Link>

                <Link href="/admin/kalender" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs font-semibold h-10 bg-orange-50/70 hover:bg-orange-100 text-orange-900 border-orange-200/80 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900/50"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0 text-orange-600" />
                    <span className="truncate">Kalender</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 Cols Desktop): Jejak Audit Aktivitas Terbaru */}
        <div className="lg:col-span-5">
          <DashboardAuditFeed activities={formattedAuditActivities} />
        </div>
      </div>
    </div>
  );
}