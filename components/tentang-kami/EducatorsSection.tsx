"use client";

import { COMPETENT_EDUCATORS } from "@/lib/school-data";
import { GraduationCap, Award, CheckCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export default function EducatorsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 md:py-24 bg-muted/30 border-y border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 space-y-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            <span className="sr-only">Pendidik & Tenaga Kependidikan</span>
            {COMPETENT_EDUCATORS.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            {COMPETENT_EDUCATORS.description}
          </p>
        </motion.div>

        {/* 8 Educator Programs Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Program Pengembangan & Peningkatan Kualitas Guru
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPETENT_EDUCATORS.programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex items-start gap-3.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-xs sm:text-sm font-medium text-foreground/90 leading-snug">
                  {program}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5 Guru Commitments List */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Komitmen Pendidik MIM PK Dimoro</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Prinsip dan nilai utama yang dipegang teguh oleh seluruh tim pendidik.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPETENT_EDUCATORS.commitments.map((commitment, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-muted/20 border border-border/50 flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-medium text-foreground/90 leading-relaxed">
                  {commitment}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
