import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import ProgramDetails from "@/components/program/ProgramDetails";
import ExtraActivity from "@/components/program/ExtraActivity";
import IntegratedCurriculumSection from "@/components/program/IntegratedCurriculumSection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  BookOpen,
  ChevronRight,
  Phone,
  Star,
  BookMarked,
  GraduationCap,
  CheckCircle2,
  Target,
  Users,
  Lightbulb,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { SCHOOL_NAME, SCHOOL_FULL_NAME } from "@/lib/school-config";
import { EXCELLENT_PROGRAMS } from "@/lib/school-data";

export default function Program() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Program & Pendidikan"
        description={`Mengenal kurikulum dan program unggulan di ${SCHOOL_NAME}`}
        background="bg-accent/20"
      />

      {/* Ikhtisar Program */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Kurikulum & Program
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {SCHOOL_FULL_NAME} menyelenggarakan pendidikan dasar dengan Kurikulum Merdeka yang diperkaya dengan muatan lokal Al-Islam, Kemuhammadiyahan, dan Bahasa Arab (ISMUBA). Kami berkomitmen mencetak generasi yang unggul secara akademik dan kokoh secara spiritual.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 bg-accent/20 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">Kurikulum Terpadu</h3>
                    <p className="text-muted-foreground">
                      Integrasi Kurikulum Nasional dengan nilai-nilai Keislaman.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 bg-primary/20 p-2 rounded-full">
                    <Star className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">Program Unggulan</h3>
                    <p className="text-muted-foreground">
                      Fokus pada Tahfidz Al-Qur'an dan Klinik Belajar.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 bg-highlight/40 p-2 rounded-full">
                    <Award className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">Pendidik Berkompeten</h3>
                    <p className="text-muted-foreground">
                      Dibimbing oleh guru-guru yang berdedikasi dan ahli di bidangnya.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full -z-10"></div>
              <Image
                src="https://placehold.co/600x400/059669/ffffff.png?text=Program+Pendidikan"
                alt={`Kegiatan di ${SCHOOL_NAME}`}
                width={600}
                height={400}
                className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8 Pilar Kurikulum Terpadu Section */}
      <IntegratedCurriculumSection />

      {/* Struktur Kurikulum Per Kelas */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold mb-3 text-foreground">
              Struktur Kurikulum Per Kelas
            </h2>
            <p className="text-muted-foreground">
              Pembagian alur pembelajaran yang dirancang khusus sesuai dengan tahapan tumbuh kembang siswa.
            </p>
          </div>

          <Tabs defaultValue="kelas-bawah" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="kelas-bawah">Kelas Bawah (1-3)</TabsTrigger>
              <TabsTrigger value="kelas-atas">Kelas Atas (4-6)</TabsTrigger>
            </TabsList>

            <TabsContent value="kelas-bawah">
              <ProgramDetails
                title="Fase A & B (Kelas 1-3)"
                description="Fokus pada penguatan literasi dasar, numerasi, dan pembiasaan adab serta ibadah harian."
                imageUrl="https://placehold.co/800x600/10b981/ffffff.png?text=Kelas+Bawah+1-3"
                schedule={[
                  { day: "Senin - Kamis", hours: "07:00 - 13:00 WIB" },
                  { day: "Jumat", hours: "07:00 - 11:00 WIB" },
                ]}
                features={[
                  "ISMUBA (Al-Qur'an Hadis, Akidah Akhlak, Fikih, Bahasa Arab)",
                  "Pendidikan Pancasila & Bahasa Indonesia",
                  "Matematika & Seni Budaya",
                  "PJOK & Muatan Lokal",
                  "Pembiasaan Sholat Dhuha & Dzuhur Berjamaah",
                  "Tahfidz Juz 30",
                ]}
              />
            </TabsContent>

            <TabsContent value="kelas-atas">
              <ProgramDetails
                title="Fase B & C (Kelas 4-6)"
                description="Pengembangan kemampuan berpikir kritis, kemandirian, dan persiapan menuju jenjang pendidikan menengah."
                imageUrl="https://placehold.co/800x600/059669/ffffff.png?text=Kelas+Atas+4-6"
                schedule={[
                  { day: "Senin - Kamis", hours: "07:00 - 14:00 WIB" },
                  { day: "Jumat", hours: "07:00 - 11:00 WIB" },
                ]}
                features={[
                  "Mata Pelajaran Dasar + SKI (Sejarah Kebudayaan Islam)",
                  "IPAS (Ilmu Pengetahuan Alam dan Sosial)",
                  "Bahasa Inggris & Teknologi Informasi (Koding)",
                  "Penyelesaian Target Tahfidz Al-Qur'an",
                  "Latihan Kepemimpinan & Organisasi Dasar",
                  "Bimbingan Persiapan Ujian Akhir",
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Program Unggulan Detail Section */}
      <section className="py-16" id="program-unggulan">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Star className="h-4 w-4" />
              <span>Program Unggulan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
              Program Unggulan MIM PK Dimoro
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Program khusus yang dirancang intensif untuk memperkuat karakter keislaman dan daya saing akademik siswa.
            </p>
          </div>

          <div className="space-y-12 max-w-5xl mx-auto">
            {/* 1. Tahfidz Al-Qur'an Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <BookMarked className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {EXCELLENT_PROGRAMS.tahfidz.title}
                    </h3>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Target Hafalan: {EXCELLENT_PROGRAMS.tahfidz.target}
                    </p>
                  </div>
                </div>
                <div className="self-start md:self-auto bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-semibold">
                  Unggulan Keagamaan
                </div>
              </div>

              {/* Full Objective */}
              <div className="mb-8 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/10">
                <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Tujuan Utama Program Tahfidz
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {EXCELLENT_PROGRAMS.tahfidz.objective}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 7 Activity Points */}
                <div>
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    7 Rangkaian Kegiatan Tahfidz:
                  </h4>
                  <ul className="space-y-2.5">
                    {EXCELLENT_PROGRAMS.tahfidz.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4 Graduate Target Points */}
                <div>
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                    4 Target Capaian Lulusan:
                  </h4>
                  <ul className="space-y-2.5">
                    {EXCELLENT_PROGRAMS.tahfidz.graduateTargets.map((targetItem, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{targetItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. Klinik Belajar Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Lightbulb className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {EXCELLENT_PROGRAMS.klinikBelajar.title}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Bimbingan & Pendampingan Akademik Personal
                    </p>
                  </div>
                </div>
                <div className="self-start md:self-auto bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-semibold">
                  Unggulan Akademik
                </div>
              </div>

              {/* Full Objective */}
              <div className="mb-8 bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-500/10">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Tujuan Utama Klinik Belajar
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {EXCELLENT_PROGRAMS.klinikBelajar.objective}
                </p>
              </div>

              {/* 3 Target Audience Points */}
              <div className="mb-8">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  3 Sasaran Peserta Klinik Belajar:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {EXCELLENT_PROGRAMS.klinikBelajar.targetAudience.map((audience, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-secondary/40 border border-secondary/60 text-xs sm:text-sm text-foreground/90 font-medium flex items-start gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{audience}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 8 Activities */}
                <div>
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    8 Kegiatan Utama Klinik Belajar:
                  </h4>
                  <ul className="space-y-2.5">
                    {EXCELLENT_PROGRAMS.klinikBelajar.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5 Learning Approaches */}
                <div>
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    5 Pendekatan Pembelajaran:
                  </h4>
                  <ul className="space-y-2.5">
                    {EXCELLENT_PROGRAMS.klinikBelajar.learningApproaches.map((approach, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{approach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Expectation Statement */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                <HeartHandshake className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-medium text-foreground italic">
                  "{EXCELLENT_PROGRAMS.klinikBelajar.expectationStatement}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ekstrakurikuler */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ekstrakurikuler</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mengembangkan minat, bakat, dan potensi diri siswa di luar jam pelajaran akademik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ExtraActivity
              title="Tapak Suci"
              description="Seni bela diri khas Muhammadiyah untuk melatih ketangkasan, kedisiplinan, dan keberanian."
              icon="shield"
              schedule="Sabtu, 08:00 - 10:00 WIB"
              imageUrl="https://placehold.co/600x400/059669/ffffff.png?text=Tapak+Suci"
            />
            <ExtraActivity
              title="Hizbul Wathan (HW)"
              description="Kepanduan Islami untuk membentuk jiwa kepemimpinan, kemandirian, dan cinta tanah air."
              icon="users"
              schedule="Jumat, 14:00 - 16:00 WIB"
              imageUrl="https://placehold.co/600x400/10b981/ffffff.png?text=Hizbul+Wathan"
            />
            <ExtraActivity
              title="Tahfidz Qur'an"
              description="Program khusus bagi siswa yang ingin mendalami dan menambah hafalan Al-Qur'an secara intensif."
              icon="book"
              schedule="Selasa & Kamis, 14:00 - 15:30 WIB"
              imageUrl="https://placehold.co/600x400/34d399/ffffff.png?text=Tahfidz+Quran"
            />
            <ExtraActivity
              title="Seni & Drumband"
              description="Pengembangan kreativitas melalui musik, olah vokal, dan seni pertunjukan."
              icon="music"
              schedule="Rabu, 14:00 - 16:00 WIB"
              imageUrl="https://placehold.co/600x400/6ee7b7/ffffff.png?text=Seni+Musik"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ingin Tahu Lebih Lanjut?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Dapatkan informasi lengkap mengenai kurikulum, biaya pendidikan, dan prosedur pendaftaran dengan menghubungi tim admin kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kontak">
              <Button className="rounded-full bg-primary hover:bg-primary/80 text-primary-foreground">
                Hubungi Kami <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pendaftaran">
              <Button
                variant="outline"
                className="rounded-full border-primary text-primary hover:bg-primary/10"
              >
                <Phone className="mr-2 h-5 w-5" /> Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
