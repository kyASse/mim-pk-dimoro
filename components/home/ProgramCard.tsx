"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface ProgramCardProps {
    title: string;
    description: string;
    image: string;
    href: string;
}

export default function ProgramCard({ title, description, image, href }: ProgramCardProps) {
    return (
        <div className="overflow-hidden rounded-3xl bg-card border border-border/60 shadow-sm flex flex-col h-full hover:shadow-md hover:border-primary/40 transition-all group">
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
                    <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {description}
                    </p>
                </div>

                <Link href={href} className="w-full block">
                    <Button variant="outline" className="w-full rounded-full border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 font-semibold justify-between">
                        <span>Pelajari Program</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}