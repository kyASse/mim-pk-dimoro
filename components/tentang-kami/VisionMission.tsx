"use client";

import { VISION_MISSION } from "@/lib/school-data";
import { CheckCircle2, Target, HeartHandshake, Compass } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export default function VisionMission() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 md:py-24 bg-muted/40 border-y border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 space-y-12">
        {/* Header section with motto */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20">
            <Compass className="w-4 h-4" />
            <span>Visi & Misi Madrasah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Arah & Komitmen Pendidikan Kami
          </h2>
          <p className="text-muted-foreground italic text-base sm:text-lg font-medium leading-relaxed bg-card p-4 rounded-2xl border border-border/50 max-w-2xl mx-auto">
            "{VISION_MISSION.motto}"
          </p>
        </motion.div>

        {/* Vision Card */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-primary/30 rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-md shrink-0 mt-1">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">Visi Utama</h3>
              <p className="text-base sm:text-lg text-foreground/90 font-medium leading-relaxed">
                {VISION_MISSION.vision}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Indicators and Missions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Indikator Visi */}
          <motion.div 
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">7 Indikator Visi</h3>
              </div>
              <ul className="space-y-3.5">
                {VISION_MISSION.visionIndicators.map((indicator, index) => (
                  <li key={index} className="flex items-start gap-3 text-xs sm:text-sm md:text-base text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-snug">{indicator}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Misi Utama */}
          <motion.div 
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">8 Misi Utama</h3>
              </div>
              <ul className="space-y-3.5">
                {VISION_MISSION.missions.map((mission, index) => (
                  <li key={index} className="flex items-start gap-3 text-xs sm:text-sm md:text-base text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-snug">{mission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
