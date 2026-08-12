"use client";

import {
    BookOpen,
    Brain,
    Heart,
    Users,
    Award,
    Star,
    Smile,
    Sparkles
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface ValueCardProps {
    title: string;
    description: string;
    icon: React.ReactNode | string;
    color: "primary" | "secondary" | "accent" | "highlight" | "attention";
}

export default function ValueCard({ title, description, icon, color }: ValueCardProps) {
    const shouldReduceMotion = useReducedMotion();

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'book':
                return <BookOpen className="w-7 h-7" />;
            case 'brain':
                return <Brain className="w-7 h-7" />;
            case 'heart':
                return <Heart className="w-7 h-7" />;
            case 'users':
                return <Users className="w-7 h-7" />;
            case 'award':
                return <Award className="w-7 h-7" />;
            case 'star':
                return <Star className="w-7 h-7" />;
            case 'smile':
                return <Smile className="w-7 h-7" />;
            case 'sparkles':
                return <Sparkles className="w-7 h-7" />;
            default:
                return <BookOpen className="w-7 h-7" />;
        }
    };

    const getColorClasses = (colorName: string) => {
        switch (colorName) {
            case 'primary':
                return {
                    bg: 'bg-primary/10',
                    border: 'border-primary/30',
                    text: 'text-primary',
                    hover: 'hover:border-primary/50'
                };
            case 'highlight':
                return {
                    bg: 'bg-amber-gold-surface',
                    border: 'border-amber-gold/40',
                    text: 'text-amber-gold',
                    hover: 'hover:border-amber-gold/60'
                };
            case 'secondary':
                return {
                    bg: 'bg-sky-500/10',
                    border: 'border-sky-500/30',
                    text: 'text-sky-700 dark:text-sky-300',
                    hover: 'hover:border-sky-500/50'
                };
            case 'accent':
                return {
                    bg: 'bg-secondary/40',
                    border: 'border-primary/20',
                    text: 'text-secondary-foreground',
                    hover: 'hover:border-primary/40'
                };
            default:
                return {
                    bg: 'bg-primary/10',
                    border: 'border-primary/30',
                    text: 'text-primary',
                    hover: 'hover:border-primary/50'
                };
        }
    };

    const colorClasses = getColorClasses(color);

    return (
        <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn(
                "rounded-3xl p-6 sm:p-7 border bg-card shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-between group",
                colorClasses.border,
                colorClasses.hover
            )}
        >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors", colorClasses.bg, colorClasses.text)}>
                {getIcon(typeof icon === "string" ? icon : "book")}
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}