"use client";

import React, { useState } from "react";
import { INTEGRATED_CURRICULUM } from "@/lib/school-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Heart,
  Compass,
  ShieldCheck,
  Award,
  Sparkles,
  Trophy,
  Clock,
  Layers,
  GraduationCap,
  Sparkle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

interface PillarMeta {
  icon: React.ElementType;
  number: string;
  category: string;
  tagline: string;
  badgeBg: string;
  textColor: string;
  accentBorder: string;
  gradientGlow: string;
}

const PILLAR_METADATA: Record<string, PillarMeta> = {
  akademik: {
    icon: BookOpen,
    number: "01",
    category: "Keunggulan Akademik",
    tagline: "Kurikulum Merdeka, Literasi Dasar & Numerasi Digital",
    badgeBg: "bg-blue-500/10 dark:bg-blue-500/20",
    textColor: "text-blue-600 dark:text-blue-400",
    accentBorder: "group-hover:border-blue-500/40",
    gradientGlow: "from-blue-500/10 via-transparent to-transparent",
  },
  "al-islam": {
    icon: Heart,
    number: "02",
    category: "Pondasi Keislaman",
    tagline: "Aqidah Akhlak, Fikih Ibadah & Tahfidz Al-Qur'an",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    textColor: "text-emerald-600 dark:text-emerald-400",
    accentBorder: "group-hover:border-emerald-500/40",
    gradientGlow: "from-emerald-500/10 via-transparent to-transparent",
  },
  kemuhammadiyahan: {
    icon: Compass,
    number: "03",
    category: "Kader Persyarikatan",
    tagline: "Ideologi, Bahasa Arab & Kepanduan HW",
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/20",
    textColor: "text-amber-600 dark:text-amber-400",
    accentBorder: "group-hover:border-amber-500/40",
    gradientGlow: "from-amber-500/10 via-transparent to-transparent",
  },
  "karakter-islami": {
    icon: ShieldCheck,
    number: "04",
    category: "Akhlak & Adab",
    tagline: "Penguatan Karakter, Budaya 5S & Infaq Harian",
    badgeBg: "bg-rose-500/10 dark:bg-rose-500/20",
    textColor: "text-rose-600 dark:text-rose-400",
    accentBorder: "group-hover:border-rose-500/40",
    gradientGlow: "from-rose-500/10 via-transparent to-transparent",
  },
  kepemimpinan: {
    icon: Award,
    number: "05",
    category: "Kepemimpinan Siswa",
    tagline: "Organisasi Siswa, Peer Mentoring & Kepekaan Sosial",
    badgeBg: "bg-purple-500/10 dark:bg-purple-500/20",
    textColor: "text-purple-600 dark:text-purple-400",
    accentBorder: "group-hover:border-purple-500/40",
    gradientGlow: "from-purple-500/10 via-transparent to-transparent",
  },
  "life-skill": {
    icon: Sparkles,
    number: "06",
    category: "Keterampilan Abad 21",
    tagline: "Problem Solving, Koding & Green School",
    badgeBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    textColor: "text-cyan-600 dark:text-cyan-400",
    accentBorder: "group-hover:border-cyan-500/40",
    gradientGlow: "from-cyan-500/10 via-transparent to-transparent",
  },
  ekstrakurikuler: {
    icon: Trophy,
    number: "07",
    category: "Bakat & Prestasi",
    tagline: "Pengembangan Minat Olahraga, Seni & Sains",
    badgeBg: "bg-orange-500/10 dark:bg-orange-500/20",
    textColor: "text-orange-600 dark:text-orange-400",
    accentBorder: "group-hover:border-orange-500/40",
    gradientGlow: "from-orange-500/10 via-transparent to-transparent",
  },
  "pembiasaan-harian": {
    icon: Clock,
    number: "08",
    category: "Habit & Ibadah Harian",
    tagline: "Shalat Dhuha, Muroja'ah Pagi & Gerakan LISA",
    badgeBg: "bg-teal-500/10 dark:bg-teal-500/20",
    textColor: "text-teal-600 dark:text-teal-400",
    accentBorder: "group-hover:border-teal-500/40",
    gradientGlow: "from-teal-500/10 via-transparent to-transparent",
  },
};

