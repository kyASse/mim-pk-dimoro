import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
    title: string;
    description?: string;
    background?: string;
    badge?: string;
    children?: React.ReactNode;
    className?: string;
}

export default function PageHeader({
    title,
    description,
    background = "bg-primary/20",
    badge,
    children,
    className,
}: PageHeaderProps) {
    return (
        <section className={cn("relative py-12 md:py-16 mb-12 overflow-hidden", background, className)}>
            {/* Subtle ambient lighting orb (High-End Visual Design) */}
            <div
                aria-hidden="true"
                className="absolute -top-24 left-1/2 -translate-x-1/2 size-72 sm:size-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"
            />

            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Breadcrumbs with clean glass pill container */}
                    <div className="inline-flex items-center justify-center text-xs sm:text-sm text-muted-foreground bg-background/60 dark:bg-background/40 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-border/40 shadow-2xs mb-4">
                        <Link href="/" className="flex items-center hover:text-foreground transition-colors">
                            <Home className="h-3.5 w-3.5 mr-1.5" /> Beranda
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-muted-foreground/60" />
                        <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">{title}</span>
                    </div>

                    {/* Optional Eyebrow Pill Tag */}
                    {badge && (
                        <div className="mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary">
                                {badge}
                            </span>
                        </div>
                    )}

                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance text-foreground leading-[1.15]">
                        {title}
                    </h1>

                    {/* Subtitle / Description */}
                    {description && (
                        <p className="text-base sm:text-lg text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    )}

                    {/* Optional Custom Slots (e.g. periode badge, actions) */}
                    {children && <div className="mt-2">{children}</div>}
                </div>
            </div>
        </section>
    );
}