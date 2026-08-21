"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Quote,
  Sparkles,
  ShieldCheck,
  Award,
  Heart,
  Trophy,
  BookOpen,
  Lightbulb,
  Leaf,
  CheckCircle2,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  School,
  Target,
  GraduationCap,
  UserPlus,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ValueCard from "@/components/tentang-kami/ValueCard";
import PageHeader from "@/components/shared/PageHeader";
import SchoolIdentity from "@/components/tentang-kami/SchoolIdentity";
import Achievements from "@/components/tentang-kami/Achievements";
import VisionMission from "@/components/tentang-kami/VisionMission";
import EducatorsSection from "@/components/tentang-kami/EducatorsSection";
import {
  SCHOOL_NAME,
  SCHOOL_FULL_NAME,
  SCHOOL_WHATSAPP,
  SCHOOL_EMAIL,
} from "@/lib/school-config";
import { HEADMASTER_WELCOME, EXCELLENT_PROGRAMS } from "@/lib/school-data";

// Sticky quick-nav items configuration
const QUICK_NAV_ITEMS = [
  { id: "sambutan", label: "Sambutan", icon: Quote },
  { id: "visi-misi", label: "Visi & Misi", icon: Target },
  { id: "profil-lulusan", label: "Karakter Lulusan", icon: Sparkles },
  { id: "pendidik", label: "Pendidik", icon: GraduationCap },
  { id: "identitas", label: "Identitas", icon: School },
  { id: "nilai-utama", label: "Nilai Utama", icon: Heart },
  { id: "prestasi", label: "Prestasi", icon: Trophy },
  { id: "pendaftaran-cta", label: "Pendaftaran", icon: UserPlus },
];

// Thematic metadata for the 6 Graduate Profiles
const GRADUATE_PROFILE_CONFIGS = [
  {
    pillar: "Pilar 1",
    title: "Aqidah & Pemahaman Islam",
    icon: Heart,
    colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    borderClass: "hover:border-emerald-500/40",
    glowClass: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  },
  {
    pillar: "Pilar 2",
    title: "Tahfidz & Tartil Qur'an",
    icon: Sparkles,
    colorClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    badgeClass: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30",
    borderClass: "hover:border-teal-500/40",
    glowClass: "from-teal-500/10 via-teal-500/5 to-transparent",
  },
  {
    pillar: "Pilar 3",
    title: "Kompetensi Dasar Akademik",
    icon: Trophy,
    colorClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    badgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
    borderClass: "hover:border-sky-500/40",
    glowClass: "from-sky-500/10 via-sky-500/5 to-transparent",
  },
  {
    pillar: "Pilar 4",
    title: "Karakter & Akhlakul Karimah",
    icon: ShieldCheck,
    colorClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
    borderClass: "hover:border-rose-500/40",
    glowClass: "from-rose-500/10 via-rose-500/5 to-transparent",
  },
  {
    pillar: "Pilar 5",
    title: "Kritis & Komunikatif",
    icon: Lightbulb,
    colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    borderClass: "hover:border-amber-500/40",
    glowClass: "from-amber-500/10 via-amber-500/5 to-transparent",
  },
  {
    pillar: "Pilar 6",
    title: "Sosial & Lingkungan",
    icon: Leaf,
    colorClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    badgeClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
    borderClass: "hover:border-indigo-500/40",
    glowClass: "from-indigo-500/10 via-indigo-500/5 to-transparent",
  },
];

