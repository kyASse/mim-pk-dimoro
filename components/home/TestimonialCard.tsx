"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { SCHOOL_LOGO_PATH } from "@/lib/school-config";

interface TestimonialCardProps {
    name: string;
    role: string;
    testimonial: string;
    avatarUrl?: string;
    index?: number;
}

const DEFAULT_AVATAR = SCHOOL_LOGO_PATH;

export default function TestimonialCard({ name, role, testimonial, avatarUrl, index = 0 }: TestimonialCardProps) {
    const shouldReduceMotion = useReducedMotion();
    const safeAvatar = avatarUrl && avatarUrl.trim() !== "" ? avatarUrl : DEFAULT_AVATAR;

    return (
        <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card rounded-3xl p-6 sm:p-7 border border-border/60 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-primary/40 transition-all h-full"
        >
            <div>
                {/* Rating stars & quote icon */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ))}
                    </div>
                    <Quote className="w-6 h-6 text-primary/20" />
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed line-clamp-4 italic mb-6">
                    "{testimonial}"
                </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border/40 mt-auto">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-primary/10 border border-primary/20 shrink-0">
                    <Image 
                        src={safeAvatar}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-foreground leading-snug">{name}</h3>
                    <p className="text-xs text-muted-foreground">{role}</p>
                </div>
            </div>
        </motion.div>
    );
}