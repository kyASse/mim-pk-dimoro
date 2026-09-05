"use client";

import { VISION_MISSION } from "@/lib/school-data";
import {
  Compass,
  Target,
  BookOpen,
  Trophy,
  Heart,
  Lightbulb,
  Leaf,
  ShieldCheck,
  Award,
  Users,
  GraduationCap,
  HeartHandshake,
  Quote,
  CheckCircle2,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

// Contextual metadata for the 7 Vision Indicators
const INDICATOR_CONFIGS = [
  {
    icon: BookOpen,
    category: "Aqidah & Syariah",
    color: "emerald",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Trophy,
    category: "Prestasi Global",
    color: "amber",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Heart,
    category: "Akhlakul Karimah",
    color: "rose",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    iconBgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    icon: BookOpen,
    category: "Tahfidz Qur'an",
    color: "teal",
    badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    iconBgClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  {
    icon: Lightbulb,
    category: "Kritis & Digital",
    color: "blue",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Leaf,
    category: "Wawasan Lingkungan",
    color: "emerald",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: ShieldCheck,
    category: "Tata Kelola Profesional",
    color: "purple",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    iconBgClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

// Contextual metadata for the 8 Missions
const MISSION_CONFIGS = [
  {
    icon: Compass,
    category: "Pendidikan Terpadu",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    iconBgClass: "bg-primary/10 text-primary",
  },
  {
    icon: Lightbulb,
    category: "Pembelajaran Inovatif",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: BookOpen,
    category: "Tahfidz & Kajian",
    badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    iconBgClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  {
    icon: Award,
    category: "Bakat & Potensi",
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    iconBgClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: Users,
    category: "Karakter & Disiplin",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    iconBgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    icon: GraduationCap,
    category: "SDM Pendidik",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Leaf,
    category: "Sekolah Sehat & Hijau",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: HeartHandshake,
    category: "Kemitraan Komunitas",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    iconBgClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

export default function VisionMission() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 md:py-24 bg-muted/30 border-y border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 space-y-12 sm:space-y-16">
        {/* Header section with motto */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20 shadow-xs">
            <Compass className="w-4 h-4" />
            <span>Visi & Misi Madrasah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Arah & Komitmen Pendidikan Kami
          </h2>
          <div className="relative bg-card/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-primary/20 shadow-sm max-w-2xl mx-auto">
            <Quote className="w-5 h-5 text-primary/40 absolute top-3 left-3 -scale-x-100 hidden sm:block" />
            <p className="text-muted-foreground italic text-sm sm:text-base md:text-lg font-medium leading-relaxed px-2 sm:px-6">
              "{VISION_MISSION.motto}"
            </p>
          </div>
        </motion.div>

        {/* Vision Card - Inspiring Manifesto Banner */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 dark:to-primary/10 p-6 sm:p-8 md:p-10 shadow-sm"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
            <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-md shrink-0 self-start">
              <Target className="w-8 h-8" />
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                  Manifesto Madrasah
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Visi Utama</h3>
              </div>
              <p className="text-base sm:text-lg md:text-xl font-semibold text-foreground/90 leading-relaxed">
                {VISION_MISSION.vision}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Indicators and Missions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Indikator Visi Bento Card */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between border-b border-border/50 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">7 Indikator Visi</h3>
                  <p className="text-xs text-muted-foreground">Tolok ukur keberhasilan visi madrasah</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                7 Indikator
              </span>
            </div>

            {/* Micro-feature cards */}
            <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
              {VISION_MISSION.visionIndicators.map((indicator, index) => {
                const config = INDICATOR_CONFIGS[index] || INDICATOR_CONFIGS[0];
                const IconComponent = config.icon;

                return (
                  <div
                    key={index}
                    className="p-3.5 sm:p-4 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/40 hover:bg-muted/40 transition-all flex items-start gap-3.5 group"
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${config.iconBgClass}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md border ${config.badgeClass}`}
                        >
                          {config.category}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-muted-foreground/70">
                          #{String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-foreground/90 leading-snug">
                        {indicator}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Misi Utama Bento Card */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between border-b border-border/50 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">8 Misi Utama</h3>
                  <p className="text-xs text-muted-foreground">Langkah strategis perwujudan cita-cita madrasah</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                8 Misi
              </span>
            </div>

            {/* Micro-feature cards */}
            <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
              {VISION_MISSION.missions.map((mission, index) => {
                const config = MISSION_CONFIGS[index] || MISSION_CONFIGS[0];
                const IconComponent = config.icon;

                return (
                  <div
                    key={index}
                    className="p-3.5 sm:p-4 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/40 hover:bg-muted/40 transition-all flex items-start gap-3.5 group"
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${config.iconBgClass}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md border ${config.badgeClass}`}
                        >
                          {config.category}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-muted-foreground/70">
                          #{String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-foreground/90 leading-snug">
                        {mission}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