export default function AboutUs() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Page Header */}
      <PageHeader
        title="Tentang Kami"
        description={`Mengenal lebih dekat ${SCHOOL_NAME}`}
        background="bg-primary/20"
      />

      {/* Sticky Quick-Navigation Bar */}
      <nav
        aria-label="Navigasi Halaman Tentang Kami"
        className="sticky top-16 md:top-20 z-30 bg-background/90 backdrop-blur-md border-b border-border/50 py-2.5 shadow-xs transition-all"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {QUICK_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Section 1: Sambutan Kepala Madrasah */}
      <section
        id="sambutan"
        className="py-16 md:py-24 bg-background relative overflow-hidden scroll-mt-28"
      >
        {/* Ambient Halo Glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Column: Headmaster Editorial Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 bg-card border border-border/70 p-6 sm:p-8 rounded-3xl shadow-sm lg:sticky lg:top-36 relative overflow-hidden group hover:border-primary/40 transition-all duration-300"
            >
              {/* Soft decorative glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

              {/* Photo Container */}
              <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-amber-500/20 blur-md transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background ring-4 ring-primary/20 shadow-lg">
                  <Image
                    src={HEADMASTER_WELCOME.photoUrl}
                    alt={HEADMASTER_WELCOME.name}
                    fill
                    sizes="(max-width: 768px) 208px, 224px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>

              {/* Identity & Credential Badges */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Pimpinan Madrasah</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  {HEADMASTER_WELCOME.name}
                </h3>
                <p className="text-sm font-semibold text-primary">
                  {HEADMASTER_WELCOME.title}
                </p>
              </div>

              {/* Summary Quote Box */}
              <div className="mt-6 pt-6 border-t border-border/60 relative">
                <div className="bg-muted/40 border border-border/50 p-4 sm:p-5 rounded-2xl relative">
                  <Quote className="w-5 h-5 text-primary/40 mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed text-center">
                    "{HEADMASTER_WELCOME.summary}"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Magazine Editorial Content */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20 shadow-xs">
                <Quote className="w-4 h-4" />
                <span>Sambutan Kepala Madrasah</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Selamat Datang di {SCHOOL_FULL_NAME}
              </h2>

              {/* Editorial Text Blocks */}
              <div className="space-y-5 text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
                {/* Paragraph 0: Opening Salam Highlight Box */}
                <div className="bg-primary/5 border-l-4 border-primary p-4 sm:p-5 rounded-r-2xl rounded-l-md font-semibold text-foreground text-base sm:text-lg shadow-2xs">
                  <p>{HEADMASTER_WELCOME.paragraphs[0]}</p>
                </div>

                {/* Paragraph 1: Lead Paragraph with prominent styling */}
                <p className="text-foreground/90 font-medium leading-relaxed">
                  {HEADMASTER_WELCOME.paragraphs[1]}
                </p>

                {/* Middle Paragraphs */}
                {HEADMASTER_WELCOME.paragraphs.slice(2, -1).map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                {/* Closing Paragraph: Wassalamu'alaikum & Blessing Box */}
                <div className="bg-muted/40 border border-border/60 p-5 rounded-2xl space-y-3">
                  <p className="font-semibold text-foreground">
                    {HEADMASTER_WELCOME.paragraphs[HEADMASTER_WELCOME.paragraphs.length - 1]}
                  </p>
                  <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs sm:text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Kepala Madrasah</span>
                    <span className="italic">{SCHOOL_FULL_NAME}</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Section 2: Visi & Misi */}
      <div id="visi-misi" className="scroll-mt-28">
        <VisionMission />
      </div>

      {/* Section 3: Profil Lulusan */}
      <section
        id="profil-lulusan"
        className="py-16 md:py-24 bg-muted/30 border-y border-border/40 relative overflow-hidden scroll-mt-28"
      >
        <div className="container mx-auto px-4 space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20 shadow-xs">
              <Sparkles className="w-4 h-4" />
              <span>Profil Lulusan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Standar Kompetensi & Karakter Lulusan
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
              Setiap lulusan {SCHOOL_NAME} dibina secara holistik untuk memenuhi 6 pilar profil lulusan utama:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXCELLENT_PROGRAMS.graduateProfiles.map((profile, index) => {
              const config =
                GRADUATE_PROFILE_CONFIGS[index] || GRADUATE_PROFILE_CONFIGS[0];
              const IconComponent = config.icon;

              return (
                <motion.div
                  key={index}
                  whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  className={cn(
                    "group relative overflow-hidden bg-card border border-border/60 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between",
                    config.borderClass
                  )}
                >
                  {/* Top ambient halo on hover */}
                  <div
                    className={cn(
                      "absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-b opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none",
                      config.glowClass
                    )}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={cn(
                          "p-3 rounded-2xl border transition-transform duration-300 group-hover:scale-110 shadow-xs",
                          config.colorClass
                        )}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2.5 py-1 rounded-full border",
                          config.badgeClass
                        )}
                      >
                        {config.pillar}
                      </span>
                    </div>

                    <h3 className="font-bold text-foreground text-base sm:text-lg mb-2 group-hover:text-primary transition-colors">
                      {config.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {profile}
                    </p>
                  </div>

                  <div className="relative z-10 mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium">Kompetensi Inti</span>
                    <CheckCircle2 className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Educators Section */}
      <div id="pendidik" className="scroll-mt-28">
        <EducatorsSection />
      </div>

      {/* Section 5: Identitas MI */}
      <div id="identitas" className="scroll-mt-28">
        <SchoolIdentity />
      </div>

      {/* Section 6: Nilai-Nilai Utama */}
      <section
        id="nilai-utama"
        className="py-16 md:py-24 bg-background relative overflow-hidden scroll-mt-28"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prinsip Utama</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Nilai-Nilai Kami
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Kami mengedepankan nilai-nilai Islami dan keunggulan akademik untuk membentuk karakter siswa yang tangguh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              title="Religius"
              description="Menanamkan kecintaan pada Allah dan Rasul-Nya melalui pembiasaan ibadah harian."
              icon="heart"
              color="primary"
            />
            <ValueCard
              title="Integritas"
              description="Membangun kejujuran dan tanggung jawab dalam setiap tindakan dan ucapan."
              icon="heart"
              color="highlight"
            />
            <ValueCard
              title="Cerdas"
              description="Mendorong semangat belajar dan berpikir kritis dalam menguasai ilmu pengetahuan."
              icon="brain"
              color="secondary"
            />
            <ValueCard
              title="Mandiri"
              description="Melatih kemandirian dan rasa percaya diri untuk menjadi pemimpin masa depan."
              icon="users"
              color="accent"
            />
          </div>
        </div>
      </section>

      {/* Section 7: Prestasi */}
      <div id="prestasi" className="scroll-mt-28">
        <Achievements />
      </div>

      {/* Section 8: CTA PPDB & Kontak */}
      <section
        id="pendaftaran-cta"
        className="py-16 md:py-24 bg-background relative overflow-hidden scroll-mt-28"
      >
        {/* Ambient Radial Background Glow */}
        <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-8 sm:p-12 text-center shadow-lg relative overflow-hidden"
          >
            {/* Header & Subtitle */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary text-xs sm:text-sm font-semibold border border-primary/30">
                <UserPlus className="w-4 h-4" />
                <span>Penerimaan Peserta Didik Baru (PPDB)</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Mari Bergabung dengan Kami
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                Berikan pendidikan terbaik untuk masa depan buah hati Anda di {SCHOOL_FULL_NAME}.
                Hubungi kami atau kunjungi madrasah kami untuk informasi pendaftaran lebih lanjut.
              </p>
            </div>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 pb-6">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 min-h-[44px] shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/pendaftaran">
                  <span>Daftar PPDB Sekarang</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full border-primary/40 text-foreground hover:bg-primary/10 font-semibold h-12 px-8 min-h-[44px]"
              >
                <Link href="/kontak">
                  <Phone className="mr-2 h-4 w-4 text-primary" />
                  <span>Hubungi Kami</span>
                </Link>
              </Button>
            </div>

            {/* Quick Contact Hotline & Email */}
            <div className="pt-6 border-t border-border/50 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
              <a
                href={`https://wa.me/${SCHOOL_WHATSAPP.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>Hotline WA: {SCHOOL_WHATSAPP}</span>
              </a>

              <a
                href={`mailto:${SCHOOL_EMAIL}`}
                className="inline-flex items-center gap-2 hover:text-primary font-medium transition-colors"
              >
                <Mail className="w-4 h-4 text-primary" />
                <span>Email: {SCHOOL_EMAIL}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

