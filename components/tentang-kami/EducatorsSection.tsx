"use client";

import { COMPETENT_EDUCATORS } from "@/lib/school-data";
import {
  GraduationCap,
  Award,
  Sparkles,
  BookOpen,
  Heart,
  Compass,
  Laptop,
  Users,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

// Contextual metadata for the 8 Teacher Quality Programs
const PROGRAM_CONFIGS = [
  {
    icon: Sparkles,
    badge: "Pedagogi Aktif",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Award,
    badge: "Sertifikasi Profesi",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    iconBgClass: "bg-primary/10 text-primary",
  },
  {
    icon: BookOpen,
    badge: "Kurikulum & Asesmen",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Heart,
    badge: "Tahsin & Tahfidz",
    badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    iconBgClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  {
    icon: Compass,
    badge: "Jejaring Kolaboratif",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    iconBgClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    icon: Laptop,
    badge: "Media & TI Digital",
    badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    iconBgClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: GraduationCap,
    badge: "Kompetensi Guru",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Users,
    badge: "Supervisi & Mentoring",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    iconBgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
];

// Contextual metadata for the 5 Teacher Commitments
const COMMITMENT_CONFIGS = [
  {
    icon: HeartHandshake,
    badge: "Keteladanan",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: ShieldCheck,
    badge: "Inklusif & Ramah",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    iconBgClass: "bg-primary/10 text-primary",
  },
  {
    icon: Sparkles,
    badge: "Adaptif & Maju",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Users,
    badge: "Sinergi Kemitraan",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Award,
    badge: "Integritas Moral",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    iconBgClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

export default function EducatorsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 md:py-24 bg-muted/30 border-y border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 space-y-12 sm:space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20 shadow-xs">
            <GraduationCap className="w-4 h-4" />
            <span>Pendidik Berdedikasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            <span className="sr-only">Pendidik & Tenaga Kependidikan</span>
            {COMPETENT_EDUCATORS.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            {COMPETENT_EDUCATORS.description}
          </p>
        </motion.div>

        {/* 8 Educator Programs Showcase */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Program Pengembangan & Peningkatan Kualitas Guru
              </h3>
            </div>
            <span className="text-xs font-semibold text-muted-foreground sm:text-right">
              8 Inisiatif Peningkatan Mutu Berkelanjutan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {COMPETENT_EDUCATORS.programs.map((program, index) => {
              const config = PROGRAM_CONFIGS[index] || PROGRAM_CONFIGS[0];
              const IconComponent = config.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`p-2 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${config.iconBgClass}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-muted-foreground/60">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span
                        className={`inline-block text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md border ${config.badgeClass}`}
                      >
                        {config.badge}
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-foreground/90 leading-snug">
                        {program}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 5 Guru Commitments Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-primary/25 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden space-y-8"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-md shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  Komitmen Pendidik MIM PK Dimoro
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  5 Prinsip dan etika luhur yang menjiwai setiap keteladanan pendidik
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              5 Nilai Komitmen
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {COMPETENT_EDUCATORS.commitments.map((commitment, index) => {
              const config = COMMITMENT_CONFIGS[index] || COMMITMENT_CONFIGS[0];
              const IconComponent = config.icon;

              return (
                <div
                  key={index}
                  className={`p-5 rounded-2xl bg-muted/20 border border-border/60 hover:border-primary/40 hover:bg-muted/30 transition-all flex flex-col justify-between space-y-3 group ${
                    index === 0 ? "md:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`p-2 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${config.iconBgClass}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md border ${config.badgeClass}`}
                    >
                      {config.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-foreground/90 leading-relaxed">
                    {commitment}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

