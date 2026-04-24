"use client"

import Image from "next/image";
import { motion } from "motion/react";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
    name: string;
    role: string;
    testimonial: string;
    avatarUrl?: string;
}

const DEFAULT_AVATAR = "/avatar-man-placeholder.png";

export default function TestimonialCard({name, role, testimonial, avatarUrl}: TestimonialCardProps) {
    const safeAvatar = avatarUrl && avatarUrl.trim() !== "" ? avatarUrl : DEFAULT_AVATAR;
    
        return (
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping:17 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-muted h-full flex flex-col"
            >
                <div className="relative mb-4">
                    <Quote className="w-10 h-10 text-primary opacity-20 absolute -top-4 -left-2" />
                    <p className="text-muted-foreground relative z-10">{testimonial}</p>
                </div>
                <div className="flex items-center mt-auto pt-4 border-t border-muted">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image 
                            src={safeAvatar}
                            alt={name}
                            fill
                            className="objective-cover"
                        />
                    </div>
                    <div className="ml-3">
                        <h4 className="font-semibold">{name}</h4>
                        <p className="text-sm text-muted-foreground">{role}</p>
                    </div>
                </div>
            </motion.div>
        )
    }