"use client"

import {
    BookOpen,
    Brain,
    Activity,
    Users,
    Heart,
    Music,
    BookMarked,
    Shapes
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    color: 'primary' | 'secondary' | 'accent' | 'highlight' | 'attention';
}

export default function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'book':
                return <BookOpen className="w-8 h-8" />;
            case 'brain':
                return <Brain className="w-8 h-8" />;
            case 'activity':
                return <Activity className="w-8 h-8" />;
            case 'users':
                return <Users className="w-8 h-8" />;
            case 'heart':
                return <Heart className="w-8 h-8" />;
            case 'music':
                return <Music className="w-8 h-8" />;
            case 'bookmarked':
                return <BookMarked className="w-8 h-8" />;
            case 'shapes':
                return <Shapes className="w-8 h-8" />;
            default:
                return <BookOpen className="w-8 h-8" />;
        }
    }

    const getColorClasses = (colorName: string) => {
        switch (colorName) {
            case 'primary':
                return {
                    bg: 'bg-primary/20',
                    border: 'border-primary',
                    text: 'text-primary-foreground',
                    hover: 'hover:bg-primary/30'
                }
            case 'secondary':
                return {
                    bg: 'bg-secondary/20',
                    border: 'border-secondary',
                    text: 'text-secondary-foreground',
                    hover: 'hover:bg-secondary/30'
                }
            case 'accent':
                return {
                    bg: 'bg-accent/20',
                    border: 'border-accent',
                    text: 'text-accent-foreground',
                    hover: 'hover:bg-accent/30'
                }
            case 'highlight':
                return {
                    bg: 'bg-highlight/20',
                    border: 'border-highlight',
                    text: 'text-highlight-foreground',
                    hover: 'hover:bg-highlight/30'
                }
            case 'attention':
                return {
                    bg: 'bg-attention/20',
                    border: 'border-attention',
                    text: 'text-attention-foreground',
                    hover: 'hover:bg-attention/30'
                }
            default:
                return {
                    bg: 'bg-primary/20',
                    border: 'border-primary',
                    text: 'text-primary-foreground',
                    hover: 'hover:bg-primary/30'
                }
        }
    }

    const colorClasses = getColorClasses(color);

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className={cn(
                "rounded-2xl p-6 border-2",
                colorClasses.bg,
                colorClasses.border,
                colorClasses.hover,
                "transition-all duration-300"
            )}
        >
            <div className={cn(
                "rounded-full w-16 h-16 flex items-center justify-center mb-4",
                colorClasses.bg
            )}>
                <div className={colorClasses.text}>
                    {getIcon(icon)}
                </div>
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </motion.div>
    )
}