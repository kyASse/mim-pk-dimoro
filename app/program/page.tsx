"use client";

import React from "react";
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
  Layers,
  Trophy,
  Compass,
  ArrowUpRight,
  MessageSquare,
  Mail,
  School,
} from "lucide-react";
import {
  SCHOOL_NAME,
  SCHOOL_FULL_NAME,
  SCHOOL_WHATSAPP,
  SCHOOL_EMAIL,
} from "@/lib/school-config";
import { EXCELLENT_PROGRAMS } from "@/lib/school-data";
import { useReducedMotion } from "motion/react";

export default function Program() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* Page Header */}
      <PageHeader
        title="Program & Pendidikan"
        description={`Mengenal kurikulum terpadu dan program unggulan di ${SCHOOL_NAME}`}
        background="bg-accent/20"
      />

      {/* Sticky Quick-Navigation Bar */}
      <nav
        aria-label="Navigasi Halaman Program"
        className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-y border-border/60 py-2.5 px-4 shadow-2xs"
      >
        <div className="container mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 hidden sm:inline-flex items-center gap-1.5 mr-2">
              <Compass className="w-3.5 h-3.5 text-primary" />
              Lompat Ke:
            </span>
            <a
              href="#ikhtisar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ikhtisar</span>
            </a>
            <a
              href="#kurikulum-terpadu"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>8 Pilar Kurikulum</span>
            </a>
            <a
              href="#struktur-fase"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Struktur Jenjang</span>
            </a>
            <a
              href="#program-unggulan"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
            >
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Program Unggulan</span>
            </a>
            <a
              href="#ekstrakurikuler"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
            >
              <Trophy className="w-3.5 h-3.5 text-emerald-500" />
              <span>Ekstrakurikuler</span>
            </a>
            <a
              href="#kontak-konsultasi"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors shrink-0 ml-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Konsultasi PPDB</span>
            </a>
          </div>
        </div>
      </nav>

      {/* 1. Ikhtisar Program Section */}
      <section id="ikhtisar" className="py-16 md:py-24 relative overflow-hidden">
        {/* Decorative Ambient Background Blurs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Kurikulum Merdeka
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20 shadow-2xs">
                  <School className="w-3.5 h-3.5" />
                  Muatan Lokal ISMUBA
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/20 shadow-2xs">
                  <Award className="w-3.5 h-3.5" />
                  Program Khusus (PK)
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                  Kurikulum & Program
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  {SCHOOL_FULL_NAME} menyelenggarakan pendidikan dasar dengan Kurikulum Merdeka yang diperkaya dengan muatan lokal Al-Islam, Kemuhammadiyahan, dan Bahasa Arab (ISMUBA). Kami berkomitmen mencetak generasi yang unggul secara akademik dan kokoh secara spiritual.
                </p>
              </div>

              {/* 3 Value Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="group p-4 rounded-2xl bg-card border border-border/80 shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-accent/20 text-accent-foreground rounded-xl group-hover:scale-105 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                      Kurikulum Terpadu
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Integrasi Kurikulum Nasional dengan nilai-nilai Keislaman.
                  </p>
                </div>

                <div className="group p-4 rounded-2xl bg-card border border-border/80 shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-primary/20 text-primary-foreground rounded-xl group-hover:scale-105 transition-transform">
                      <Star className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                      Program Unggulan
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Fokus pada Tahfidz Al-Qur'an dan Klinik Belajar.
                  </p>
                </div>

                <div className="group p-4 rounded-2xl bg-card border border-border/80 shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-highlight/40 text-accent-foreground rounded-xl group-hover:scale-105 transition-transform">
                      <Award className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                      Pendidik Berkompeten
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dibimbing oleh guru-guru yang berdedikasi dan ahli di bidangnya.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg group">
                <div className="relative h-80 sm:h-96 md:h-[420px] w-full">
                  <Image
                    src="/images/mim_hero_main.jpg"
                    alt={`Kegiatan di ${SCHOOL_NAME}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                {/* Floating Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-background/85 dark:bg-card/85 backdrop-blur-md border border-border/60 shadow-md">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        Pendidikan Terpadu
                      </span>
                      <h4 className="text-sm font-bold text-foreground">
                        MIM PK Dimoro Sukoharjo
                      </h4>
                    </div>
                    <Link
                      href="#kurikulum-terpadu"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
                    >
                      <span>Lihat Pilar</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 8 Pilar Kurikulum Terpadu Section */}
      <IntegratedCurriculumSection />

      {/* 3. Struktur Kurikulum Per Kelas Section */}
      <section id="struktur-fase" className="py-16 md:py-24 bg-muted/20 relative">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold shadow-2xs">
              <Layers className="h-4 w-4" />
              <span>Fase Tumbuh Kembang Siswa</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Struktur Kurikulum Per Kelas
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Pembagian alur pembelajaran yang dirancang khusus sesuai dengan tahapan tumbuh kembang siswa.
            </p>
          </div>

          <Tabs defaultValue="kelas-bawah" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-12 p-1 bg-muted/80 backdrop-blur-md rounded-2xl border border-border/60">
              <TabsTrigger
                value="kelas-bawah"
                className="rounded-xl text-xs sm:text-sm font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
              >
                Kelas Bawah (1-3)
              </TabsTrigger>
              <TabsTrigger
                value="kelas-atas"
                className="rounded-xl text-xs sm:text-sm font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
              >
                Kelas Atas (4-6)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kelas-bawah" className="focus-visible:outline-none">
              <ProgramDetails
                title="Fase A & B (Kelas 1-3)"
                description="Fokus pada penguatan literasi dasar, numerasi, dan pembiasaan adab serta ibadah harian."
                imageUrl="/images/mim_tahfidz_learning.jpg"
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

            <TabsContent value="kelas-atas" className="focus-visible:outline-none">
              <ProgramDetails
                title="Fase B & C (Kelas 4-6)"
                description="Pengembangan kemampuan berpikir kritis, kemandirian, dan persiapan menuju jenjang pendidikan menengah."
                imageUrl="/images/mim_hero_main.jpg"
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

      {/* 4. Program Unggulan Detail Section */}
      <section id="program-unggulan" className="py-16 md:py-24 relative overflow-hidden">
        {/* Subtle Glows */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold shadow-2xs">
              <Star className="h-4 w-4 text-amber-500" />
              <span>Program Unggulan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Program Unggulan MIM PK Dimoro
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              Program khusus yang dirancang intensif untuk memperkuat karakter keislaman dan daya saing akademik siswa.
            </p>
          </div>

          <div className="space-y-12">
            {/* 1. Tahfidz Al-Qur'an Card */}
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-50/40 via-card to-emerald-50/20 dark:from-amber-950/15 dark:via-card dark:to-emerald-950/15 p-6 sm:p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 sm:p-4 bg-amber-500/15 text-amber-700 dark:text-amber-400 rounded-2xl shrink-0 shadow-2xs border border-amber-500/20">
                    <BookMarked className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      {EXCELLENT_PROGRAMS.tahfidz.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                      Target Hafalan: {EXCELLENT_PROGRAMS.tahfidz.target}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
                    Unggulan Keagamaan
                  </span>
                </div>
              </div>

              {/* Full Objective Callout */}
              <div className="mb-8 bg-amber-50/60 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-500/20 shadow-2xs">
                <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300 mb-1.5 flex items-center gap-2">
                  <Target className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  Tujuan Utama Program Tahfidz
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed">
                  {EXCELLENT_PROGRAMS.tahfidz.objective}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 7 Activities */}
                <div className="lg:col-span-6 space-y-4">
                  <h4 className="font-bold text-foreground text-base sm:text-lg flex items-center gap-2 pb-1 border-b border-border/40">
                    <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>7 Rangkaian Kegiatan Tahfidz:</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {EXCELLENT_PROGRAMS.tahfidz.activities.map((activity, idx) => (
                      <li
                        key={idx}
                        className="group/item flex items-start gap-3 p-3 rounded-xl bg-background/80 dark:bg-card/80 border border-amber-500/15 hover:border-amber-500/30 transition-colors shadow-2xs"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-xs mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="text-xs sm:text-sm text-foreground/90 font-medium leading-snug">
                          {activity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4 Graduate Targets */}
                <div className="lg:col-span-6 space-y-4">
                  <h4 className="font-bold text-foreground text-base sm:text-lg flex items-center gap-2 pb-1 border-b border-border/40">
                    <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>4 Target Capaian Lulusan:</span>
                  </h4>
                  <ul className="space-y-3">
                    {EXCELLENT_PROGRAMS.tahfidz.graduateTargets.map((targetItem, idx) => (
                      <li
                        key={idx}
                        className="group/target flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors shadow-2xs"
                      >
                        <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-xs sm:text-sm text-foreground/90 font-semibold leading-relaxed">
                          {targetItem}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. Klinik Belajar Card */}
            <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-50/40 via-card to-cyan-50/20 dark:from-blue-950/15 dark:via-card dark:to-cyan-950/15 p-6 sm:p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 sm:p-4 bg-blue-500/15 text-blue-700 dark:text-blue-400 rounded-2xl shrink-0 shadow-2xs border border-blue-500/20">
                    <Lightbulb className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      {EXCELLENT_PROGRAMS.klinikBelajar.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 mt-0.5">
                      Bimbingan & Pendampingan Akademik Personal
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
                    Unggulan Akademik
                  </span>
                </div>
              </div>

              {/* Full Objective Callout */}
              <div className="mb-8 bg-blue-50/60 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-500/20 shadow-2xs">
                <h4 className="text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-300 mb-1.5 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  Tujuan Utama Klinik Belajar
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed">
                  {EXCELLENT_PROGRAMS.klinikBelajar.objective}
                </p>
              </div>

              {/* 3 Target Audience Section */}
              <div className="mb-8 space-y-3">
                <h4 className="font-bold text-foreground text-base sm:text-lg flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>3 Sasaran Peserta Klinik Belajar:</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {EXCELLENT_PROGRAMS.klinikBelajar.targetAudience.map((audience, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-background/80 dark:bg-card/80 border border-blue-500/20 shadow-2xs flex items-start gap-3 hover:border-blue-500/40 transition-colors"
                    >
                      <div className="p-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-foreground/90 leading-snug">
                        {audience}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8 Activities & 5 Approaches Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 8 Activities */}
                <div className="lg:col-span-6 space-y-4">
                  <h4 className="font-bold text-foreground text-base sm:text-lg flex items-center gap-2 pb-1 border-b border-border/40">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>8 Kegiatan Utama Klinik Belajar:</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {EXCELLENT_PROGRAMS.klinikBelajar.activities.map((activity, idx) => (
                      <li
                        key={idx}
                        className="group/item flex items-start gap-3 p-3 rounded-xl bg-background/80 dark:bg-card/80 border border-blue-500/15 hover:border-blue-500/30 transition-colors shadow-2xs"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-700 dark:text-blue-400 font-bold text-xs mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="text-xs sm:text-sm text-foreground/90 font-medium leading-snug">
                          {activity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5 Approaches */}
                <div className="lg:col-span-6 space-y-4">
                  <h4 className="font-bold text-foreground text-base sm:text-lg flex items-center gap-2 pb-1 border-b border-border/40">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>5 Pendekatan Pembelajaran:</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {EXCELLENT_PROGRAMS.klinikBelajar.learningApproaches.map((approach, idx) => (
                      <li
                        key={idx}
                        className="group/approach flex items-start gap-3 p-3 rounded-xl bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors shadow-2xs"
                      >
                        <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-xs sm:text-sm text-foreground/90 font-medium leading-snug">
                          {approach}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Expectation Statement */}
              <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-primary/10 border border-blue-500/20 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block mb-1">
                    Komitmen Kami Untuk Setiap Siswa
                  </span>
                  <p className="text-xs sm:text-sm md:text-base font-medium text-foreground italic leading-relaxed">
                    "{EXCELLENT_PROGRAMS.klinikBelajar.expectationStatement}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Ekstrakurikuler Section */}
      <section id="ekstrakurikuler" className="py-16 md:py-24 bg-muted/20 relative">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold shadow-2xs">
              <Trophy className="h-4 w-4" />
              <span>Pengembangan Minat & Bakat</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ekstrakurikuler
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Mengembangkan minat, bakat, dan potensi diri siswa di luar jam pelajaran akademik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <ExtraActivity
              title="Tapak Suci"
              description="Seni bela diri khas Muhammadiyah untuk melatih ketangkasan, kedisiplinan, dan keberanian."
              icon="shield"
              schedule="Sabtu, 08:00 - 10:00 WIB"
              imageUrl="/images/mim_hero_main.jpg"
            />
            <ExtraActivity
              title="Hizbul Wathan (HW)"
              description="Kepanduan Islami untuk membentuk jiwa kepemimpinan, kemandirian, dan cinta tanah air."
              icon="users"
              schedule="Jumat, 14:00 - 16:00 WIB"
              imageUrl="/images/mim_hero_main.jpg"
            />
            <ExtraActivity
              title="Tahfidz Qur'an"
              description="Program khusus bagi siswa yang ingin mendalami dan menambah hafalan Al-Qur'an secara intensif."
              icon="book"
              schedule="Selasa & Kamis, 14:00 - 15:30 WIB"
              imageUrl="/images/mim_tahfidz_learning.jpg"
            />
            <ExtraActivity
              title="Seni & Drumband"
              description="Pengembangan kreativitas melalui musik, olah vokal, dan seni pertunjukan."
              icon="music"
              schedule="Rabu, 14:00 - 16:00 WIB"
              imageUrl="/images/mim_hero_main.jpg"
            />
          </div>
        </div>
      </section>

      {/* 6. CTA & Konsultasi Section */}
      <section id="kontak-konsultasi" className="py-16 md:py-24 bg-primary/20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 text-primary text-xs sm:text-sm font-semibold shadow-2xs">
            <Phone className="h-4 w-4" />
            <span>Layanan Konsultasi & Pendaftaran</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Ingin Tahu Lebih Lanjut?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Dapatkan informasi lengkap mengenai kurikulum, biaya pendidikan, dan prosedur pendaftaran dengan menghubungi tim admin kami.
          </p>

          {/* Contact Highlights Badges */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background/80 border border-border/60 text-xs font-medium text-foreground shadow-2xs">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>Hotline WhatsApp: <strong>{SCHOOL_WHATSAPP}</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background/80 border border-border/60 text-xs font-medium text-foreground shadow-2xs">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Email: <strong>{SCHOOL_EMAIL}</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 min-h-[44px] shadow-sm"
            >
              <Link href="/kontak">
                <span>Hubungi Kami</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-full border-primary text-primary hover:bg-primary/10 font-semibold h-12 px-8 min-h-[44px]"
            >
              <Link href="/pendaftaran">
                <Phone className="mr-2 h-5 w-5" />
                <span>Daftar Sekarang</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
