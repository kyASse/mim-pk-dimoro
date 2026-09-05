import Link from "next/link";
import { 
  Award, 
  BookOpen, 
  Brain, 
  CheckCircle2, 
  ChevronRight, 
  GraduationCap, 
  Heart, 
  Phone, 
  Quote,
  ShieldCheck, 
  Palette, 
  Star, 
  Trophy, 
  Users 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { SCHOOL_NAME, SCHOOL_FULL_NAME } from "@/lib/school-config";

export const metadata = {
  title: `Design System Showcase - ${SCHOOL_NAME}`,
  description: `Showcase palet warna dan komponen Modern Islamic Oasis Design System ${SCHOOL_NAME}`,
};

export default function DesignSystemShowcase() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-20">
      <PageHeader
        title="Design System Showcase"
        description="Pratinjau Sistem Warna & Komponen Modern Islamic Oasis MIM PK Dimoro"
        background="bg-primary/20"
      />

      <div className="container mx-auto px-4 py-12 space-y-16 max-w-6xl">
        
        {/* Section 1: Overview */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <Palette className="w-3.5 h-3.5" />
            <span>Sistem Warna Baru</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Modern Islamic Oasis Palette
          </h2>
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
            Perombakan palet warna dari 2-warna kaku (putih & hijau polos) menjadi harmoni permukaan hangat, aksen emas Islami (*Amber Gold*), dan biru langit akademik (*Sky Blue*).
          </p>
        </section>

        {/* Section 2: Color Swatches Grid */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground border-b border-border/60 pb-3">
            1. Palet Warna Utama (Color Swatches)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary Emerald */}
            <div className="rounded-3xl border border-border/60 overflow-hidden bg-card shadow-sm">
              <div className="h-28 bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                Primary Green
              </div>
              <div className="p-4 space-y-1 bg-card">
                <p className="font-bold text-sm text-foreground">Emerald Muhammadiyah</p>
                <p className="text-xs text-muted-foreground">hsl(142 70% 36%)</p>
                <p className="text-xs text-primary font-semibold pt-1">Identitas Utama & CTA</p>
              </div>
            </div>

            {/* Secondary Sage Mint */}
            <div className="rounded-3xl border border-border/60 overflow-hidden bg-card shadow-sm">
              <div className="h-28 bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-lg">
                Secondary Mint
              </div>
              <div className="p-4 space-y-1 bg-card">
                <p className="font-bold text-sm text-foreground">Soft Sage Mint</p>
                <p className="text-xs text-muted-foreground">hsl(142 35% 94%)</p>
                <p className="text-xs text-secondary-foreground font-semibold pt-1">Container & Surfaces</p>
              </div>
            </div>

            {/* Amber Gold */}
            <div className="rounded-3xl border border-border/60 overflow-hidden bg-card shadow-sm">
              <div className="h-28 bg-amber-gold flex items-center justify-center text-amber-gold-foreground font-bold text-lg">
                Amber Gold
              </div>
              <div className="p-4 space-y-1 bg-card">
                <p className="font-bold text-sm text-foreground">Islamic Amber Gold</p>
                <p className="text-xs text-muted-foreground">hsl(38 90% 52%)</p>
                <p className="text-xs text-amber-600 font-semibold pt-1">Tahfidz & Prestasi</p>
              </div>
            </div>

            {/* Accent Sky Blue */}
            <div className="rounded-3xl border border-border/60 overflow-hidden bg-card shadow-sm">
              <div className="h-28 bg-accent flex items-center justify-center text-white font-bold text-lg">
                Sky Blue
              </div>
              <div className="p-4 space-y-1 bg-card">
                <p className="font-bold text-sm text-foreground">Academic Sky Blue</p>
                <p className="text-xs text-muted-foreground">hsl(199 80% 55%)</p>
                <p className="text-xs text-sky-600 font-semibold pt-1">Klinik Belajar & Fitur</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Double-Bezel Bento Cards Showcase */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground border-b border-border/60 pb-3">
            2. Penerapan Bento Cards (Double-Bezel Layout)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Tahfidz Al-Qur'an (Amber Gold Accent) */}
            <div className="rounded-3xl border border-amber-gold/40 bg-amber-gold-surface p-6 space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-gold/20 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-gold/20 text-amber-800 dark:text-amber-200">
                  Target Hafalan Mutqin
                </div>
                <h4 className="text-lg font-bold text-foreground">Program Tahfidz Al-Qur'an</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Target hafalan minimal 1 juz (Juz 30) saat lulus dengan bimbingan metode tartil dan tahsin harian.
                </p>
              </div>

              <Button asChild size="sm" className="w-full rounded-full bg-amber-gold hover:bg-amber-gold/90 text-amber-gold-foreground font-semibold">
                <Link href="/program/tahfidz">
                  <span>Detail Program Tahfidz</span>
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Card 2: Klinik Belajar (Sky Blue Accent) */}
            <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 p-6 space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300">
                  Bimbingan Personal Gratis
                </div>
                <h4 className="text-lg font-bold text-foreground">Klinik Belajar Gratis</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pendampingan intensif bagi siswa yang memerlukan pengayaan atau kesulitan dalam mata pelajaran.
                </p>
              </div>

              <Button asChild size="sm" variant="outline" className="w-full rounded-full border-sky-500/40 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10 font-semibold">
                <Link href="/program/klinik-belajar">
                  <span>Detail Klinik Belajar</span>
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Card 3: Pendidikan Karakter (Sage Mint / Primary Accent) */}
            <div className="rounded-3xl border border-primary/30 bg-secondary/40 p-6 space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  Karakter & Akhlak
                </div>
                <h4 className="text-lg font-bold text-foreground">Pembentukan Karakter</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Penanaman kebiasaan ibadah harian, shalat dhuha berjamah, dan akhlakul karimah sejak dini.
                </p>
              </div>

              <Button asChild size="sm" className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Link href="/tentang-kami">
                  <span>Profil Lulusan</span>
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Section 4: Typography & Editorial Blockquote */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground border-b border-border/60 pb-3">
            3. Tipografi & Editorial Quote
          </h3>

          <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Quote className="w-3.5 h-3.5" />
              <span>Sambutan Kepala Madrasah</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Selamat Datang di {SCHOOL_FULL_NAME}
            </h3>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4 py-1 bg-muted/20 rounded-r-xl">
              "Pendidikan terbaik adalah yang menyeimbangkan antara kecerdasan intelektual, kematangan karakter, dan keteguhan iman."
            </p>
          </div>
        </section>

        {/* Section 5: Buttons & Accessibility Tap Targets */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground border-b border-border/60 pb-3">
            4. Variasi Tombol CTA & Tap Target (Min 44px)
          </h3>

          <div className="flex flex-wrap gap-4 items-center">
            <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 min-h-[44px]">
              <Link href="/pendaftaran">
                <span>Daftar PPDB Sekarang</span>
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10 font-semibold h-12 px-8 min-h-[44px]">
              <Link href="/kontak">
                <Phone className="mr-2 w-4 h-4" />
                <span>Hubungi Kami</span>
              </Link>
            </Button>

            <Button asChild size="lg" className="rounded-full bg-amber-gold hover:bg-amber-gold/90 text-amber-gold-foreground font-bold h-12 px-8 min-h-[44px]">
              <Link href="/program/tahfidz">
                <Trophy className="mr-2 w-4 h-4" />
                <span>Program Tahfidz</span>
              </Link>
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}
