"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
interface ProgramCardProps {
    title: string;
    description: string;
    image: string;
    href: string;
    variant?: "tahfidz" | "klinik" | "default";
}

export default function ProgramCard({ title, description, image, href, variant = "default" }: ProgramCardProps) {
    return (
        <div className={cn(
            "overflow-hidden rounded-3xl bg-card border shadow-sm flex flex-col h-full transition-all group",
            variant === "tahfidz" && "border-amber-gold/40 bg-amber-gold-surface hover:shadow-md hover:border-amber-gold/60",
            variant === "klinik" && "border-sky-500/30 bg-sky-500/5 hover:shadow-md hover:border-sky-500/50",
            variant === "default" && "border-border/60 hover:shadow-md hover:border-primary/40"
        )}>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            
            <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                    {variant === "tahfidz" && (
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-gold/20 text-amber-800 dark:text-amber-200 mb-3">
                            Target Hafalan Mutqin
                        </span>
                    )}
                    {variant === "klinik" && (
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 mb-3">
                            Bimbingan Personal Gratis
                        </span>
                    )}
                    {variant === "default" && (
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary mb-3">
                            Karakter & Talent
                        </span>
                    )}

                    <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {description}
                    </p>
                </div>

                <Button asChild variant={variant === "tahfidz" ? "default" : "outline"} className={cn(
                    "w-full rounded-full font-semibold justify-between min-h-[44px]",
                    variant === "tahfidz" && "bg-amber-gold hover:bg-amber-gold/90 text-amber-gold-foreground border-amber-gold",
                    variant === "klinik" && "border-sky-500/40 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10",
                    variant === "default" && "border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                )}>
                    <Link href={href}>
                        <span>Pelajari Program</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}