"use client";

import React from "react";
import Image from "next/image";
import {
  Music,
  Paintbrush,
  Activity,
  ChefHat,
  Shapes,
  Leaf,
  Shield,
  Users,
  Book,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

interface ExtraActivityProps {
  title: string;
  description: string;
  icon: string;
  schedule: string;
  imageUrl: string;
}

interface ActivityIconConfig {
  component: React.ElementType;
  bg: string;
  text: string;
  border: string;
}

const ICON_MAP: Record<string, ActivityIconConfig> = {
  music: {
    component: Music,
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/20",
  },
  paintbrush: {
    component: Paintbrush,
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20",
  },
  activity: {
    component: Activity,
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  "chef-hat": {
    component: ChefHat,
    bg: "bg-orange-500/10 dark:bg-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/20",
  },
  shapes: {
    component: Shapes,
    bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/20",
  },
  leaf: {
    component: Leaf,
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  shield: {
    component: Shield,
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  users: {
    component: Users,
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
  },
  book: {
    component: Book,
    bg: "bg-teal-500/10 dark:bg-teal-500/20",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500/20",
  },
};

export default function ExtraActivity({
  title,
  description,
  icon,
  schedule,
  imageUrl,
}: ExtraActivityProps) {
  const shouldReduceMotion = useReducedMotion();
  const iconConfig = ICON_MAP[icon] || {
    component: Sparkles,
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
  };
  const IconComponent = iconConfig.component;

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-card border border-border/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border"
    >
      {/* Image Side */}
      <div className="relative h-48 sm:h-auto sm:w-2/5 shrink-0 overflow-hidden bg-muted/40">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, 40vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
      </div>

      {/* Content Side */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4 bg-card">
        <div className="space-y-2.5">
          {/* Header with Icon Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${iconConfig.bg} ${iconConfig.text} border ${iconConfig.border} shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-2xs`}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Schedule Pill */}
        <div className="pt-2 border-t border-border/50">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 dark:bg-muted/30 border border-border/60 text-xs font-medium text-foreground/90">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-muted-foreground font-normal">Jadwal:</span>
            <span className="font-semibold">{schedule}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}