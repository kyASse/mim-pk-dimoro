"use client";

import React from "react";
import {
    BookOpen,
    Brain,
    Heart,
    Users,
    Award,
    Star,
    Smile,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ValueCardProps {
    title: string;
    description: string;
    icon: React.ReactNode | string;
    color: "primary" | "secondary" | "accent" | "highlight" | "attention";
}

const colorStyles: Record<
    ValueCardProps["color"],
    {
        border: string;
        borderHover: string;
        iconBg: string;
        glow: string;
        accentText: string;
    }
> = {
    primary: {
        border: "border-emerald-500/20",
        borderHover: "group-hover:border-emerald-500/40 hover:border-emerald-500/40",
        iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        glow: "from-emerald-500/15 via-emerald-500/5 to-transparent",
        accentText: "text-emerald-600 dark:text-emerald-400",
    },
    highlight: {
        border: "border-amber-500/25",
        borderHover: "group-hover:border-amber-500/50 hover:border-amber-500/50",
        iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        glow: "from-amber-500/15 via-amber-500/5 to-transparent",
        accentText: "text-amber-600 dark:text-amber-400",
    },
    secondary: {
        border: "border-sky-500/20",
        borderHover: "group-hover:border-sky-500/40 hover:border-sky-500/40",
        iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
        glow: "from-sky-500/15 via-sky-500/5 to-transparent",
        accentText: "text-sky-600 dark:text-sky-400",
    },
    accent: {
        border: "border-indigo-500/20",
        borderHover: "group-hover:border-indigo-500/40 hover:border-indigo-500/40",
        iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        glow: "from-indigo-500/15 via-indigo-500/5 to-transparent",
        accentText: "text-indigo-600 dark:text-indigo-400",
    },
    attention: {
        border: "border-rose-500/20",
        borderHover: "group-hover:border-rose-500/40 hover:border-rose-500/40",
        iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        glow: "from-rose-500/15 via-rose-500/5 to-transparent",
        accentText: "text-rose-600 dark:text-rose-400",
    },
};

export default function ValueCard({ title, description, icon, color }: ValueCardProps) {
    const shouldReduceMotion = useReducedMotion();

    const renderIcon = () => {
        if (typeof icon !== "string") {
            return icon;
        }

        switch (icon.toLowerCase()) {
            case "book":
                return <BookOpen className="w-7 h-7" />;
            case "brain":
                return <Brain className="w-7 h-7" />;
            case "heart":
                return <Heart className="w-7 h-7" />;
            case "users":
                return <Users className="w-7 h-7" />;
            case "award":
                return <Award className="w-7 h-7" />;
            case "star":
                return <Star className="w-7 h-7" />;
            case "smile":
                return <Smile className="w-7 h-7" />;
            case "shield":
                return <ShieldCheck className="w-7 h-7" />;
            case "sparkles":
            default:
                return <Sparkles className="w-7 h-7" />;
        }
    };

    const style = colorStyles[color] || colorStyles.primary;

    return (
        <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className={cn(
                "group relative overflow-hidden rounded-3xl p-6 sm:p-7 border bg-card shadow-xs hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center justify-between",
                style.border,
                style.borderHover
            )}
        >
            {/* Ambient subtle gradient glow on top/hover */}
            <div
                className={cn(
                    "absolute -top-16 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-gradient-to-b opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none",
                    style.glow
                )}
            />

            <div className="relative z-10 flex flex-col items-center">
                {/* Icon Container with double ring / glass aesthetic */}
                <div
                    className={cn(
                        "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 border transition-transform duration-300 group-hover:scale-110 shadow-xs",
                        style.iconBg
                    )}
                >
                    {renderIcon()}
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2.5 transition-colors group-hover:text-primary">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Subtle bottom indicator line */}
            <div className="relative z-10 mt-5 pt-3 w-full flex justify-center">
                <div className="w-8 h-1 rounded-full bg-border group-hover:w-16 group-hover:bg-primary transition-all duration-300" />
            </div>
        </motion.div>
    );
}