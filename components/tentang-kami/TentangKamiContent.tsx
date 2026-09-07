"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Quote,
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
import FloatingSubNav, { SubNavItem } from "@/components/shared/FloatingSubNav";
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
import {
  HeadmasterContent,
  VisionMissionContent,
  SchoolIdentityContent,
} from "@/lib/types/content";

// Sticky quick-nav items configuration
const QUICK_NAV_ITEMS: SubNavItem[] = [
  { id: "sambutan", label: "Sambutan", icon: Quote },
  { id: "visi-misi", label: "Visi & Misi", icon: Target },
  { id: "profil-lulusan", label: "Karakter Lulusan", icon: GraduationCap },
  { id: "pendidik", label: "Pendidik", icon: School },
  { id: "identitas", label: "Identitas", icon: ShieldCheck },
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
    title: "Tahfidz & Baca Qur'an",
    icon: BookOpen,
    colorClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    badgeClass: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30",
    borderClass: "hover:border-teal-500/40",
    glowClass: "from-teal-500/10 via-teal-500/5 to-transparent",
  },
  {
    pillar: "Pilar 3",
    title: "Kompetensi Akademik",
    icon: Trophy,
    colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    borderClass: "hover:border-blue-500/40",
    glowClass: "from-blue-500/10 via-blue-500/5 to-transparent",
  },
  {
    pillar: "Pilar 4",
    title: "Akhlak Mulia & Mandiri",
    icon: Award,
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

interface TentangKamiContentProps {
  headmaster: HeadmasterContent;
  visionMission: VisionMissionContent;
  identity: SchoolIdentityContent;
}

export default function TentangKamiContent({
  headmaster,
  visionMission,
  identity,
}: TentangKamiContentProps) {
  const shouldReduceMotion = useReducedMotion();

  const kepsekName =
    headmaster.gelar && !headmaster.nama.includes(headmaster.gelar)
      ? `${headmaster.nama}, ${headmaster.gelar}`
      : headmaster.nama;
  const kepsekTitle = headmaster.jabatan || HEADMASTER_WELCOME.title;
  const kepsekPhoto = headmaster.foto_url || HEADMASTER_WELCOME.photoUrl;
  const kepsekSummary = headmaster.summary || HEADMASTER_WELCOME.summary;
  const kepsekParagraphs =
    headmaster.paragraphs?.length > 0 ? headmaster.paragraphs : HEADMASTER_WELCOME.paragraphs;

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Page Header */}
      <PageHeader
        title="Tentang Kami"
        description={`Mengenal lebih dekat ${SCHOOL_NAME}`}
        background="bg-primary/20"
      />

      {/* Sticky Floating Sub-Navigation Bar */}
      <FloatingSubNav
        items={QUICK_NAV_ITEMS}
        ariaLabel="Navigasi Halaman Tentang Kami"
      />

      {/* Section 1: Sambutan Kepala Madrasah */}
      <section
        id="sambutan"
        className="py-16 md:py-24 bg-background relative overflow-hidden scroll-mt-36"
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
                    src={kepsekPhoto}
                    alt={kepsekName}
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
                  {kepsekName}
                </h3>
                <p className="text-sm font-semibold text-primary">
                  {kepsekTitle}
                </p>
              </div>

              {/* Summary Quote Box */}
              <div className="mt-6 pt-6 border-t border-border/60 relative">
                <div className="bg-muted/40 border border-border/50 p-4 sm:p-5 rounded-2xl relative">
                  <Quote className="w-5 h-5 text-primary/40 mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed text-center">
                    "{kepsekSummary}"
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
                {/* Paragraph 0 */}
                {kepsekParagraphs[0] && (
                  <div className="bg-primary/5 border-l-4 border-primary p-4 sm:p-5 rounded-r-2xl rounded-l-md font-semibold text-foreground text-base sm:text-lg shadow-2xs">
                    <p>{kepsekParagraphs[0]}</p>
                  </div>
                )}

                {/* Paragraph 1 */}
                {kepsekParagraphs[1] && (
                  <p className="text-foreground/90 font-medium leading-relaxed">
                    {kepsekParagraphs[1]}
                  </p>
                )}

                {/* Middle Paragraphs */}
                {kepsekParagraphs.slice(2, -1).map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                {/* Closing Paragraph */}
                {kepsekParagraphs.length > 2 && (
                  <div className="bg-muted/40 border border-border/60 p-5 rounded-2xl space-y-3">
                    <p className="font-semibold text-foreground">
                      {kepsekParagraphs[kepsekParagraphs.length - 1]}
                    </p>
                    <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs sm:text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Kepala Madrasah</span>
                      <span className="italic">{SCHOOL_FULL_NAME}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Visi & Misi */}
      <div id="visi-misi" className="scroll-mt-36">
        <VisionMission data={visionMission} />
      </div>

      {/* Section 3: Profil Lulusan */}
      <section
        id="profil-lulusan"
        className="py-16 md:py-24 bg-muted/30 border-y border-border/40 relative overflow-hidden scroll-mt-36"
      >
        <div className="container mx-auto px-4 space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20 shadow-xs">
              <GraduationCap className="w-4 h-4" />
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
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "p-2.5 rounded-2xl border transition-transform duration-300 group-hover:scale-105 shadow-2xs shrink-0",
                            config.colorClass
                          )}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span
                          className={cn(
                            "text-[11px] font-bold px-2.5 py-0.5 rounded-md border",
                            config.badgeClass
                          )}
                        >
                          {config.pillar}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-muted-foreground/60 shrink-0">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-foreground mb-2 leading-snug">
                      {config.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {profile}
                    </p>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="text-[11px]">Capaian Standar Mutu</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Pendidik & Tenaga Kependidikan */}
      <EducatorsSection />

      {/* Section 5: Identitas & Legalitas */}
      <div id="identitas" className="scroll-mt-36">
        <SchoolIdentity data={identity} />
      </div>

      {/* Section 6: Nilai Utama */}
      <section
        id="nilai-utama"
        className="py-16 md:py-24 bg-background border-b border-border/40 relative overflow-hidden scroll-mt-36"
      >
        <div className="container mx-auto px-4 space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20 shadow-xs">
              <Heart className="w-4 h-4" />
              <span>Nilai-Nilai Luhur</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Nilai Utama {SCHOOL_NAME}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
              Empat pilar nilai fundamental yang menjiwai seluruh dinamika pembelajaran:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon="award"
              title="Unggul Prestasi"
              description="Menumbuhkembangkan keunggulan potensi akademik, sains, seni, dan kepanduan."
              color="primary"
            />
            <ValueCard
              icon="book"
              title="Qur'ani"
              description="Menanamkan kecintaan dan pembiasaan menghafal Al-Qur'an sejak usia dini."
              color="secondary"
            />
            <ValueCard
              icon="heart"
              title="Akhlakul Karimah"
              description="Membina keteladanan moral, adab sopan santun, serta budi pekerti luhur."
              color="attention"
            />
            <ValueCard
              icon="star"
              title="Peduli Lingkungan"
              description="Mewujudkan budaya madrasah yang bersih, asri, sehat, dan ramah lingkungan."
              color="highlight"
            />
          </div>
        </div>
      </section>

      {/* Section 7: Prestasi & Capaian */}
      <Achievements />

      {/* Section 8: CTA Pendaftaran */}
      <section
        id="pendaftaran-cta"
        className="py-16 md:py-20 bg-muted/40 relative overflow-hidden scroll-mt-36"
      >
        <div className="container mx-auto px-4 text-center space-y-6 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20">
            <UserPlus className="w-4 h-4" />
            <span>Penerimaan Peserta Didik Baru</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Mari Bertumbuh Bersama {SCHOOL_NAME}
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Bergabunglah bersama keluarga besar MIM PK Dimoro untuk membimbing ananda menjadi insan yang cerdas, berprestasi, dan berakhlakul karimah.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button size="lg" asChild className="w-full sm:w-auto h-12 px-8 rounded-full shadow-md font-semibold">
              <Link href="/pendaftaran">
                <UserPlus className="w-4 h-4 mr-2" />
                Daftar PPDB Sekarang
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-12 px-8 rounded-full font-semibold">
              <a href={`https://wa.me/${SCHOOL_WHATSAPP}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2 text-emerald-600" />
                Konsultasi WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