export default function IntegratedCurriculumSection() {
  const [activePillar, setActivePillar] = useState(
    INTEGRATED_CURRICULUM.pillarDetails[0]?.id || "akademik"
  );
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden"
      id="kurikulum-terpadu"
    >
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold shadow-2xs">
            <Layers className="h-4 w-4" />
            <span>8 Pilar Kurikulum Holistik</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            {INTEGRATED_CURRICULUM.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            {INTEGRATED_CURRICULUM.description}
          </p>
        </motion.div>

        {/* Tabs Explorer */}
        <Tabs
          value={activePillar}
          onValueChange={setActivePillar}
          className="w-full space-y-6"
        >
          {/* Responsive Tab Bar */}
          <div className="w-full overflow-x-auto no-scrollbar pb-2 pt-1">
            <TabsList className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-1.5 bg-muted/60 dark:bg-muted/30 backdrop-blur-md rounded-2xl border border-border/60 min-w-max sm:min-w-0">
              {INTEGRATED_CURRICULUM.pillarDetails.map((pillar) => {
                const meta = PILLAR_METADATA[pillar.id] || {
                  icon: BookOpen,
                  number: "01",
                  category: "Pilar Kurikulum",
                  tagline: "",
                  badgeBg: "bg-primary/10",
                  textColor: "text-primary",
                  accentBorder: "group-hover:border-primary/40",
                  gradientGlow: "from-primary/10 via-transparent to-transparent",
                };
                const IconComponent = meta.icon;
                const isActive = activePillar === pillar.id;

                return (
                  <TabsTrigger
                    key={pillar.id}
                    value={pillar.id}
                    className={cn(
                      "flex items-center justify-center sm:flex-col lg:flex-row gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shrink-0",
                      "border border-transparent",
                      "hover:bg-background/60 hover:text-foreground",
                      isActive
                        ? "bg-card text-foreground shadow-sm border-border/80 ring-1 ring-border/50 font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "p-1.5 rounded-lg transition-colors shrink-0",
                        isActive ? meta.badgeBg + " " + meta.textColor : "bg-muted text-muted-foreground"
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                    </span>
                    <span className="truncate">{pillar.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Active Pillar Card Content */}
          {INTEGRATED_CURRICULUM.pillarDetails.map((pillar) => {
            const meta = PILLAR_METADATA[pillar.id] || {
              icon: BookOpen,
              number: "01",
              category: "Pilar Kurikulum",
              tagline: "",
              badgeBg: "bg-primary/10",
              textColor: "text-primary",
              accentBorder: "group-hover:border-primary/40",
              gradientGlow: "from-primary/10 via-transparent to-transparent",
            };
            const IconComponent = meta.icon;

            return (
              <TabsContent
                key={pillar.id}
                value={pillar.id}
                className="mt-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={cn(
                    "relative overflow-hidden rounded-3xl bg-card border border-border/80 p-6 sm:p-8 md:p-10 shadow-sm"
                  )}
                >
                  {/* Subtle Accent Glow */}
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl rounded-full blur-3xl pointer-events-none opacity-50",
                      meta.gradientGlow
                    )}
                  />

                  {/* Header Info */}
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/60">
                    <div className="flex items-start gap-4 sm:gap-5">
                      <div
                        className={cn(
                          "p-3.5 sm:p-4 rounded-2xl shrink-0 shadow-2xs",
                          meta.badgeBg,
                          meta.textColor
                        )}
                      >
                        <IconComponent className="h-7 w-7 sm:h-8 sm:w-8" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className={cn(
                              "text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md",
                              meta.badgeBg,
                              meta.textColor
                            )}
                          >
                            Pilar {meta.number} &bull; {meta.category}
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                          Pilar {pillar.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                          {pillar.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0 px-3.5 py-1.5 rounded-full bg-muted/60 border border-border/60 text-xs font-medium text-muted-foreground">
                      <Sparkle className="h-3.5 w-3.5 text-primary" />
                      <span>{pillar.items.length} Fokus Program</span>
                    </div>
                  </div>

                  {/* Items Grid */}
                  <div className="relative z-10 mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Fokus & Program Kegiatan Unggulan:
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {pillar.items.map((item, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "group flex items-start gap-3.5 p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 border border-border/50 transition-all duration-200",
                            meta.accentBorder
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold mt-0.5 transition-colors",
                              meta.badgeBg,
                              meta.textColor
                            )}
                          >
                            {idx + 1}
                          </div>
                          <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground leading-snug">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}
