import { createClient } from "@/lib/supabase/server";
export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";
import { Megaphone, Calendar, Clock } from "lucide-react";

export default async function PortalPengumumanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: berita } = await supabase
    .from('berita')
    .select('id, judul, ringkasan, tanggal_terbit, status')
    .eq('status', 'published')
    .order('tanggal_terbit', { ascending: false })
    .limit(10);

  const { data: agenda } = await supabase
    .from('kalender_akademik')
    .select('id, judul, tanggal, tanggal_berakhir, waktu, deskripsi, kategori')
    .order('tanggal', { ascending: true })
    .limit(20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        <header className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-pink-700 p-4 sm:p-6 md:p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 space-y-2 md:space-y-3">
            <div className="flex items-center gap-3 md:gap-4 mb-3">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                <Megaphone className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight">
                  Pengumuman & Agenda
                </h1>
                <p className="text-rose-100 text-sm md:text-lg leading-relaxed">
                  Informasi terbaru dan agenda kegiatan sekolah
                </p>
              </div>
            </div>
          </div>
          {/* Decorative elements - hidden on small screens */}
          <div className="hidden md:block absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl"></div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Pengumuman Section */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Pengumuman Terbaru</h2>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              {berita?.length ? berita.map((b) => (
                <div key={b.id} className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative p-4 sm:p-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <Megaphone className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors text-sm md:text-base leading-tight mb-2">
                          {b.judul}
                        </h3>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-2">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                          <span>{new Date(b.tanggal_terbit).toLocaleDateString('id-ID', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        {b.ringkasan && (
                          <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2">
                            {b.ringkasan}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-md border border-gray-100 p-4 sm:p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Megaphone className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm md:text-base">Tidak ada pengumuman saat ini</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Agenda Section */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Agenda Kegiatan</h2>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              {agenda?.length ? agenda.map((e) => (
                <div key={e.id} className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative p-4 sm:p-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm md:text-base leading-tight mb-2">
                          {e.judul}
                        </h3>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span>
                              {new Date(e.tanggal).toLocaleDateString('id-ID', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                              {e.tanggal_berakhir && ` - ${new Date(e.tanggal_berakhir).toLocaleDateString('id-ID', { 
                                month: 'long', 
                                day: 'numeric' 
                              })}`}
                            </span>
                          </div>
                          
                          {e.waktu && (
                            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                              <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                              <span>{e.waktu}</span>
                            </div>
                          )}
                          
                          {e.kategori && (
                            <div className="inline-block px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mt-2">
                              {e.kategori}
                            </div>
                          )}
                        </div>
                        
                        {e.deskripsi && (
                          <p className="text-xs md:text-sm text-gray-600 leading-relaxed mt-3 line-clamp-2">
                            {e.deskripsi}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-md border border-gray-100 p-4 sm:p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm md:text-base">Tidak ada agenda saat ini</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
