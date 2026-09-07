"use client";

import React from "react";
import Image from "next/image";
import { Clock, Check, CalendarDays, Layers } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

interface ScheduleItem {
  day: string;
  hours: string;
}

interface ProgramDetailsProps {
  title: string;
  description: string;
  imageUrl: string;
  schedule: ScheduleItem[];
  features: string[];
}

export default function ProgramDetails({
  title,
  description,
  imageUrl,
  schedule,
  features,
}: ProgramDetailsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="group overflow-hidden rounded-2xl md:rounded-3xl bg-card border border-border/80 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left / Top Image Surface */}
        <div className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-full lg:col-span-5 overflow-hidden bg-muted/40">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />
          
          {/* Badge over image */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-background/90 text-foreground backdrop-blur-md border border-border/40 shadow-xs">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Struktur Jenjang
            </span>
          </div>
        </div>

        {/* Right / Main Content */}
        <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 flex flex-col justify-between space-y-6 sm:space-y-8 bg-card">
          {/* Header */}
          <div className="space-y-2.5">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Schedule Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>Jadwal Pembelajaran</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 dark:bg-muted/20 border border-border/60 transition-colors hover:bg-muted/50"
                >
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background font-semibold text-xs text-foreground border border-border/40 shadow-2xs">
                    <CalendarDays className="w-3 h-3 text-primary" />
                    {item.day}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-foreground/90">
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Fokus & Muatan Pembelajaran</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: shouldReduceMotion ? 0 : index * 0.04,
                  }}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/20 dark:bg-muted/15 border border-border/50 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground/90 leading-snug">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}